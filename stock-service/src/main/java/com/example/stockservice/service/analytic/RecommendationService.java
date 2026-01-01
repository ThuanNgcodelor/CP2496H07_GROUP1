package com.example.stockservice.service.analytic;

import com.example.stockservice.dto.analytics.RecommendationResponse;
import com.example.stockservice.enums.ProductStatus;
import com.example.stockservice.jwt.JwtUtil;
import com.example.stockservice.model.Product;
import com.example.stockservice.repository.ProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for generating personalized product recommendations
 * Uses tracking data from Redis to provide real-time recommendations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {
    
    private final AnalyticsRedisService redisService;
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;
    
    // ==================== Public API Methods ====================
    
    /**
     * Get recently viewed products with full details
     */
    public List<RecommendationResponse> getRecentlyViewedWithDetails(int limit) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return List.of();
        }
        
        List<String> productIds = redisService.getRecentlyViewed(userId, limit);
        if (productIds.isEmpty()) {
            return List.of();
        }
        
        return productIds.stream()
                .map(id -> buildRecommendation(id, "recently_viewed", null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
    
    /**
     * Get trending products with full details
     */
    public List<RecommendationResponse> getTrendingProductsWithDetails(int limit) {
        Set<String> productIds = redisService.getTrendingProducts(limit);
        if (productIds.isEmpty()) {
            return List.of();
        }
        
        return productIds.stream()
                .map(id -> buildRecommendation(id, "trending", null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
    
    /**
     * Get personalized recommendations based on user behavior
     */
    public List<RecommendationResponse> getPersonalizedRecommendations(int limit) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return List.of();
        }
        
        // Get recently viewed products to find categories
        List<String> recentlyViewed = redisService.getRecentlyViewed(userId, 5);
        if (recentlyViewed.isEmpty()) {
            return getTrendingProductsWithDetails(limit);
        }
        
        // Get first viewed product for recommendation reason
        Optional<Product> firstProduct = productRepository.findById(recentlyViewed.get(0));
        if (firstProduct.isEmpty()) {
            return getTrendingProductsWithDetails(limit);
        }
        
        Product baseProduct = firstProduct.get();
        String categoryId = getCategoryIdFromProduct(baseProduct);
        String reason = "Vì bạn đã xem " + baseProduct.getName();
        
        // Find products in same category, excluding already viewed
        Set<String> viewedSet = new HashSet<>(recentlyViewed);
        final List<Product> recommendations = new ArrayList<>();
        
        if (categoryId != null) {
            List<Product> categoryProducts = productRepository.findByCategoryId(categoryId).stream()
                    .filter(p -> !viewedSet.contains(p.getId()))
                    .filter(this::isProductActive)
                    .limit(limit)
                    .collect(Collectors.toList());
            recommendations.addAll(categoryProducts);
        }
        
        // If not enough, add more from same shop
        if (recommendations.size() < limit) {
            String shopId = baseProduct.getUserId();
            List<Product> shopProducts = productRepository.findByUserId(shopId).stream()
                    .filter(p -> !viewedSet.contains(p.getId()))
                    .filter(p -> !recommendations.contains(p))
                    .filter(this::isProductActive)
                    .limit(limit - recommendations.size())
                    .collect(Collectors.toList());
            recommendations.addAll(shopProducts);
        }
        
        return recommendations.stream()
                .map(p -> buildRecommendationFromProduct(p, "personalized", reason))
                .collect(Collectors.toList());
    }
    
    /**
     * Get similar products to a given product
     */
    public List<RecommendationResponse> getSimilarProducts(String productId, int limit) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return List.of();
        }
        
        Product product = productOpt.get();
        String categoryId = getCategoryIdFromProduct(product);
        String shopId = product.getUserId();
        
        List<Product> similar = new ArrayList<>();
        
        // First, find products in same category
        if (categoryId != null) {
            List<Product> categoryProducts = productRepository.findByCategoryId(categoryId).stream()
                    .filter(p -> !p.getId().equals(productId))
                    .filter(this::isProductActive)
                    .limit(limit)
                    .collect(Collectors.toList());
            similar.addAll(categoryProducts);
        }
        
        // If not enough, add from same shop
        if (similar.size() < limit && shopId != null) {
            List<Product> shopProducts = productRepository.findByUserId(shopId).stream()
                    .filter(p -> !p.getId().equals(productId))
                    .filter(p -> !similar.contains(p))
                    .filter(this::isProductActive)
                    .limit(limit - similar.size())
                    .collect(Collectors.toList());
            similar.addAll(shopProducts);
        }
        
        return similar.stream()
                .map(p -> buildRecommendationFromProduct(p, "similar", "Sản phẩm tương tự"))
                .collect(Collectors.toList());
    }
    
    // ==================== Helper Methods ====================
    
    /**
     * Check if product is active (IN_STOCK status)
     */
    private boolean isProductActive(Product product) {
        return product.getStatus() == ProductStatus.IN_STOCK;
    }
    
    /**
     * Get category ID from product safely
     */
    private String getCategoryIdFromProduct(Product product) {
        if (product.getCategory() != null) {
            return product.getCategory().getId();
        }
        return null;
    }
    
    /**
     * Build recommendation response from product ID
     */
    private RecommendationResponse buildRecommendation(String productId, String source, String reason) {
        try {
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isEmpty()) {
                return null;
            }
            return buildRecommendationFromProduct(productOpt.get(), source, reason);
        } catch (Exception e) {
            log.warn("Failed to build recommendation for product {}: {}", productId, e.getMessage());
            return null;
        }
    }
    
    /**
     * Build recommendation response from product entity
     */
    private RecommendationResponse buildRecommendationFromProduct(Product product, String source, String reason) {
        Long viewCount = redisService.getViewCount(product.getId());
        String categoryId = getCategoryIdFromProduct(product);
        
        return RecommendationResponse.builder()
                .productId(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .imageId(product.getImageId())
                .shopId(product.getUserId())
                .categoryId(categoryId)
                .viewCount(viewCount)
                .source(source)
                .reason(reason)
                .build();
    }
    
    /**
     * Get current authenticated user ID from JWT token
     */
    private String getCurrentUserId() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                return jwtUtil.ExtractUserId(request);
            }
        } catch (Exception e) {
            log.debug("Could not get current user ID: {}", e.getMessage());
        }
        return null;
    }
}

