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
 * ===== PHASE 2: RECOMMENDATION SERVICE =====
 * 
 * Service tạo gợi ý sản phẩm cá nhân hóa dựa trên dữ liệu hành vi từ Phase 1
 * Sử dụng dữ liệu tracking từ Redis để gợi ý real-time
 * 
 * CÁC LOẠI GỢI Ý:
 * 
 * 1. RECENTLY VIEWED (Đã xem gần đây)
 *    - Nguồn: Redis list "analytics:recent:{userId}"
 *    - Chỉ dành cho user đã đăng nhập
 *    - Hiển thị: Section "Đã xem gần đây" trên HomePage
 * 
 * 2. TRENDING PRODUCTS (Sản phẩm xu hướng)
 *    - Nguồn: Redis sorted set "analytics:trending_products"
 *    - Dành cho tất cả (Guest + User)
 *    - Hiển thị: Section "Sản phẩm xu hướng" trên HomePage
 * 
 * 3. PERSONALIZED (Có thể bạn quan tâm)
 *    - Logic: Tìm sản phẩm cùng category với sản phẩm đã xem
 *    - Fallback: Nếu không có history → trả về trending
 *    - Chỉ dành cho user đã đăng nhập
 *    - Hiển thị: Section "Có thể bạn quan tâm" trên HomePage
 * 
 * 4. SIMILAR PRODUCTS (Sản phẩm tương tự)
 *    - Logic: Tìm sản phẩm cùng category hoặc cùng shop
 *    - Dành cho tất cả
 *    - Hiển thị: Section "Sản phẩm tương tự" trên ProductDetailPage
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {
    
    private final AnalyticsRedisService redisService;
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;
    
    // ==================== API METHODS (Phương thức API) ====================
    
    /**
     * Lấy sản phẩm ĐÃ XEM GẦN ĐÂY với đầy đủ thông tin
     * Luồng:
     * 1. Lấy userId từ JWT
     * 2. Query Redis để lấy danh sách productId đã xem
     * 3. Lookup product details từ MySQL
     * 4. Trả về RecommendationResponse với đầy đủ thông tin
     * @param limit Số lượng sản phẩm tối đa
     * @return Danh sách sản phẩm đã xem (rỗng nếu chưa đăng nhập)
     */
    public List<RecommendationResponse> getRecentlyViewedWithDetails(int limit) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return List.of(); // Guest user - không có history
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
     * Lấy sản phẩm XU HƯỚNG (được xem nhiều nhất) với đầy đủ thông tin
     * Dành cho: Tất cả users (Guest + Logged-in)
     * @param limit Số lượng sản phẩm tối đa
     * @return Danh sách sản phẩm trending
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
     * Lấy gợi ý CÁ NHÂN HÓA dựa trên hành vi user
     * Logic gợi ý:
     * 1. Lấy 5 sản phẩm đã xem gần đây
     * 2. Lấy category của sản phẩm đầu tiên
     * 3. Tìm sản phẩm cùng category (loại bỏ sản phẩm đã xem)
     * 4. Nếu không đủ → thêm sản phẩm cùng shop
     * 5. Fallback: Nếu không có history → trả về trending
     * @param limit Số lượng sản phẩm tối đa
     * @return Danh sách sản phẩm gợi ý cá nhân hóa
     */
    public List<RecommendationResponse> getPersonalizedRecommendations(int limit) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return List.of(); // Guest user
        }
        
        // Lấy 5 sản phẩm đã xem gần đây để phân tích category
        List<String> recentlyViewed = redisService.getRecentlyViewed(userId, 5);
        if (recentlyViewed.isEmpty()) {
            // Không có history → trả về trending products
            return getTrendingProductsWithDetails(limit);
        }
        
        // Lấy sản phẩm đầu tiên để xác định category
        Optional<Product> firstProduct = productRepository.findById(recentlyViewed.get(0));
        if (firstProduct.isEmpty()) {
            return getTrendingProductsWithDetails(limit);
        }
        
        Product baseProduct = firstProduct.get();
        String categoryId = getCategoryIdFromProduct(baseProduct);
        String reason = "Vì bạn đã xem " + baseProduct.getName();
        
        // Tìm sản phẩm cùng category, loại bỏ sản phẩm đã xem
        Set<String> viewedSet = new HashSet<>(recentlyViewed);
        final List<Product> recommendations = new ArrayList<>();
        
        if (categoryId != null) {
            List<Product> categoryProducts = productRepository.findByCategoryId(categoryId).stream()
                    .filter(p -> !viewedSet.contains(p.getId()))   // Loại bỏ đã xem
                    .filter(this::isProductActive)                   // Chỉ lấy sản phẩm đang bán
                    .limit(limit)
                    .toList();
            recommendations.addAll(categoryProducts);
        }
        
        // Nếu không đủ số lượng → thêm sản phẩm cùng shop
        if (recommendations.size() < limit) {
            String shopId = baseProduct.getUserId();
            List<Product> shopProducts = productRepository.findByUserId(shopId).stream()
                    .filter(p -> !viewedSet.contains(p.getId()))
                    .filter(p -> !recommendations.contains(p))
                    .filter(this::isProductActive)
                    .limit(limit - recommendations.size())
                    .toList();
            recommendations.addAll(shopProducts);
        }
        
        return recommendations.stream()
                .map(p -> buildRecommendationFromProduct(p, "personalized", reason))
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy sản phẩm TƯƠNG TỰ với một sản phẩm cụ thể
     * Dùng cho: ProductDetailPage
     * Logic:
     * 1. Tìm sản phẩm cùng category
     * 2. Nếu không đủ → thêm sản phẩm cùng shop
     * 
     * @param productId ID sản phẩm gốc
     * @param limit Số lượng sản phẩm tối đa
     * @return Danh sách sản phẩm tương tự
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
        
        // Bước 1: Tìm sản phẩm cùng category
        if (categoryId != null) {
            List<Product> categoryProducts = productRepository.findByCategoryId(categoryId).stream()
                    .filter(p -> !p.getId().equals(productId))  // Loại bỏ sản phẩm gốc
                    .filter(this::isProductActive)
                    .limit(limit)
                    .toList();
            similar.addAll(categoryProducts);
        }
        
        // Bước 2: Nếu không đủ → thêm sản phẩm cùng shop
        if (similar.size() < limit && shopId != null) {
            List<Product> shopProducts = productRepository.findByUserId(shopId).stream()
                    .filter(p -> !p.getId().equals(productId))
                    .filter(p -> !similar.contains(p))
                    .filter(this::isProductActive)
                    .limit(limit - similar.size())
                    .toList();
            similar.addAll(shopProducts);
        }
        
        return similar.stream()
                .map(p -> buildRecommendationFromProduct(p, "similar", "Sản phẩm tương tự"))
                .collect(Collectors.toList());
    }
    
    // ==================== HELPER METHODS (Phương thức hỗ trợ) ====================
    
    /**
     * Kiểm tra sản phẩm có đang bán không (status = IN_STOCK)
     */
    private boolean isProductActive(Product product) {
        return product.getStatus() == ProductStatus.IN_STOCK;
    }
    
    /**
     * Lấy categoryId từ product một cách an toàn
     */
    private String getCategoryIdFromProduct(Product product) {
        if (product.getCategory() != null) {
            return product.getCategory().getId();
        }
        return null;
    }
    
    /**
     * Tạo RecommendationResponse từ productId
     */
    private RecommendationResponse buildRecommendation(String productId, String source, String reason) {
        try {
            Optional<Product> productOpt = productRepository.findById(productId);
            return productOpt.map(product -> buildRecommendationFromProduct(product, source, reason)).orElse(null);
        } catch (Exception e) {
            log.warn("Lỗi tạo recommendation cho sản phẩm {}: {}", productId, e.getMessage());
            return null;
        }
    }
    
    /**
     * Tạo RecommendationResponse từ Product entity
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
     * Lấy userId hiện tại từ JWT token
     */
    private String getCurrentUserId() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                return jwtUtil.ExtractUserId(request);
            }
        } catch (Exception e) {
            log.debug("Không thể lấy userId: {}", e.getMessage());
        }
        return null;
    }
}
