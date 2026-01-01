package com.example.stockservice.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for tracking search events
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackSearchRequest {
    
    /**
     * Search keyword entered by user (required)
     */
    private String keyword;
    
    /**
     * Number of results returned for this search
     */
    private Integer resultCount;
    
    /**
     * Session ID for tracking guest users
     */
    private String sessionId;
}
