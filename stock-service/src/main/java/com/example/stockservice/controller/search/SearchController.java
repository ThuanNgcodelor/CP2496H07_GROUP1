package com.example.stockservice.controller.search;

import com.example.stockservice.dto.search.AutocompleteResponse;
import com.example.stockservice.dto.search.SearchRequest;
import com.example.stockservice.dto.search.SearchResponse;
import com.example.stockservice.service.searchproduct.SearchHistoryService;
import com.example.stockservice.service.searchproduct.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * REST Controller cho search endpoints
 */
@RestController
@RequestMapping("/v1/stock/search")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Search", description = "Advanced search APIs with caching and autocomplete")
public class SearchController {

    private final SearchService searchService;
    private final SearchHistoryService searchHistoryService;

    /**
     * Main search endpoint
     * POST /v1/stock/search/query
     * 
     * Body: {
     * "query": "máy ảnh 100k",
     * "filters": { "categories": ["Camera"], ... },
     * "page": 0,
     * "size": 20,
     * "sortBy": "price-asc"
     * }
     */
    @PostMapping("/query")
    @Operation(summary = "Search products", description = "Smart search with query parsing, caching, and filtering. Supports Vietnamese and English.")
    public ResponseEntity<SearchResponse> search(@RequestBody SearchRequest request) {
        String userId = getCurrentUserId();
        SearchResponse response = searchService.search(request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Autocomplete endpoint
     * GET /v1/stock/search/autocomplete?q=máy
     */
    @GetMapping("/autocomplete")
    @Operation(summary = "Get autocomplete suggestions", description = "Returns product names, categories, and search history matching the query")
    public ResponseEntity<AutocompleteResponse> autocomplete(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "10") int limit) {
        String userId = getCurrentUserId();
        AutocompleteResponse response = searchService.getAutocomplete(query, userId, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Get search history
     * GET /v1/stock/search/history
     */
    @GetMapping("/history")
    @Operation(summary = "Get user search history", description = "Returns recent search queries for the authenticated user")
    public ResponseEntity<Map<String, List<String>>> getSearchHistory(
            @RequestParam(defaultValue = "10") int limit) {
        String userId = getCurrentUserId();

        if (userId == null) {
            return ResponseEntity.ok(Map.of("history", List.of()));
        }

        List<String> history = searchHistoryService.getSearchHistory(userId, limit);
        return ResponseEntity.ok(Map.of("history", history));
    }

    /**
     * Clear search history
     * DELETE /v1/stock/search/history
     */
    @DeleteMapping("/history")
    @Operation(summary = "Clear search history", description = "Deletes all search history for the authenticated user")
    public ResponseEntity<Map<String, String>> clearSearchHistory() {
        String userId = getCurrentUserId();

        if (userId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User not authenticated"));
        }

        searchHistoryService.clearSearchHistory(userId);
        return ResponseEntity.ok(Map.of("message", "Search history cleared successfully"));
    }

    /**
     * Remove single search history item
     * DELETE /v1/stock/search/history/item?query=...
     */
    @DeleteMapping("/history/item")
    @Operation(summary = "Remove search history item", description = "Removes a specific query from user's search history")
    public ResponseEntity<Map<String, String>> removeHistoryItem(
            @RequestParam("query") String query) {
        String userId = getCurrentUserId();

        if (userId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User not authenticated"));
        }

        searchHistoryService.removeSearchHistoryItem(userId, query);
        searchHistoryService.removeSearchHistoryItem(userId, query);
        return ResponseEntity.ok(Map.of("message", "History item removed successfully"));
    }

    /**
     * Get trending search keywords
     * GET /v1/stock/search/trending
     */
    @GetMapping("/trending")
    @Operation(summary = "Get trending search keywords", description = "Returns most popular search keywords")
    public ResponseEntity<Set<String>> getTrendingKeywords(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(searchService.getTrendingKeywords(limit));
    }

    /**
     * Get current authenticated user ID
     * Returns null if not authenticated (guest user)
     */
    private String getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                return auth.getName(); // Username hoặc user ID
            }
        } catch (Exception e) {
            log.warn("Failed to get current user: {}", e.getMessage());
        }
        return null;
    }
}
