package com.example.stockservice.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO cho search API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequest {
    
    /**
     * Search query từ user
     */
    private String query;
    
    /**
     * Additional filters (không từ query, mà từ UI filters)
     */
    private SearchFilters filters;
    
    /**
     * Page number (0-indexed)
     */
    @Builder.Default
    private Integer page = 0;
    
    /**
     * Page size
     */
    @Builder.Default
    private Integer size = 20;
    
    /**
     * Sort by field
     */
    private String sortBy; // "relevance", "price-asc", "price-desc", "newest", "bestselling"
}
