package com.example.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculateShippingFeeRequest {
    private String addressId; // Customer address ID
    private Integer weight; // Total weight in grams
    private Integer quantity; // Total quantity of items
    private String shopOwnerId; // Shop owner ID (optional, will try to get from first product if not provided)
    private String productId; // First product ID (optional, to get shop owner)
}

