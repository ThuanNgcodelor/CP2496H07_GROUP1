package com.example.stockservice.service.ai;

import com.example.stockservice.client.OrderServiceClient;
import com.example.stockservice.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Description;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Order Tools cho AI Function Calling
 * Cho phép AI tra cứu đơn hàng của người dùng
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderTools {

    private final OrderServiceClient orderServiceClient;
    
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ============ Request/Response Records ============
    
    public record GetMyOrdersRequest(String userId) {}
    public record GetMyOrdersResponse(List<OrderSummary> orders, int total, String message) {}
    
    public record GetOrderStatusRequest(String orderId) {}
    public record GetOrderStatusResponse(OrderDetail order, boolean found, String message) {}
    
    public record OrderSummary(
        String orderId,
        String status,
        String statusDisplay,
        String totalAmount,
        String createdAt,
        int itemCount
    ) {}
    
    public record OrderDetail(
        String orderId,
        String status,
        String statusDisplay,
        String totalAmount,
        String shippingFee,
        String createdAt,
        String address,
        String phone,
        List<OrderItemInfo> items
    ) {}
    
    public record OrderItemInfo(
        String productName,
        String sizeName,
        int quantity,
        String unitPrice
    ) {}

    // ============ Tool Functions ============

    /**
     * Lấy danh sách đơn hàng của user
     */
    @Description("Get list of user's orders. Use when user asks about their orders, order history.")
    public Function<GetMyOrdersRequest, GetMyOrdersResponse> getMyOrders() {
        return request -> {
            log.info("Tool called: getMyOrders(userId={})", request.userId());
            
            if (request.userId() == null || request.userId().isBlank()) {
                return new GetMyOrdersResponse(List.of(), 0, 
                    "Bạn cần đăng nhập để xem đơn hàng.");
            }
            
            try {
                ResponseEntity<List<OrderDto>> response = orderServiceClient.getOrdersByUserId(request.userId());
                
                if (response.getBody() == null || response.getBody().isEmpty()) {
                    return new GetMyOrdersResponse(List.of(), 0, 
                        "Bạn chưa có đơn hàng nào.");
                }
                
                List<OrderSummary> summaries = response.getBody().stream()
                    .limit(20) // Chỉ lấy 20 đơn gần nhất
                    .map(this::toOrderSummary)
                    .collect(Collectors.toList());
                
                return new GetMyOrdersResponse(
                    summaries, 
                    response.getBody().size(),
                    "Tìm thấy " + response.getBody().size() + " đơn hàng"
                );
                
            } catch (Exception e) {
                log.error("Error getting orders: ", e);
                return new GetMyOrdersResponse(List.of(), 0, 
                    "Không thể lấy danh sách đơn hàng. Vui lòng thử lại sau.");
            }
        };
    }

    /**
     * Lấy chi tiết trạng thái đơn hàng
     */
    @Description("Get order status and details by order ID. Use when user asks about a specific order status.")
    public Function<GetOrderStatusRequest, GetOrderStatusResponse> getOrderStatus() {
        return request -> {
            log.info("Tool called: getOrderStatus(orderId={})", request.orderId());
            
            if (request.orderId() == null || request.orderId().isBlank()) {
                return new GetOrderStatusResponse(null, false, 
                    "Vui lòng cung cấp mã đơn hàng.");
            }
            
            try {
                ResponseEntity<OrderDto> response = orderServiceClient.getOrderById(request.orderId());
                
                if (response.getBody() == null) {
                    return new GetOrderStatusResponse(null, false, 
                        "Không tìm thấy đơn hàng với mã: " + request.orderId());
                }
                
                OrderDetail detail = toOrderDetail(response.getBody());
                return new GetOrderStatusResponse(detail, true, 
                    "Đã tìm thấy đơn hàng");
                
            } catch (Exception e) {
                log.error("Error getting order: ", e);
                return new GetOrderStatusResponse(null, false, 
                    "Không tìm thấy đơn hàng hoặc có lỗi xảy ra.");
            }
        };
    }

    // ============ Helper Methods ============
    
    private OrderSummary toOrderSummary(OrderDto order) {
        return new OrderSummary(
            order.getId(),
            order.getOrderStatus(),
            translateStatus(order.getOrderStatus()),
            formatPrice(order.getTotalAmount()),
            order.getCreatedAt() != null ? order.getCreatedAt().format(DATE_FORMAT) : "N/A",
            order.getOrderItems() != null ? order.getOrderItems().size() : 0
        );
    }
    
    private OrderDetail toOrderDetail(OrderDto order) {
        List<OrderItemInfo> items = order.getOrderItems() != null 
            ? order.getOrderItems().stream()
                .map(item -> new OrderItemInfo(
                    item.getProductName() != null ? item.getProductName() : "Sản phẩm",
                    item.getSizeName(),
                    item.getQuantity(),
                    formatPrice(item.getUnitPrice())
                ))
                .collect(Collectors.toList())
            : List.of();
        
        return new OrderDetail(
            order.getId(),
            order.getOrderStatus(),
            translateStatus(order.getOrderStatus()),
            formatPrice(order.getTotalAmount()),
            formatPrice(order.getShippingFee()),
            order.getCreatedAt() != null ? order.getCreatedAt().format(DATE_FORMAT) : "N/A",
            order.getFullAddress(),
            order.getRecipientPhone(),
            items
        );
    }
    
    private String translateStatus(String status) {
        if (status == null) return "Không xác định";
        return switch (status.toUpperCase()) {
            case "PENDING" -> "Chờ xác nhận";
            case "CONFIRMED" -> "Đã xác nhận";
            case "PROCESSING" -> "Đang xử lý";
            case "SHIPPED" -> "Đang giao hàng";
            case "DELIVERED" -> "Đã giao hàng";
            case "COMPLETED" -> "Hoàn thành";
            case "CANCELLED" -> "Đã hủy";
            case "RETURNED" -> "Trả hàng/Hoàn tiền";
            default -> status;
        };
    }
    
    private String formatPrice(Double price) {
        if (price == null || price == 0) return "0₫";
        return String.format("%,.0f₫", price);
    }
}
