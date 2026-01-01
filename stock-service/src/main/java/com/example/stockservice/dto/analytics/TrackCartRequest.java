package com.example.stockservice.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for tracking add to cart events
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackCartRequest {
    
    /**
     * Product ID being added to cart (required)
     */
    private String productId;
    
    /**
     * Quantity being added
     */
    private Integer quantity;
}
