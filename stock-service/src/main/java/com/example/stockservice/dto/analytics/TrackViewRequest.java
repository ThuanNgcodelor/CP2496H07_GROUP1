package com.example.stockservice.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for tracking product view events
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackViewRequest {
    
    /**
     * Product ID being viewed (required)
     */
    private String productId;
    
    /**
     * Source of the view (homepage, search, category, recommendation, etc.)
     */
    private String source;
    
    /**
     * Duration in seconds how long user viewed the product
     */
    private Integer duration;
    
    /**
     * Session ID for tracking guest users
     */
    private String sessionId;
}
