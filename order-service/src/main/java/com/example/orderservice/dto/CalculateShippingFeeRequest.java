package com.example.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculateShippingFeeRequest {
    private String addressId; // Customer address ID
    private Integer weight; // Total weight in grams (deprecated - will calculate from selectedItems)
    private Integer quantity; // Total quantity of items (deprecated - will calculate from selectedItems)
    private String shopOwnerId; // Shop owner ID (optional, will try to get from first product if not provided)
    private String productId; // First product ID (optional, to get shop owner)
    private List<SelectedItemDto> selectedItems; // List of selected items to calculate weight from
}

