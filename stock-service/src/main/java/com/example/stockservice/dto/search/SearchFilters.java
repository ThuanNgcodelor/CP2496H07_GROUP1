package com.example.stockservice.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Additional search filters từ UI (không từ query string)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchFilters {
    
    private Double priceMin;
    private Double priceMax;
    private List<String> categories;
    private List<String> sizes;
    private List<String> locations;
    private List<String> shipping; // "fast", "economical"
    private List<String> shopTypes; // "mall", "favorite"
    private List<String> conditions; // "new", "used"
    private List<Integer> ratings; // 1-5
    private List<String> promotions; // "sale", "stock"
}
