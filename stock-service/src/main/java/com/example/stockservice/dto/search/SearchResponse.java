package com.example.stockservice.dto.search;

import com.example.stockservice.dto.ProductDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO cho search API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse {
    
    /**
     * Danh sách products
     */
    private List<ProductDto> products;
    
    /**
     * Tổng số products (không phân trang)
     */
    private Long total;
    
    /**
     * Trang hiện tại
     */
    private Integer page;
    
    /**
     * Số items per page
     */
    private Integer size;
    
    /**
     * Tổng số trang
     */
    private Integer totalPages;
    
    /**
     * Flag: Kết quả này có từ cache không?
     */
    private Boolean cached;
    
    /**
     * Parsed search criteria (để debug/display)
     */
    private SearchCriteria parsedCriteria;
}
