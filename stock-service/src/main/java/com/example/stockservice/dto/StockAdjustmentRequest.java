package com.example.stockservice.dto;

import lombok.Data;

@Data
public class StockAdjustmentRequest {
    private String productId;
    private String sizeId;
    private int newStock;
    private String reason;
}
