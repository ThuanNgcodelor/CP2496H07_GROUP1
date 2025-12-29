package com.example.stockservice.request.flashsale;

import lombok.Data;

@Data
public class FlashSaleProductRegistrationRequest {
    private String sessionId;
    private String productId;
    // ShopId will be extracted from token
    private double salePrice;
    private int flashSaleStock;
}
