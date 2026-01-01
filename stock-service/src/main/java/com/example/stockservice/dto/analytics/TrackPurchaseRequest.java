package com.example.stockservice.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for tracking purchase events
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackPurchaseRequest {
    
    /**
     * Product ID purchased (required)
     */
    private String productId;
    
    /**
     * Quantity purchased
     */
    private Integer quantity;
}
