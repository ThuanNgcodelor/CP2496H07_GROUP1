package com.example.stockservice.request.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request để thêm sản phẩm từ Live Stream vào giỏ hàng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddLiveCartItemRequest {
    private String productId;
    private String sizeId;
    private int quantity;
    
    // Live commerce fields
    private String liveRoomId;      // ID phòng live
    private String liveProductId;   // ID trong bảng live_products
    private Double livePrice;       // Giá live
    private Double originalPrice;   // Giá gốc
}
