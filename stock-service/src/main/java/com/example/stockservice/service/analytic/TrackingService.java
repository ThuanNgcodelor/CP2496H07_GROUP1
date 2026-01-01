package com.example.stockservice.service.analytic;

import com.example.stockservice.dto.analytics.BehaviorEventDto;
import com.example.stockservice.dto.analytics.TrackCartRequest;
import com.example.stockservice.dto.analytics.TrackSearchRequest;
import com.example.stockservice.dto.analytics.TrackViewRequest;
import com.example.stockservice.enums.EventType;
import com.example.stockservice.jwt.JwtUtil;
import com.example.stockservice.model.Product;
import com.example.stockservice.repository.ProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Main service for tracking user behavior events
 * Coordinates between Redis (real-time) and Kafka (async persistence)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TrackingService {
    
    private final AnalyticsRedisService redisService;
    private final BehaviorKafkaProducer kafkaProducer;
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;
    
    /**
     * Track product view event
     * Updates Redis counters immediately and sends to Kafka for persistence
     * 
     * @param request View tracking request
     */
    public void trackView(TrackViewRequest request) {
        String userId = getCurrentUserId();
        String shopId = getShopIdForProduct(request.getProductId());
        
        log.info("Tracking view: productId={}, userId={}, source={}", 
                request.getProductId(), userId, request.getSource());
        
        // 1. Update Redis counters immediately (real-time)
        redisService.incrementViewCount(request.getProductId());
        
        // 2. Add to recently viewed for logged-in users
        if (userId != null) {
            redisService.addRecentlyViewed(userId, request.getProductId());
        }
        
        // 3. Send to Kafka for async persistence
        BehaviorEventDto event = BehaviorEventDto.builder()
                .eventId(UUID.randomUUID().toString())
                .userId(userId)
                .sessionId(request.getSessionId())
                .eventType(EventType.VIEW)
                .productId(request.getProductId())
                .shopId(shopId)
                .source(request.getSource())
                .duration(request.getDuration())
                .timestamp(LocalDateTime.now())
                .build();
        
        kafkaProducer.sendEvent(event);
    }
    
    /**
     * Track search event
     * Updates Redis search counters and trending keywords
     * 
     * @param request Search tracking request
     */
    public void trackSearch(TrackSearchRequest request) {
        String userId = getCurrentUserId();
        
        log.info("Tracking search: keyword={}, userId={}", request.getKeyword(), userId);
        
        // 1. Update Redis search counter and trending
        redisService.incrementSearchCount(request.getKeyword());
        
        // 2. Send to Kafka for async persistence
        BehaviorEventDto event = BehaviorEventDto.builder()
                .eventId(UUID.randomUUID().toString())
                .userId(userId)
                .sessionId(request.getSessionId())
                .eventType(EventType.SEARCH)
                .keyword(request.getKeyword())
                .timestamp(LocalDateTime.now())
                .build();
        
        kafkaProducer.sendEvent(event);
    }
    
    /**
     * Track add to cart event
     * 
     * @param request Cart tracking request
     */
    public void trackCart(TrackCartRequest request) {
        String userId = getCurrentUserId();
        String shopId = getShopIdForProduct(request.getProductId());
        
        log.info("Tracking add to cart: productId={}, userId={}, quantity={}", 
                request.getProductId(), userId, request.getQuantity());
        
        // Send to Kafka for async persistence
        BehaviorEventDto event = BehaviorEventDto.builder()
                .eventId(UUID.randomUUID().toString())
                .userId(userId)
                .eventType(EventType.ADD_CART)
                .productId(request.getProductId())
                .shopId(shopId)
                .quantity(request.getQuantity())
                .timestamp(LocalDateTime.now())
                .build();
        
        kafkaProducer.sendEvent(event);
    }
    
    /**
     * Track purchase event (called from order service via Kafka or Feign)
     * 
     * @param userId User ID
     * @param productId Product ID
     * @param shopId Shop ID
     * @param orderId Order ID
     */
    public void trackPurchase(String userId, String productId, String shopId, String orderId) {
        log.info("Tracking purchase: productId={}, userId={}, orderId={}", 
                productId, userId, orderId);
        
        BehaviorEventDto event = BehaviorEventDto.builder()
                .eventId(UUID.randomUUID().toString())
                .userId(userId)
                .eventType(EventType.PURCHASE)
                .productId(productId)
                .shopId(shopId)
                .timestamp(LocalDateTime.now())
                .build();
        
        kafkaProducer.sendEvent(event);
    }
    
    /**
     * Track purchase event from frontend
     * Called when user successfully places an order from the frontend
     * 
     * @param productId Product ID
     * @param quantity Quantity purchased
     */
    public void trackPurchaseFromFrontend(String productId, Integer quantity) {
        String userId = getCurrentUserId();
        String shopId = getShopIdForProduct(productId);
        
        log.info("Tracking purchase from frontend: productId={}, userId={}, quantity={}", 
                productId, userId, quantity);
        
        BehaviorEventDto event = BehaviorEventDto.builder()
                .eventId(UUID.randomUUID().toString())
                .userId(userId)
                .eventType(EventType.PURCHASE)
                .productId(productId)
                .shopId(shopId)
                .quantity(quantity)
                .timestamp(LocalDateTime.now())
                .build();
        
        kafkaProducer.sendEvent(event);
    }
    
    // ==================== Query Methods ====================
    
    /**
     * Get recently viewed products for current user
     * 
     * @param limit Maximum number of products
     * @return List of product IDs
     */
    public List<String> getRecentlyViewed(int limit) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return List.of();
        }
        return redisService.getRecentlyViewed(userId, limit);
    }
    
    /**
     * Get trending search keywords
     * 
     * @param limit Maximum number of keywords
     * @return Set of trending keywords
     */
    public Set<String> getTrendingKeywords(int limit) {
        return redisService.getTrendingKeywords(limit);
    }
    
    /**
     * Get trending products
     * 
     * @param limit Maximum number of products
     * @return Set of product IDs
     */
    public Set<String> getTrendingProducts(int limit) {
        return redisService.getTrendingProducts(limit);
    }
    
    /**
     * Get view count for a product
     * 
     * @param productId Product ID
     * @return View count
     */
    public Long getViewCount(String productId) {
        return redisService.getViewCount(productId);
    }
    
    // ==================== Helper Methods ====================
    
    /**
     * Get current authenticated user ID from JWT token
     * Returns the actual userId (UUID) instead of email
     */
    private String getCurrentUserId() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                return jwtUtil.ExtractUserId(request);
            }
        } catch (Exception e) {
            log.debug("Could not get current user ID from JWT: {}", e.getMessage());
        }
        return null;
    }
    
    /**
     * Get shop ID for a product
     */
    private String getShopIdForProduct(String productId) {
        if (productId == null) {
            return null;
        }
        try {
            return productRepository.findById(productId)
                    .map(Product::getUserId)
                    .orElse(null);
        } catch (Exception e) {
            log.warn("Could not get shop ID for product {}: {}", productId, e.getMessage());
            return null;
        }
    }
}
