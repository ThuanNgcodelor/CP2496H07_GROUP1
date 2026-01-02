package com.example.stockservice.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO chứa các tiêu chí tìm kiếm sau khi parse query
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchCriteria {
    
    /**
     * Keywords chính để tìm kiếm (đã loại bỏ price, category, size keywords)
     */
    @Builder.Default
    private List<String> keywords = new ArrayList<>();
    
    /**
     * Giá tối thiểu (VNĐ)
     */
    private Double priceMin;
    
    /**
     * Giá tối đa (VNĐ)
     */
    private Double priceMax;
    
    /**
     * Danh sách category names được extract từ query
     */
    @Builder.Default
    private List<String> categories = new ArrayList<>();
    
    /**
     * Danh sách sizes được extract từ query
     */
    @Builder.Default
    private List<String> sizes = new ArrayList<>();
    
    /**
     * Danh sách locations (tỉnh/thành phố)
     */
    @Builder.Default
    private List<String> locations = new ArrayList<>();
    
    /**
     * Original query (để debug)
     */
    private String originalQuery;
}
