package com.example.stockservice.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for product recommendation response
 * Contains product details and recommendation reason
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    
    private String productId;
    private String name;
    private Double price;
    private Double originalPrice;
    private String imageId;
    private String shopId;
    private String shopName;
    private String categoryId;
    private String categoryName;
    private Double rating;
    private Long soldCount;
    private Long viewCount;
    
    /**
     * Reason for recommendation (e.g., "Vì bạn đã xem iPhone 15")
     */
    private String reason;
    
    /**
     * Source of recommendation (recently_viewed, trending, similar, personalized)
     */
    private String source;
}
