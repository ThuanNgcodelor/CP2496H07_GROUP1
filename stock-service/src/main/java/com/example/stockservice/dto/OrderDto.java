package com.example.stockservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO để nhận dữ liệu đơn hàng từ order-service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private String id;
    private String userId;
    private String orderStatus;
    private Double totalAmount;
    private Double shippingFee;
    private String fullAddress;
    private String recipientPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String paymentMethod;
    private List<OrderItemDto> orderItems;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        private String productId;
        private String productName;
        private String sizeId;
        private String sizeName;
        private Integer quantity;
        private Double unitPrice;
    }
}
