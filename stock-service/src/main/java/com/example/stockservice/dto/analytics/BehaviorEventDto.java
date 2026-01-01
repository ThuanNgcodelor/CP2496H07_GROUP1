package com.example.stockservice.dto.analytics;

import com.example.stockservice.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for behavior events sent to Kafka
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BehaviorEventDto {
    
    /**
     * Unique event ID
     */
    private String eventId;
    
    /**
     * User ID (null for guest users)
     */
    private String userId;
    
    /**
     * Session ID for tracking
     */
    private String sessionId;
    
    /**
     * Type of event (VIEW, SEARCH, ADD_CART, PURCHASE)
     */
    private EventType eventType;
    
    /**
     * Product ID (for VIEW, ADD_CART, PURCHASE events)
     */
    private String productId;
    
    /**
     * Shop ID (owner of the product)
     */
    private String shopId;
    
    /**
     * Search keyword (for SEARCH events)
     */
    private String keyword;
    
    /**
     * Source of the event (homepage, search, category, etc.)
     */
    private String source;
    
    /**
     * Duration in seconds (for VIEW events)
     */
    private Integer duration;
    
    /**
     * Quantity (for ADD_CART events)
     */
    private Integer quantity;
    
    /**
     * Timestamp when event occurred
     */
    private LocalDateTime timestamp;
}
