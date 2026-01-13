package com.example.stockservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestoreStockRequest {
    @NotBlank(message = "Product ID is required")
    private String productId;

    @NotBlank(message = "Size ID is required")
    private String sizeId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
