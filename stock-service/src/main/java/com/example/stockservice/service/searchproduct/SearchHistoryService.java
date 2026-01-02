package com.example.stockservice.service.searchproduct;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Service quản lý search history của từng user trong Redis
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SearchHistoryService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    private static final String SEARCH_HISTORY_PREFIX = "search:history:";
    private static final long HISTORY_TTL_DAYS = 30; // History giữ 30 ngày
    private static final int MAX_HISTORY_ITEMS = 10; // Tối đa 10 queries
    
    /**
     * Thêm query vào search history của user
     * 
     * @param userId ID người dùng
     * @param query Search query
     */
    public void addSearchHistory(String userId, String query) {
        if (userId == null || userId.isEmpty() || query == null || query.trim().isEmpty()) {
            return;
        }
        
        try {
            String normalizedQuery = query.trim().toLowerCase();
            String key = SEARCH_HISTORY_PREFIX + userId;
            
            // Remove nếu đã tồn tại (để move lên đầu)
            redisTemplate.opsForList().remove(key, 1, normalizedQuery);
            
            // Push vào đầu list (mới nhất ở đầu)
            redisTemplate.opsForList().leftPush(key, normalizedQuery);
            
            // Trim giữ tối đa MAX_HISTORY_ITEMS
            redisTemplate.opsForList().trim(key, 0, MAX_HISTORY_ITEMS - 1);
            
            // Set TTL
            redisTemplate.expire(key, HISTORY_TTL_DAYS, TimeUnit.DAYS);
            
            log.debug("Added search history for user {}: {}", userId, normalizedQuery);
        } catch (Exception e) {
            log.warn("Failed to add search history for user {}: {}", userId, e.getMessage());
        }
    }
    
    /**
     * Lấy search history của user
     * 
     * @param userId ID người dùng
     * @param limit Số lượng tối đa
     * @return List queries (mới nhất ở đầu)
     */
    public List<String> getSearchHistory(String userId, int limit) {
        if (userId == null || userId.isEmpty()) {
            return Collections.emptyList();
        }
        
        try {
            String key = SEARCH_HISTORY_PREFIX + userId;
            List<Object> result = redisTemplate.opsForList().range(key, 0, Math.min(limit, MAX_HISTORY_ITEMS) - 1);
            
            if (result == null || result.isEmpty()) {
                return Collections.emptyList();
            }
            
            return result.stream()
                .map(Object::toString)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.warn("Failed to get search history for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }
    
    /**
     * Xóa toàn bộ search history của user
     * 
     * @param userId ID người dùng
     */
    public void clearSearchHistory(String userId) {
        if (userId == null || userId.isEmpty()) {
            return;
        }
        
        try {
            String key = SEARCH_HISTORY_PREFIX + userId;
            redisTemplate.delete(key);
            log.info("Cleared search history for user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to clear search history for user {}: {}", userId, e.getMessage());
        }
    }
    
    /**
     * Xóa một query cụ thể khỏi history
     * 
     * @param userId ID người dùng
     * @param query Query cần xóa
     */
    public void removeSearchHistoryItem(String userId, String query) {
        if (userId == null || userId.isEmpty() || query == null) {
            return;
        }
        
        try {
            String normalizedQuery = query.trim().toLowerCase();
            String key = SEARCH_HISTORY_PREFIX + userId;
            redisTemplate.opsForList().remove(key, 1, normalizedQuery);
            log.debug("Removed search history item for user {}: {}", userId, normalizedQuery);
        } catch (Exception e) {
            log.warn("Failed to remove search history item for user {}: {}", userId, e.getMessage());
        }
    }
}
