package com.example.stockservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RedisCartItemDto {
    private String cartItemId;
    private String productId;
    private String sizeId;
    private String sizeName;
    private int quantity;
    private double unitPrice;      // Giá đang áp dụng (có thể là live price hoặc normal)
    private double totalPrice;
    private String productName;
    private String imageId;
    
    // Live commerce tracking fields
    private String liveRoomId;      // ID phòng live (null nếu mua bình thường)
    private String liveProductId;   // ID trong bảng live_products
    private Double originalPrice;   // Giá gốc (để hiển thị gạch ngang)
    private Double livePrice;       // Giá live tại thời điểm thêm
    private Boolean isFromLive;     // Flag đánh dấu item từ live
}
