# 🚚 TÍCH HỢP GIAO HÀNG NHANH (GHN) - HƯỚNG DẪN CHI TIẾT

## 📋 TỔNG QUAN

Tài liệu này hướng dẫn **FULL CODE** tích hợp GHN API vào hệ thống Shopee Clone.

**Phân chia rõ ràng:**
- ✅ **USER-SERVICE:** Cập nhật Address entity với GHN fields (tự động tạo bảng)
- ✅ **ORDER-SERVICE:** Thêm ShippingOrder entity và tạo vận đơn GHN

**Lưu ý:** JPA sẽ **tự động tạo/cập nhật** bảng khi chạy ứng dụng, không cần chạy SQL thủ công.

---

## 📦 PHẦN 1: USER-SERVICE - CẬP NHẬT ADDRESS

### 1.1. Address Entity - CẬP NHẬT HOÀN CHỈNH

**File:** `user-service/src/main/java/com/example/userservice/model/Address.java`

**Thay thế toàn bộ file:**

```java
package com.example.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address extends BaseEntity {
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "address_name")
    private String addressName;
    
    @Column(name = "recipient_name", nullable = false)
    private String recipientName;
    
    @Column(name = "recipient_phone", nullable = false)
    private String recipientPhone;
    
    // ============ GHN ADDRESS STRUCTURE (3 CẤP) ============
    
    @Column(name = "province_id")
    private Integer provinceId;
    
    @Column(name = "province_name")
    private String provinceName;
    
    @Column(name = "district_id")
    private Integer districtId;
    
    @Column(name = "district_name")
    private String districtName;
    
    @Column(name = "ward_code", length = 20)
    private String wardCode;
    
    @Column(name = "ward_name")
    private String wardName;
    
    // =======================================================
    
    @Column(name = "street_address", columnDefinition = "TEXT", nullable = false)
    private String streetAddress;
    
    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;
    
    // DEPRECATED - Giữ để tương thích ngược
    @Deprecated
    @Column(name = "province")
    private String province;
    
    @Deprecated
    @Column(name = "district")
    private String district;
    
    /**
     * Helper method: Tạo địa chỉ đầy đủ cho GHN
     */
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (streetAddress != null && !streetAddress.isBlank()) {
            sb.append(streetAddress);
        }
        if (wardName != null && !wardName.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(wardName);
        }
        if (districtName != null && !districtName.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(districtName);
        }
        if (provinceName != null && !provinceName.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(provinceName);
        }
        return sb.toString();
    }
}
```

**Giải thích:**
- Thêm 6 fields mới cho GHN: `provinceId`, `provinceName`, `districtId`, `districtName`, `wardCode`, `wardName`
- JPA sẽ **tự động** thêm các cột này vào bảng `addresses` khi khởi động
- Giữ lại `province`, `district` cũ (DEPRECATED) để tương thích

### 1.2. AddressDto - CẬP NHẬT

**File:** `user-service/src/main/java/com/example/userservice/dto/AddressDto.java`

**Thay thế toàn bộ:**

```java
package com.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private String id;
    private String userId;
    private String addressName;
    private String recipientName;
    private String recipientPhone;
    
    // GHN Fields - MỚI
    private Integer provinceId;
    private String provinceName;
    private Integer districtId;
    private String districtName;
    private String wardCode;
    private String wardName;
    
    private String streetAddress;
    private Boolean isDefault;
    
    // Deprecated - Tương thích ngược
    @Deprecated
    private String province;
    
    @Deprecated
    private String district;
    
    // Helper: Lấy địa chỉ đầy đủ (nếu cần dùng trong frontend/response)
    public String getFullAddress() {
        return String.format("%s, %s, %s, %s",
            streetAddress != null ? streetAddress : "",
            wardName != null ? wardName : "",
            districtName != null ? districtName : "",
            provinceName != null ? provinceName : ""
        ).replaceAll(", ,", ",").replaceAll("^, ", "").trim();
    }
}
```

### 1.3. AddressCreateRequest - CẬP NHẬT

**File:** `user-service/src/main/java/com/example/userservice/request/AddressCreateRequest.java`

**Thay thế toàn bộ:**

```java
package com.example.userservice.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddressCreateRequest {
    
    @NotBlank(message = "Recipient name is required")
    private String recipientName;
    
    @NotBlank(message = "Recipient phone is required")
    private String recipientPhone;
    
    // GHN Fields - REQUIRED
    @NotNull(message = "Province ID is required (GHN)")
    private Integer provinceId;
    
    @NotBlank(message = "Province name is required")
    private String provinceName;
    
    @NotNull(message = "District ID is required (GHN)")
    private Integer districtId;
    
    @NotBlank(message = "District name is required")
    private String districtName;
    
    @NotBlank(message = "Ward code is required (GHN)")
    private String wardCode;
    
    @NotBlank(message = "Ward name is required")
    private String wardName;
    
    @NotBlank(message = "Street address is required")
    private String streetAddress;
    
    private String addressName; // "Nhà riêng", "Công ty"
    private Boolean isDefault;
}
```

**✅ USER-SERVICE HOÀN TẤT**

---

## 📦 PHẦN 2: ORDER-SERVICE - THÊM SHIPPING GHN

### 2.1. ShippingOrder Entity - MỚI

**File:** `order-service/src/main/java/com/example/orderservice/model/ShippingOrder.java`

**Tạo file mới:**

```java
package com.example.orderservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipping_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingOrder extends BaseEntity {
    
    @Column(name = "order_id", unique = true, nullable = false)
    private String orderId;
    
    @Column(name = "ghn_order_code", unique = true, length = 50)
    private String ghnOrderCode;
    
    @Column(name = "shipping_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingFee;
    
    @Column(name = "cod_amount", precision = 10, scale = 2)
    private BigDecimal codAmount;
    
    @Column(name = "weight", nullable = false)
    private Integer weight; // Gram
    
    @Column(name = "status", length = 50)
    private String status;
    
    @Column(name = "expected_delivery_time")
    private LocalDateTime expectedDeliveryTime;
    
    @Column(name = "ghn_response", columnDefinition = "TEXT")
    private String ghnResponse;
}
```

**JPA sẽ tự động tạo bảng `shipping_orders` khi chạy.**

### 2.2. ShippingOrderRepository - MỚI

**File:** `order-service/src/main/java/com/example/orderservice/repository/ShippingOrderRepository.java`

**Tạo file mới:**

```java
package com.example.orderservice.repository;

import com.example.orderservice.model.ShippingOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShippingOrderRepository extends JpaRepository<ShippingOrder, String> {
    Optional<ShippingOrder> findByOrderId(String orderId);
    Optional<ShippingOrder> findByGhnOrderCode(String ghnOrderCode);
}
```

### 2.3. GHN DTOs - MỚI (3 files)

#### File 1: GhnCreateOrderRequest.java

**File:** `order-service/src/main/java/com/example/orderservice/dto/GhnCreateOrderRequest.java`

```java
package com.example.orderservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GhnCreateOrderRequest {
    
    @JsonProperty("payment_type_id")
    private Integer paymentTypeId; // 2 = Người nhận trả phí
    
    @JsonProperty("required_note")
    private String requiredNote; // "CHOXEMHANGKHONGTHU"
    
    @JsonProperty("to_name")
    private String toName;
    
    @JsonProperty("to_phone")
    private String toPhone;
    
    @JsonProperty("to_address")
    private String toAddress;
    
    @JsonProperty("to_ward_code")
    private String toWardCode;
    
    @JsonProperty("to_district_id")
    private Integer toDistrictId;
    
    @JsonProperty("cod_amount")
    private Long codAmount; // Tiền thu hộ
    
    @JsonProperty("weight")
    private Integer weight; // Gram
    
    @JsonProperty("length")
    private Integer length; // cm
    
    @JsonProperty("width")
    private Integer width; // cm
    
    @JsonProperty("height")
    private Integer height; // cm
    
    @JsonProperty("service_type_id")
    private Integer serviceTypeId; // 2 = Standard, 5 = Express
    
    @JsonProperty("items")
    private List<GhnItemDto> items;
}
```

#### File 2: GhnItemDto.java

**File:** `order-service/src/main/java/com/example/orderservice/dto/GhnItemDto.java`

```java
package com.example.orderservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GhnItemDto {
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("quantity")
    private Integer quantity;
    
    @JsonProperty("price")
    private Long price; // VNĐ
}
```

#### File 3: GhnCreateOrderResponse.java

**File:** `order-service/src/main/java/com/example/orderservice/dto/GhnCreateOrderResponse.java`

```java
package com.example.orderservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GhnCreateOrderResponse {
    
    @JsonProperty("code")
    private Integer code; // 200 = success
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private GhnOrderData data;
    
    @Data
    public static class GhnOrderData {
        
        @JsonProperty("order_code")
        private String orderCode; // Mã vận đơn GHN
        
        @JsonProperty("total_fee")
        private Long totalFee; // Phí ship
        
        @JsonProperty("expected_delivery_time")
        private String expectedDeliveryTime; // ISO datetime string
    }
}
```

### 2.4. GhnApiClient - MỚI

**File:** `order-service/src/main/java/com/example/orderservice/client/GhnApiClient.java`

**Tạo file mới:**

```java
package com.example.orderservice.client;

import com.example.orderservice.dto.GhnCreateOrderRequest;
import com.example.orderservice.dto.GhnCreateOrderResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@Slf4j
public class GhnApiClient {
    
    @Value("${ghn.api.url}")
    private String apiUrl;
    
    @Value("${ghn.api.token}")
    private String apiToken;
    
    @Value("${ghn.shop.id}")
    private Integer shopId;
    
    private final RestTemplate restTemplate;
    
    public GhnApiClient() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Tạo đơn vận chuyển GHN
     */
    public GhnCreateOrderResponse createOrder(GhnCreateOrderRequest request) {
        String url = apiUrl + "/v2/shipping-order/create";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Token", apiToken);
        headers.set("ShopId", shopId.toString());
        
        HttpEntity<GhnCreateOrderRequest> entity = new HttpEntity<>(request, headers);
        
        log.info("[GHN API] Creating order - to: {}, district: {}, ward: {}, weight: {}g", 
            request.getToName(), request.getToDistrictId(), 
            request.getToWardCode(), request.getWeight());
        
        try {
            ResponseEntity<GhnCreateOrderResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                GhnCreateOrderResponse.class
            );
            
            GhnCreateOrderResponse body = response.getBody();
            
            if (body != null && body.getCode() == 200) {
                log.info("[GHN API] SUCCESS - Order Code: {}, Fee: {} VNĐ", 
                    body.getData().getOrderCode(), 
                    body.getData().getTotalFee());
            } else {
                log.error("[GHN API] ERROR - Code: {}, Message: {}", 
                    body != null ? body.getCode() : "null", 
                    body != null ? body.getMessage() : "null");
            }
            
            return body;
            
        } catch (Exception e) {
            log.error("[GHN API] Exception: {}", e.getMessage(), e);
            throw new RuntimeException("GHN API call failed: " + e.getMessage());
        }
    }
}
```

### 2.5. Configuration - application.properties

**File:** `order-service/src/main/resources/application.properties`

**THÊM VÀO CUỐI FILE:**

```properties
# ========== GHN API Configuration ==========
ghn.api.url=https://dev-online-gateway.ghn.vn/shiip/public-api
ghn.api.token=${GHN_API_TOKEN:demo-token-change-me}
ghn.shop.id=${GHN_SHOP_ID:0}
```

**Giải thích:**
- `ghn.api.url`: URL staging GHN (production: https://online-gateway.ghn.vn/shiip/public-api)
- `ghn.api.token`: Lấy từ environment variable `GHN_API_TOKEN`
- `ghn.shop.id`: Shop ID từ GHN dashboard

### 2.6. Environment Variables

**Tạo file `.env` ở root project hoặc set system environment:**

```bash
GHN_API_TOKEN=your-actual-token-from-ghn-dashboard
GHN_SHOP_ID=123456
```

### 2.7. Cập nhật OrderServiceImpl - QUAN TRỌNG

**File:** `order-service/src/main/java/com/example/orderservice/service/OrderServiceImpl.java`

**THÊM VÀO ĐẦU CLASS:**

```java
import com.example.orderservice.client.GhnApiClient;
import com.example.orderservice.repository.ShippingOrderRepository;
import com.example.orderservice.model.ShippingOrder;
import com.example.orderservice.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    
    // ... existing dependencies ...
    
    // THÊM MỚI
    private final GhnApiClient ghnApiClient;
    private final ShippingOrderRepository shippingOrderRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
```

**THÊM METHOD MỚI vào OrderServiceImpl (sau các method hiện có):**

```java
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
            
            // 5. Build items cho GHN
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
            
            // 6. Build GHN request
            GhnCreateOrderRequest ghnRequest = GhnCreateOrderRequest.builder()
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
                .items(ghnItems)
                .build();
            
            log.info("[GHN] Request Details:");
            log.info("[GHN]   To District ID: {}", ghnRequest.getToDistrictId());
            log.info("[GHN]   To Ward Code: {}", ghnRequest.getToWardCode());
            log.info("[GHN]   COD Amount: {} VNĐ", ghnRequest.getCodAmount());
            log.info("[GHN]   Weight: {}g", ghnRequest.getWeight());
            
            // 7. Call GHN API
            log.info("[GHN] Calling GHN API...");
            GhnCreateOrderResponse ghnResponse = ghnApiClient.createOrder(ghnRequest);
            
            if (ghnResponse == null || ghnResponse.getCode() != 200) {
                log.error("[GHN] ❌ GHN API returned error!");
                log.error("[GHN] Code: {}, Message: {}", 
                    ghnResponse != null ? ghnResponse.getCode() : "null",
                    ghnResponse != null ? ghnResponse.getMessage() : "null");
                return;
            }
            
            // 8. Save ShippingOrder
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
```

**CẬP NHẬT METHOD consumeCheckout (tìm method này và thêm dòng gọi GHN):**

```java
    @KafkaListener(topics = "#{@orderTopic.name}", groupId = "order-service-checkout")
    @Transactional
    public void consumeCheckout(CheckOutKafkaRequest msg) {
        // ... existing code validation ...
        
        // 1) Create order skeleton
        Order order = initPendingOrder(msg.getUserId(), msg.getAddressId());
        
        // 2) Items + decrease stock
        List<OrderItem> items = toOrderItemsFromSelected(msg.getSelectedItems(), order);
        order.setOrderItems(items);
        order.setTotalPrice(calculateTotalPrice(items));
        orderRepository.save(order);
        
        // 3) Cleanup cart
        try {
            if (msg.getSelectedItems() != null && !msg.getSelectedItems().isEmpty()) {
                cleanupCartItemsBySelected(msg.getUserId(), msg.getSelectedItems());
            }
        } catch (Exception e) {
            log.error("[CONSUMER] cart cleanup failed: {}", e.getMessage(), e);
        }
        
        // ========== THÊM DÒNG NÀY - TẠO VẬN ĐƠN GHN ==========
        try {
            createShippingOrder(order);
        } catch (Exception e) {
            log.error("[CONSUMER] GHN shipping order failed: {}", e.getMessage(), e);
        }
        // ====================================================
        
        // 4) Send notifications
        try {
            notifyOrderPlaced(order);
            notifyShopOwners(order);
        } catch (Exception e) {
            log.error("[CONSUMER] send notification failed: {}", e.getMessage(), e);
        }
    }
```

**✅ ORDER-SERVICE HOÀN TẤT**

---

## 🔄 FLOW HOÀN CHỈNH

```
User đặt hàng
    ↓
OrderService.orderByKafka()
    ↓
Kafka: order-topic published
    ↓
OrderService.consumeCheckout() [LISTENER]
    ↓
1. Create Order → Save DB
2. Decrease Stock
3. Clear Cart
4. 🆕 createShippingOrder(order)
   ├─ UserServiceClient.getAddressById()
   │  → Nhận AddressDto (provinceId, districtId, wardCode)
   ├─ Build GhnCreateOrderRequest
   ├─ GhnApiClient.createOrder()
   │  → GHN API: POST /v2/shipping-order/create
   │  → Response: ghnOrderCode, totalFee
   └─ Save ShippingOrder → DB
5. Send Notifications
```

---

## 📋 CHECKLIST TRIỂN KHAI

### USER-SERVICE
- [ ] Cập nhật `Address.java` (thêm 6 GHN fields)
- [ ] Cập nhật `AddressDto.java`
- [ ] Cập nhật `AddressCreateRequest.java`
- [ ] Restart service → JPA tự động thêm cột vào bảng `addresses`

### ORDER-SERVICE
- [ ] Tạo `ShippingOrder.java` entity
- [ ] Tạo `ShippingOrderRepository.java`
- [ ] Tạo 3 GHN DTOs (GhnCreateOrderRequest, GhnItemDto, GhnCreateOrderResponse)
- [ ] Tạo `GhnApiClient.java`
- [ ] Cập nhật `OrderServiceImpl.java`:
  - [ ] Inject dependencies (GhnApiClient, ShippingOrderRepository, ObjectMapper)
  - [ ] Thêm method `createShippingOrder()`
  - [ ] Thêm 2 helper methods: `parseDateTime()`, `toJson()`
  - [ ] Cập nhật `consumeCheckout()` - thêm dòng gọi `createShippingOrder(order)`
- [ ] Cập nhật `application.properties` (thêm GHN config)
- [ ] Set environment variables: `GHN_API_TOKEN`, `GHN_SHOP_ID`
- [ ] Restart service → JPA tự động tạo bảng `shipping_orders`

### GHN SETUP
- [ ] Đăng ký tài khoản GHN: https://5sao.ghn.dev (Staging)
- [ ] Đăng nhập → Chủ cửa hàng → Click "Xem" → Copy Token
- [ ] Quản lý cửa hàng → Tạo địa chỉ shop → Copy Shop ID
- [ ] Set environment variables hoặc hardcode vào `application.properties`

### TESTING
- [ ] Khởi động lại cả USER-SERVICE và ORDER-SERVICE
- [ ] Kiểm tra logs: JPA tạo bảng/cột mới
- [ ] Tạo địa chỉ mới với GHN fields (qua API hoặc DB)
- [ ] Đặt hàng → Check logs:
  ```
  [GHN] ========== CREATING SHIPPING ORDER ==========
  [GHN] Order ID: xxx
  [GHN] ✅ SUCCESS!
  [GHN] GHN Order Code: GHN12345ABC
  ```
- [ ] Query database: `SELECT * FROM shipping_orders;`
- [ ] Verify có `ghn_order_code`

---

## ✅ KẾT QUẢ

**Logs khi thành công:**
```
[GHN] ========== CREATING SHIPPING ORDER ==========
[GHN] Order ID: 123abc
[GHN] Customer: Nguyen Van A, Phone: 0901234567
[GHN] Order has 3 items
[GHN] Total weight: 1500g
[GHN] Request Details:
[GHN]   To District ID: 1542
[GHN]   To Ward Code: 21211
[GHN]   COD Amount: 250000 VNĐ
[GHN]   Weight: 1500g
[GHN] Calling GHN API...
[GHN API] Creating order - to: Nguyen Van A, district: 1542, ward: 21211, weight: 1500g
[GHN API] SUCCESS - Order Code: GHN12345ABC, Fee: 25000 VNĐ
[GHN] Saving shipping order to database...
[GHN] ✅ SUCCESS!
[GHN] GHN Order Code: GHN12345ABC
[GHN] Shipping Fee: 25000 VNĐ
[GHN] Expected Delivery: 2024-01-05T10:00:00
```

**Database:**
```sql
mysql> SELECT * FROM shipping_orders;
+------+----------+---------------+--------------+-----------+--------+
| id   | order_id | ghn_order_code| shipping_fee | weight    | status |
+------+----------+---------------+--------------+-----------+--------+
| xxx  | 123abc   | GHN12345ABC   | 25000.00     | 1500      | PENDING|
```

**🎉 Hoàn tất tích hợp GHN!**
