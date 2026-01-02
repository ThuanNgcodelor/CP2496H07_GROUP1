package com.example.stockservice.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO cho autocomplete API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutocompleteResponse {
    
    /**
     * Danh sách suggestions
     */
    private List<Suggestion> suggestions;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Suggestion {
        /**
         * Text để hiển thị
         */
        private String text;
        
        /**
         * Type: "keyword", "product", "category", "history"
         */
        private String type;
        
        /**
         * Optional: Product ID nếu type = "product"
         */
        private String productId;
        
        /**
         * Optional: Số lượng search count (để sort trending)
         */
        private Long count;
    }
}
