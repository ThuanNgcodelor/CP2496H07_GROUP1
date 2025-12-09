package com.example.orderservice.service;

import com.example.orderservice.client.GhnApiClient;
import com.example.orderservice.client.StockServiceClient;
import com.example.orderservice.client.UserServiceClient;
import com.example.orderservice.dto.*;
import com.example.orderservice.enums.OrderStatus;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.model.ShippingOrder;
import com.example.orderservice.repository.OrderRepository;
import com.example.orderservice.repository.ShippingOrderRepository;
import com.example.orderservice.request.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    // Get data for shop owner orders
    @Override
    public Page<Order> getOrdersByShopOwner(String shopOwnerId, String status, Integer pageNo, Integer pageSize) {
        // 1. Get all productIds belonging to this shop owner from stock-service
        List<String> productIds = stockServiceClient.getProductIdsByShopOwner(shopOwnerId).getBody();

        if (productIds == null || productIds.isEmpty()) {
            return Page.empty(); // No products = no orders
        }

        // 2. Query orders that have orderItems with these productIds
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        OrderStatus orderStatus = (status != null && !status.isEmpty())
                ? OrderStatus.valueOf(status.toUpperCase())
                : null;

        return orderRepository.findByShopOwnerProducts(productIds,pageable, orderStatus);
    }

    @Override
    public List<Order> getOrdersByShopOwner(String shopOwnerId, String status) {
        List<String> productIds = stockServiceClient.getProductIdsByShopOwner(shopOwnerId).getBody();
        if (productIds == null || productIds.isEmpty()) {
            return Collections.emptyList();
        }
        return orderRepository.findByOrderItemsProductIdIn(productIds);
    }

    private final OrderRepository orderRepository;
    private final StockServiceClient stockServiceClient;
    private final UserServiceClient userServiceClient;
    private final GhnApiClient ghnApiClient;
    private final ShippingOrderRepository shippingOrderRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final NewTopic orderTopic;
    private final NewTopic notificationTopic;
    private final KafkaTemplate<String, CheckOutKafkaRequest> kafkaTemplate;
    private final KafkaTemplate<String, SendNotificationRequest> kafkaTemplateSend;
    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Override
    public Order cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            return order;
        }
        if (order.getOrderStatus() == OrderStatus.DELIVERED || order.getOrderStatus() == OrderStatus.SHIPPED) {
            throw new RuntimeException("Cannot cancel an order that is already shipped or delivered");
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }


    ///////////////////////////////////////////////////////////////////////////////////
    @Override
    @Transactional
    public void orderByKafka(FrontendOrderRequest orderRequest, HttpServletRequest request){
        String author = request.getHeader("Authorization");
        CartDto cartDto = stockServiceClient.getCart(author).getBody();
        AddressDto address = userServiceClient.getAddressById(orderRequest.getAddressId()).getBody();
        if (address == null)
            throw new RuntimeException("Address not found for ID: " + orderRequest.getAddressId());
        if(cartDto == null || cartDto.getItems().isEmpty())
            throw new RuntimeException("Cart not found or empty");

        for (SelectedItemDto item : orderRequest.getSelectedItems()) {
            if (item.getSizeId() == null || item.getSizeId().isBlank()) {
                throw new RuntimeException("Size ID is required for product: " + item.getProductId());
            }
            
            ProductDto product = stockServiceClient.getProductById(item.getProductId()).getBody();
            if (product == null) {
                throw new RuntimeException("Product not found for ID: " + item.getProductId());
            }
            
            SizeDto size = stockServiceClient.getSizeById(item.getSizeId()).getBody();
            if (size == null) {
                throw new RuntimeException("Size not found for ID: " + item.getSizeId());
            }
            
            if (size.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName()
                        + ", size: " + size.getName() + ". Available: " + size.getStock() + ", Requested: " + item.getQuantity());
            }
        }

        CheckOutKafkaRequest kafkaRequest = CheckOutKafkaRequest.builder()
                .userId(cartDto.getUserId())
                .addressId(orderRequest.getAddressId())
                .cartId(cartDto.getId())
                .selectedItems(orderRequest.getSelectedItems())
                .build();

        kafkaTemplate.send(orderTopic.name(), kafkaRequest);
    }

    @KafkaListener(topics = "#{@orderTopic.name}", groupId = "order-service-checkout")
    @Transactional
    public void consumeCheckout(CheckOutKafkaRequest msg) {
        if (msg.getAddressId() == null || msg.getAddressId().isBlank()) {
            throw new RuntimeException("addressId is required in message");
        }
        if (msg.getSelectedItems() == null || msg.getSelectedItems().isEmpty()) {
            return;
        }
        try {
            for (SelectedItemDto item : msg.getSelectedItems()) {
                if (item.getSizeId() == null || item.getSizeId().isBlank()) {
                    throw new RuntimeException("Size ID is required for product: " + item.getProductId());
                }
                
                ProductDto product = stockServiceClient.getProductById(item.getProductId()).getBody();
                if (product == null) {
                    log.error("[CONSUMER] Product not found: {}", item.getProductId());
                    throw new RuntimeException("Product not found for ID: " + item.getProductId());
                }
                
                SizeDto size = stockServiceClient.getSizeById(item.getSizeId()).getBody();
                if (size == null) {
                    log.error("[CONSUMER] Size not found: {}", item.getSizeId());
                    throw new RuntimeException("Size not found for ID: " + item.getSizeId());
                }
                
                if (size.getStock() < item.getQuantity()) {
                    log.error("[CONSUMER] Insufficient stock for product {} size {}. Available: {}, Requested: {}",
                            item.getProductId(), size.getName(), size.getStock(), item.getQuantity());
                    throw new RuntimeException("Insufficient stock for product: " + product.getName()
                            + ", size: " + size.getName() + ". Available: " + size.getStock() + ", Requested: " + item.getQuantity());
                }
            }
        } catch (Exception e) {
            try {
                // Since 1 user = 1 shop, set both userId and shopId to msg.getUserId()
                // This is a notification for the user (order failed), not shop owner
                SendNotificationRequest failNotification = SendNotificationRequest.builder()
                        .userId(msg.getUserId())
                        .shopId(msg.getUserId())
                        .orderId(null)
                        .message("Order creation failed: " + e.getMessage())
                        .isShopOwnerNotification(false) // false = user notification
                        .build();
//                kafkaTemplateSend.send(notificationTopic.name(), failNotification);

                String partitionKey = failNotification.getUserId() != null
                        ? failNotification.getUserId()
                        : failNotification.getShopId();
                kafkaTemplateSend.send(notificationTopic.name(), partitionKey, failNotification);
            } catch (Exception notifEx) {
                log.error("[CONSUMER] Failed to send failure notification: {}", notifEx.getMessage(), notifEx);
            }
            throw e;
        }

        // 1) Create order skeleton
        Order order = initPendingOrder(msg.getUserId(), msg.getAddressId());

        // 2) Items + decrease stock
        List<OrderItem> items = toOrderItemsFromSelected(msg.getSelectedItems(), order);
        order.setOrderItems(items);
        order.setTotalPrice(calculateTotalPrice(items));
        orderRepository.save(order);

        // 3) Cleanup cart - remove items that were added to order
        try {
            if (msg.getSelectedItems() != null && !msg.getSelectedItems().isEmpty()) {
                log.info("[CONSUMER] Starting cart cleanup for userId: {}, items count: {}", 
                    msg.getUserId(), msg.getSelectedItems().size());
                cleanupCartItemsBySelected(msg.getUserId(), msg.getSelectedItems());
            } else {
                log.warn("[CONSUMER] selectedItems is null or empty -> skip cart cleanup");
            }
        } catch (Exception e) {
            log.error("[CONSUMER] cart cleanup failed: {}", e.getMessage(), e);
        }

        try {
            notifyOrderPlaced(order);
            notifyShopOwners(order);
        } catch (Exception e) {
            log.error("[CONSUMER] send notification failed: {}", e.getMessage(), e);
        }

        // 4) Create GHN shipping order
        try {
            createShippingOrder(order);
        } catch (Exception e) {
            log.error("[CONSUMER] Failed to create GHN shipping order: {}", e.getMessage(), e);
            // Don't throw - order is already created, just log the error
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////

    protected double calculateTotalPrice(List<OrderItem> orderItems) {
        return orderItems.stream()
                .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                .sum();
    }

    @Override
    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for ID: " + orderId));
    }

    @Override
    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreationTimestampDesc(userId);
    }

    // CRUD Implementation
    @Override
    public List<Order> getAllOrders(String status) {
        if (status != null && !status.isEmpty()) {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            return orderRepository.findByOrderStatus(orderStatus);
        }
        return orderRepository.findAll();
    }

    @Override
    @Transactional
    public Order updateOrder(String orderId, UpdateOrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for ID: " + orderId));

        if (request.getOrderStatus() != null) {
            order.setOrderStatus(OrderStatus.valueOf(request.getOrderStatus().toUpperCase()));
        }

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for ID: " + orderId));

        order.setOrderStatus(OrderStatus.valueOf(status.toUpperCase()));
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for ID: " + orderId));
        orderRepository.delete(order);
    }

    @Override
    public List<Order> searchOrders(String userId, String status, String startDate, String endDate) {
        if (userId != null && !userId.isEmpty()) {
            return orderRepository.findByUserIdOrderByCreationTimestampDesc (userId);
        }

        if (status != null && !status.isEmpty()) {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            return orderRepository.findByOrderStatus(orderStatus);
        }

        return orderRepository.findAll();
    }

    // Address-related methods
    @Override
    public List<AddressDto> getUserAddresses(HttpServletRequest request) {
        String author = request.getHeader("Authorization");
        return userServiceClient.getAllAddresses(author).getBody();
    }

    @Override
    public AddressDto getAddressById(String addressId) {
        return userServiceClient.getAddressById(addressId).getBody();
    }


    // ====== Helpers Tạo order ======
    private Order initPendingOrder(String userId, String addressId) {
        Order order = Order.builder()
                .userId(userId)
                .addressId(addressId)
                .orderStatus(OrderStatus.PENDING)
                .totalPrice(0.0)
                .build();
        return orderRepository.save(order);
    }

    private List<OrderItem> toOrderItemsFromSelected(List<SelectedItemDto> selectedItems, Order order) {
        return selectedItems.stream()
                .map(si -> {
                    if (si.getSizeId() == null || si.getSizeId().isBlank()) {
                        throw new RuntimeException("Size ID is required for product: " + si.getProductId());
                    }
                    
                    DecreaseStockRequest dec = new DecreaseStockRequest();
                    dec.setSizeId(si.getSizeId());
                    dec.setQuantity(si.getQuantity());
                    stockServiceClient.decreaseStock(dec);

                    return OrderItem.builder()
                            .productId(si.getProductId())
                            .sizeId(si.getSizeId())
                            .quantity(si.getQuantity())
                            .unitPrice(si.getUnitPrice())
                            .totalPrice(si.getUnitPrice() * si.getQuantity())
                            .order(order)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private void cleanupCartItemsBySelected(String userId, List<SelectedItemDto> selectedItems) {
        if (selectedItems == null || selectedItems.isEmpty()) {
            log.warn("[CONSUMER] selectedItems is null or empty - skipping cart cleanup");
            return;
        }
        
        log.info("[CONSUMER] Starting cart cleanup for userId: {}, number of items to remove: {}", 
            userId, selectedItems.size());
        
        for (SelectedItemDto item : selectedItems) {
            try {
                log.info("[CONSUMER] Removing cart item - productId: {}, sizeId: {}, quantity: {}", 
                    item.getProductId(), item.getSizeId(), item.getQuantity());
                
                RemoveCartItemByUserIdRequest request = new RemoveCartItemByUserIdRequest();
                request.setUserId(userId);
                request.setProductId(item.getProductId());
                request.setSizeId(item.getSizeId());
                
                log.debug("[CONSUMER] Sending removeCartItemsByUserId request - userId: {}, productId: {}, sizeId: {}", 
                    request.getUserId(), request.getProductId(), request.getSizeId());
                
                stockServiceClient.removeCartItemsByUserId(request);
                
                log.info("[CONSUMER] Successfully removed cart item - productId: {}, sizeId: {}", 
                    item.getProductId(), item.getSizeId());
            } catch (Exception e) {
                log.error("[CONSUMER] Failed to remove cart item - productId: {}, sizeId: {}, error: {}", 
                    item.getProductId(), item.getSizeId(), e.getMessage(), e);
            }
        }
    }

    private void notifyOrderPlaced(Order order) {
        // Since 1 user = 1 shop, set both userId and shopId to order.getUserId()
        // This is a notification for the user (who placed the order), not shop owner
        SendNotificationRequest noti = SendNotificationRequest.builder()
                .userId(order.getUserId())
                .shopId(order.getUserId())
                .orderId(order.getId())
                .message("Order placed successfully with ID: " + order.getId())
                .isShopOwnerNotification(false) // false = user notification
                .build();
//        kafkaTemplateSend.send(notificationTopic.name(), noti);
        String partitionKey = noti.getUserId() != null ? noti.getUserId() : noti.getShopId();
        kafkaTemplateSend.send(notificationTopic.name(), partitionKey, noti);
    }

    private void notifyShopOwners(Order order) {
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            return;
        }

        // Group order items by shop owner (product.userId)
        Map<String, List<OrderItem>> itemsByShopOwner = new HashMap<>();
        
        for (OrderItem item : order.getOrderItems()) {
            try {
                ResponseEntity<ProductDto> productResponse = stockServiceClient.getProductById(item.getProductId());
                if (productResponse != null && productResponse.getBody() != null) {
                    ProductDto product = productResponse.getBody();
                    String shopOwnerId = product.getUserId();
                    
                    if (shopOwnerId != null && !shopOwnerId.isBlank()) {
                        itemsByShopOwner.computeIfAbsent(shopOwnerId, k -> new ArrayList<>()).add(item);
                    }
                }
            } catch (Exception e) {
                log.error("[CONSUMER] Failed to fetch product for notification: productId={}, error={}", 
                    item.getProductId(), e.getMessage());
            }
        }

        // Send notification to each shop owner
        for (Map.Entry<String, List<OrderItem>> entry : itemsByShopOwner.entrySet()) {
            String shopOwnerId = entry.getKey();
            List<OrderItem> items = entry.getValue();
            
            int totalItems = items.stream().mapToInt(OrderItem::getQuantity).sum();
            double totalAmount = items.stream().mapToDouble(OrderItem::getTotalPrice).sum();
            
            String message = String.format(
                "Bạn có đơn hàng mới #%s với %d sản phẩm, tổng giá trị: %.0f VNĐ", 
                order.getId(), totalItems, totalAmount
            );
            
            try {
                // Since 1 user = 1 shop, set both userId and shopId to shopOwnerId
                // This is a notification for the shop owner, not the user who placed the order
                SendNotificationRequest notification = SendNotificationRequest.builder()
                        .userId(shopOwnerId)
                        .shopId(shopOwnerId)
                        .orderId(order.getId())
                        .message(message)
                        .isShopOwnerNotification(true) // true = shop owner notification
                        .build();
//                kafkaTemplateSend.send(notificationTopic.name(), notification);
                String partitionKey = notification.getShopId() != null
                        ? notification.getShopId()
                        : notification.getUserId();
                kafkaTemplateSend.send(notificationTopic.name(), partitionKey, notification);
            } catch (Exception e) {
                log.error("[CONSUMER] Failed to send notification to shop owner: shopId={}, error={}", 
                    shopOwnerId, e.getMessage());
            }
        }
    }

    // ========== GHN SHIPPING ORDER METHODS ==========
    
    /**
     * TẠO VẬN ĐƠN GHN
     * Được gọi sau khi order được tạo thành công
     */
    private void createShippingOrder(Order order) {
        try {
            log.info("[GHN] ========== CREATING SHIPPING ORDER ==========");
            log.info("[GHN] Order ID: {}", order.getId());
            
            // 1. Lấy địa chỉ khách hàng
            AddressDto customerAddress = userServiceClient.getAddressById(order.getAddressId()).getBody();
            if (customerAddress == null) {
                log.error("[GHN] Customer address not found: {}", order.getAddressId());
                return;
            }
            
            log.info("[GHN] Customer: {}, Phone: {}", 
                customerAddress.getRecipientName(), 
                customerAddress.getRecipientPhone());
            
            // 2. Validate GHN fields
            if (customerAddress.getDistrictId() == null || customerAddress.getWardCode() == null) {
                log.warn("[GHN] ⚠️  Address missing GHN fields!");
                log.warn("[GHN] District ID: {}, Ward Code: {}", 
                    customerAddress.getDistrictId(), customerAddress.getWardCode());
                log.warn("[GHN] SKIPPING GHN order creation - address needs update with GHN data");
                return;
            }
            
            // 3. Validate order items
            if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
                log.error("[GHN] Order has no items!");
                return;
            }
            
            log.info("[GHN] Order has {} items", order.getOrderItems().size());
            
            // 4. Tính tổng weight (500g mỗi item - có thể điều chỉnh)
            int totalWeight = order.getOrderItems().stream()
                .mapToInt(item -> item.getQuantity() * 500)
                .sum();
            
            log.info("[GHN] Total weight: {}g", totalWeight);
            
            // 5. Lấy shop owner address (FROM address)
            // Lấy shop owner ID từ product đầu tiên
            String shopOwnerId = null;
            try {
                if (!order.getOrderItems().isEmpty()) {
                    ProductDto firstProduct = stockServiceClient.getProductById(
                        order.getOrderItems().get(0).getProductId()
                    ).getBody();
                    if (firstProduct != null) {
                        shopOwnerId = firstProduct.getUserId();
                    }
                }
            } catch (Exception e) {
                log.warn("[GHN] Cannot get shop owner ID: {}", e.getMessage());
            }
            
            // Lấy shop owner info để có FROM address
            ShopOwnerDto shopOwner = null;
            if (shopOwnerId != null && !shopOwnerId.isBlank()) {
                try {
                    ResponseEntity<ShopOwnerDto> shopOwnerResponse = userServiceClient.getShopOwnerByUserId(shopOwnerId);
                    if (shopOwnerResponse != null && shopOwnerResponse.getBody() != null) {
                        shopOwner = shopOwnerResponse.getBody();
                        log.info("[GHN] Shop Owner: {}, Address: {}", shopOwner.getShopName(), shopOwner.getStreetAddress());
                    }
                } catch (Exception e) {
                    log.warn("[GHN] Cannot get shop owner address: {}", e.getMessage());
                }
            }
            
            // Validate shop owner address
            if (shopOwner == null || shopOwner.getDistrictId() == null || shopOwner.getWardCode() == null) {
                log.warn("[GHN] ⚠️  Shop owner address missing GHN fields!");
                log.warn("[GHN] Shop Owner ID: {}, District ID: {}, Ward Code: {}", 
                    shopOwnerId, 
                    shopOwner != null ? shopOwner.getDistrictId() : "null",
                    shopOwner != null ? shopOwner.getWardCode() : "null");
                log.warn("[GHN] SKIPPING GHN order creation - shop owner needs to configure GHN address in Settings");
                return;
            }
            
            // 6. Build items cho GHN
            List<GhnItemDto> ghnItems = order.getOrderItems().stream()
                .map(item -> {
                    String productName = "Product";
                    try {
                        ProductDto product = stockServiceClient.getProductById(item.getProductId()).getBody();
                        if (product != null) {
                            productName = product.getName();
                        }
                    } catch (Exception e) {
                        log.warn("[GHN] Cannot get product name for: {}", item.getProductId());
                    }
                    
                    return GhnItemDto.builder()
                        .name(productName)
                        .quantity(item.getQuantity())
                        .price((long) item.getUnitPrice())
                        .build();
                })
                .collect(Collectors.toList());
            
            // 7. Build GHN request với FROM address từ shop owner
            GhnCreateOrderRequest.GhnCreateOrderRequestBuilder requestBuilder = GhnCreateOrderRequest.builder()
                .paymentTypeId(2) // 2 = Người nhận trả phí
                .requiredNote("CHOXEMHANGKHONGTHU") // Cho xem hàng không cho thử
                .toName(customerAddress.getRecipientName())
                .toPhone(customerAddress.getRecipientPhone())
                .toAddress(customerAddress.getStreetAddress())
                .toWardCode(customerAddress.getWardCode())
                .toDistrictId(customerAddress.getDistrictId())
                .codAmount((long) order.getTotalPrice()) // Thu hộ COD
                .weight(totalWeight)
                .length(20) // cm - Hardcode, có thể lấy từ product sau
                .width(15)
                .height(10)
                .serviceTypeId(2) // 2 = Standard (rẻ hơn), 5 = Express
                .items(ghnItems);
            
            // Thêm FROM address từ shop owner
            if (shopOwner != null) {
                requestBuilder
                    .fromName(shopOwner.getShopName() != null ? shopOwner.getShopName() : shopOwner.getOwnerName())
                    .fromPhone(shopOwner.getPhone() != null ? shopOwner.getPhone() : "0123456789")
                    .fromAddress(shopOwner.getStreetAddress())
                    .fromWardCode(shopOwner.getWardCode())
                    .fromDistrictId(shopOwner.getDistrictId());
            }
            
            GhnCreateOrderRequest ghnRequest = requestBuilder.build();
            
            log.info("[GHN] Request Details:");
            log.info("[GHN]   FROM - Shop: {}, District ID: {}, Ward Code: {}", 
                shopOwner != null ? shopOwner.getShopName() : "N/A",
                ghnRequest.getFromDistrictId(),
                ghnRequest.getFromWardCode());
            log.info("[GHN]   TO - Customer: {}, District ID: {}, Ward Code: {}", 
                customerAddress.getRecipientName(),
                ghnRequest.getToDistrictId(),
                ghnRequest.getToWardCode());
            log.info("[GHN]   COD Amount: {} VNĐ", ghnRequest.getCodAmount());
            log.info("[GHN]   Weight: {}g", ghnRequest.getWeight());
            
            // 8. Call GHN API
            log.info("[GHN] Calling GHN API...");
            GhnCreateOrderResponse ghnResponse = ghnApiClient.createOrder(ghnRequest);
            
            if (ghnResponse == null || ghnResponse.getCode() != 200) {
                log.error("[GHN] ❌ GHN API returned error!");
                log.error("[GHN] Code: {}, Message: {}", 
                    ghnResponse != null ? ghnResponse.getCode() : "null",
                    ghnResponse != null ? ghnResponse.getMessage() : "null");
                return;
            }
            
            // 9. Save ShippingOrder
            log.info("[GHN] Saving shipping order to database...");
            
            ShippingOrder shippingOrder = ShippingOrder.builder()
                .orderId(order.getId())
                .ghnOrderCode(ghnResponse.getData().getOrderCode())
                .shippingFee(BigDecimal.valueOf(ghnResponse.getData().getTotalFee()))
                .codAmount(BigDecimal.valueOf(order.getTotalPrice()))
                .weight(totalWeight)
                .status("PENDING")
                .expectedDeliveryTime(parseDateTime(ghnResponse.getData().getExpectedDeliveryTime()))
                .ghnResponse(toJson(ghnResponse))
                .build();
            
            shippingOrderRepository.save(shippingOrder);
            
            log.info("[GHN] ✅ SUCCESS!");
            log.info("[GHN] GHN Order Code: {}", ghnResponse.getData().getOrderCode());
            log.info("[GHN] Shipping Fee: {} VNĐ", ghnResponse.getData().getTotalFee());
            log.info("[GHN] Expected Delivery: {}", ghnResponse.getData().getExpectedDeliveryTime());
            log.info("[GHN] ===============================================");
            
        } catch (Exception e) {
            log.error("[GHN] ❌ Exception occurred: {}", e.getMessage(), e);
            log.error("[GHN] Order creation continues, but shipping order failed");
            // Không throw exception để không làm fail order creation
        }
    }
    
    /**
     * Helper: Parse datetime từ GHN response
     */
    private LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_DATE_TIME);
        } catch (Exception e) {
            log.warn("[GHN] Cannot parse datetime: {}", dateTimeStr);
            return null;
        }
    }
    
    /**
     * Helper: Convert object to JSON string
     */
    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.error("[GHN] Cannot serialize to JSON: {}", e.getMessage());
            return "{}";
        }
    }
}
