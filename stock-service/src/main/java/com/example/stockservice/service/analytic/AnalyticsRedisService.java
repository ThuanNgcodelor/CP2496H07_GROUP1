package com.example.stockservice.service.analytic;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Service for managing analytics counters and data in Redis
 * Provides real-time tracking capabilities with expiration policies
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsRedisService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    // Key prefixes
    private static final String VIEW_COUNT_PREFIX = "analytics:view:";
    private static final String SEARCH_COUNT_PREFIX = "analytics:search:";
    private static final String RECENT_VIEWS_PREFIX = "analytics:recent:";
    private static final String TRENDING_SEARCH_KEY = "analytics:trending_search";
    private static final String TRENDING_PRODUCTS_KEY = "analytics:trending_products";
    
    // TTL constants
    private static final long VIEW_COUNT_TTL_DAYS = 7;
    private static final long RECENT_VIEWS_TTL_DAYS = 30;
    private static final int MAX_RECENT_VIEWS = 20;
    
    // ==================== VIEW COUNTERS ====================
    
    /**
     * Increment view count for a product
     * @param productId Product ID
     */
    public void incrementViewCount(String productId) {
        try {
            String key = VIEW_COUNT_PREFIX + productId;
            redisTemplate.opsForValue().increment(key);
            redisTemplate.expire(key, VIEW_COUNT_TTL_DAYS, TimeUnit.DAYS);
            
            // Also add to trending products sorted set
            redisTemplate.opsForZSet().incrementScore(TRENDING_PRODUCTS_KEY, productId, 1);
            log.debug("Incremented view count for product: {}", productId);
        } catch (Exception e) {
            log.warn("Failed to increment view count for {}: {}", productId, e.getMessage());
        }
    }
    
    /**
     * Get view count for a product
     * @param productId Product ID
     * @return View count
     */
    public Long getViewCount(String productId) {
        try {
            String key = VIEW_COUNT_PREFIX + productId;
            Object value = redisTemplate.opsForValue().get(key);
            return value != null ? Long.parseLong(value.toString()) : 0L;
        } catch (Exception e) {
            log.warn("Failed to get view count for {}: {}", productId, e.getMessage());
            return 0L;
        }
    }
    
    // ==================== SEARCH COUNTERS ====================
    
    /**
     * Increment search count for a keyword
     * @param keyword Search keyword
     */
    public void incrementSearchCount(String keyword) {
        try {
            String normalizedKeyword = keyword.toLowerCase().trim();
            String key = SEARCH_COUNT_PREFIX + normalizedKeyword;
            redisTemplate.opsForValue().increment(key);
            redisTemplate.expire(key, VIEW_COUNT_TTL_DAYS, TimeUnit.DAYS);
            
            // Add to trending searches sorted set
            redisTemplate.opsForZSet().incrementScore(TRENDING_SEARCH_KEY, normalizedKeyword, 1);
            log.debug("Incremented search count for keyword: {}", normalizedKeyword);
        } catch (Exception e) {
            log.warn("Failed to increment search count for {}: {}", keyword, e.getMessage());
        }
    }
    
    /**
     * Get search count for a keyword
     * @param keyword Search keyword
     * @return Search count
     */
    public Long getSearchCount(String keyword) {
        try {
            String key = SEARCH_COUNT_PREFIX + keyword.toLowerCase().trim();
            Object value = redisTemplate.opsForValue().get(key);
            return value != null ? Long.parseLong(value.toString()) : 0L;
        } catch (Exception e) {
            log.warn("Failed to get search count for {}: {}", keyword, e.getMessage());
            return 0L;
        }
    }
    
    // ==================== RECENTLY VIEWED ====================
    
    /**
     * Add a product to user's recently viewed list
     * @param userId User ID
     * @param productId Product ID
     */
    public void addRecentlyViewed(String userId, String productId) {
        if (userId == null || userId.isEmpty()) {
            return; // Skip for guest users without session tracking
        }
        
        try {
            String key = RECENT_VIEWS_PREFIX + userId;
            
            // Remove if already exists (to move to front)
            redisTemplate.opsForList().remove(key, 1, productId);
            
            // Add to front of list
            redisTemplate.opsForList().leftPush(key, productId);
            
            // Trim to max size
            redisTemplate.opsForList().trim(key, 0, MAX_RECENT_VIEWS - 1);
            
            // Set expiration
            redisTemplate.expire(key, RECENT_VIEWS_TTL_DAYS, TimeUnit.DAYS);
            
            log.debug("Added {} to recent views for user: {}", productId, userId);
        } catch (Exception e) {
            log.warn("Failed to add recent view for user {}: {}", userId, e.getMessage());
        }
    }
    
    /**
     * Get recently viewed products for a user
     * @param userId User ID
     * @param limit Maximum number of products to return
     * @return List of product IDs
     */
    public List<String> getRecentlyViewed(String userId, int limit) {
        if (userId == null || userId.isEmpty()) {
            return Collections.emptyList();
        }
        
        try {
            String key = RECENT_VIEWS_PREFIX + userId;
            List<Object> result = redisTemplate.opsForList().range(key, 0, limit - 1);
            if (result == null) {
                return Collections.emptyList();
            }
            return result.stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.warn("Failed to get recent views for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }
    
    // ==================== TRENDING ====================
    
    /**
     * Get trending search keywords
     * @param limit Maximum number of keywords to return
     * @return Set of trending keywords
     */
    public Set<String> getTrendingKeywords(int limit) {
        try {
            Set<Object> result = redisTemplate.opsForZSet()
                    .reverseRange(TRENDING_SEARCH_KEY, 0, limit - 1);
            if (result == null) {
                return Collections.emptySet();
            }
            return result.stream()
                    .map(Object::toString)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            log.warn("Failed to get trending keywords: {}", e.getMessage());
            return Collections.emptySet();
        }
    }
    
    /**
     * Get trending products (most viewed)
     * @param limit Maximum number of products to return
     * @return Set of product IDs
     */
    public Set<String> getTrendingProducts(int limit) {
        try {
            Set<Object> result = redisTemplate.opsForZSet()
                    .reverseRange(TRENDING_PRODUCTS_KEY, 0, limit - 1);
            if (result == null) {
                return Collections.emptySet();
            }
            return result.stream()
                    .map(Object::toString)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            log.warn("Failed to get trending products: {}", e.getMessage());
            return Collections.emptySet();
        }
    }
    
    /**
     * Reset trending data (can be called daily by a scheduler)
     */
    public void resetTrendingData() {
        try {
            redisTemplate.delete(TRENDING_SEARCH_KEY);
            redisTemplate.delete(TRENDING_PRODUCTS_KEY);
            log.info("Reset trending data");
        } catch (Exception e) {
            log.error("Failed to reset trending data: {}", e.getMessage());
        }
    }
}
