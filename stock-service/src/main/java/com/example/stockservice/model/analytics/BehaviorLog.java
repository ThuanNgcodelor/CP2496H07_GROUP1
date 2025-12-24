package com.example.stockservice.model.analytics;

import com.example.stockservice.enums.EventType;
import com.example.stockservice.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity to store detailed behavior logs for analytics
 * Each user action (view, search, add to cart) creates one record
 */
@Entity(name = "behavior_logs")
@Table(name = "behavior_logs", indexes = {
    @Index(name = "idx_product_id", columnList = "productId"),
    @Index(name = "idx_shop_id", columnList = "shopId"),
    @Index(name = "idx_event_type", columnList = "eventType"),
    @Index(name = "idx_created_at", columnList = "createdTimestamp")
})
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BehaviorLog extends BaseEntity {
    
    /**
     * User ID - NULL if guest user
     */
    private String userId;
    
    /**
     * Session ID - Used to track guest users
     */
    private String sessionId;
    
    /**
     * Type of event (VIEW, SEARCH, ADD_CART, PURCHASE)
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EventType eventType;
    
    /**
     * Product ID - Required for VIEW, ADD_CART, PURCHASE events
     */
    private String productId;
    
    /**
     * Shop ID - Owner of the product
     */
    private String shopId;
    
    /**
     * Search keyword - Required for SEARCH events
     */
    @Column(length = 255)
    private String searchKeyword;
    
    /**
     * Source of the event (homepage, search, category, recommendation)
     */
    @Column(length = 50)
    private String source;
    
    /**
     * Duration in seconds - How long user viewed the product (for VIEW events)
     */
    private Integer durationSeconds;
}
