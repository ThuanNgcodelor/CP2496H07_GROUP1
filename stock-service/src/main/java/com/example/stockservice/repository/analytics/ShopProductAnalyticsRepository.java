package com.example.stockservice.repository.analytics;

import com.example.stockservice.model.analytics.ProductAnalytics;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ProductAnalytics entity - stores aggregated product metrics
 * Renamed to ShopProductAnalyticsRepository to avoid bean name conflict with base package repo
 */
@Repository
public interface ShopProductAnalyticsRepository extends JpaRepository<ProductAnalytics, String> {
    
    /**
     * Find analytics for all products of a shop
     */
    List<ProductAnalytics> findByShopIdOrderByViewCountDesc(String shopId);
    
    /**
     * Find top viewed products for a shop
     */
    List<ProductAnalytics> findByShopIdOrderByViewCountDesc(String shopId, Pageable pageable);
    
    /**
     * Find products with high views but low purchases (abandoned products)
     */
    @Query("SELECT p FROM product_analytics p WHERE p.shopId = :shopId " +
           "AND p.viewCount > :minViews AND p.purchaseCount < :maxPurchases " +
           "ORDER BY p.viewCount DESC")
    List<ProductAnalytics> findAbandonedProducts(
            @Param("shopId") String shopId,
            @Param("minViews") long minViews,
            @Param("maxPurchases") long maxPurchases,
            Pageable pageable
    );
    
    /**
     * Get total stats for a shop
     */
    @Query("SELECT SUM(p.viewCount), SUM(p.cartCount), SUM(p.purchaseCount) " +
           "FROM product_analytics p WHERE p.shopId = :shopId")
    List<Object[]> getShopTotalStats(@Param("shopId") String shopId);
    
    /**
     * Increment view count for a product
     */
    @Modifying
    @Query("UPDATE product_analytics p SET p.viewCount = p.viewCount + 1, " +
           "p.updatedAt = CURRENT_TIMESTAMP WHERE p.productId = :productId")
    void incrementViewCount(@Param("productId") String productId);
    
    /**
     * Increment cart count for a product
     */
    @Modifying
    @Query("UPDATE product_analytics p SET p.cartCount = p.cartCount + 1, " +
           "p.updatedAt = CURRENT_TIMESTAMP WHERE p.productId = :productId")
    void incrementCartCount(@Param("productId") String productId);
    
    /**
     * Increment purchase count for a product
     */
    @Modifying
    @Query("UPDATE product_analytics p SET p.purchaseCount = p.purchaseCount + 1, " +
           "p.updatedAt = CURRENT_TIMESTAMP WHERE p.productId = :productId")
    void incrementPurchaseCount(@Param("productId") String productId);
    
    /**
     * Find trending products (most views in recent period)
     */
    @Query("SELECT p FROM product_analytics p ORDER BY p.viewCount DESC")
    List<ProductAnalytics> findTrendingProducts(Pageable pageable);
}
