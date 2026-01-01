package com.example.stockservice.service.analytic;

import com.example.stockservice.dto.analytics.BehaviorEventDto;
import com.example.stockservice.enums.EventType;
import com.example.stockservice.model.analytics.BehaviorLog;
import com.example.stockservice.model.analytics.ProductAnalytics;
import com.example.stockservice.model.analytics.SearchAnalytics;
import com.example.stockservice.repository.analytics.BehaviorLogRepository;
import com.example.stockservice.repository.analytics.ProductAnalyticsRepository;
import com.example.stockservice.repository.analytics.SearchAnalyticsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Kafka consumer for processing behavior events
 * Listens to analytics-topic and persists data to MySQL
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BehaviorKafkaConsumer {
    
    private final BehaviorLogRepository behaviorLogRepository;
    private final ProductAnalyticsRepository productAnalyticsRepository;
    private final SearchAnalyticsRepository searchAnalyticsRepository;
    
    /**
     * Consume behavior events from Kafka and persist to database
     * Uses 10 concurrent threads for high throughput
     */
    @KafkaListener(
            topics = "${kafka.topic.analytics:analytics-topic}",
            groupId = "${spring.kafka.consumer.group-id:stock-service}-analytics",
            containerFactory = "analyticsKafkaListenerContainerFactory"
    )
    @Transactional
    public void consume(BehaviorEventDto event) {
        try {
            log.debug("Received behavior event: type={}, productId={}", 
                    event.getEventType(), event.getProductId());
            
            // 1. Save detailed behavior log
            saveBehaviorLog(event);
            
            // 2. Update product analytics if applicable
            if (event.getProductId() != null) {
                updateProductAnalytics(event);
            }
            
            // 3. Update search analytics if applicable
            if (event.getKeyword() != null && event.getEventType() == EventType.SEARCH) {
                updateSearchAnalytics(event);
            }
            
            log.debug("Processed behavior event successfully: {}", event.getEventId());
            
        } catch (Exception e) {
            log.error("Error processing behavior event {}: {}", event.getEventId(), e.getMessage(), e);
            // Don't rethrow - let Kafka commit the offset to avoid infinite retry
        }
    }
    
    /**
     * Save detailed behavior log record
     */
    private void saveBehaviorLog(BehaviorEventDto event) {
        BehaviorLog log = BehaviorLog.builder()
                .userId(event.getUserId())
                .sessionId(event.getSessionId())
                .eventType(event.getEventType())
                .productId(event.getProductId())
                .shopId(event.getShopId())
                .searchKeyword(event.getKeyword())
                .source(event.getSource())
                .durationSeconds(event.getDuration())
                .build();
        
        behaviorLogRepository.save(log);
    }
    
    /**
     * Update aggregated product analytics
     */
    private void updateProductAnalytics(BehaviorEventDto event) {
        ProductAnalytics analytics = productAnalyticsRepository
                .findById(event.getProductId())
                .orElseGet(() -> ProductAnalytics.builder()
                        .productId(event.getProductId())
                        .shopId(event.getShopId())
                        .viewCount(0L)
                        .cartCount(0L)
                        .purchaseCount(0L)
                        .uniqueViewers(0L)
                        .conversionRate(0.0)
                        .build());
        
        switch (event.getEventType()) {
            case VIEW -> {
                analytics.setViewCount(analytics.getViewCount() + 1);
                analytics.setLastViewedAt(LocalDateTime.now());
            }
            case ADD_CART -> analytics.setCartCount(analytics.getCartCount() + 1);
            case PURCHASE -> analytics.setPurchaseCount(analytics.getPurchaseCount() + 1);
        }
        
        // Recalculate conversion rate
        if (analytics.getViewCount() > 0) {
            double cvr = (analytics.getPurchaseCount() * 100.0) / analytics.getViewCount();
            analytics.setConversionRate(Math.round(cvr * 100.0) / 100.0); // Round to 2 decimals
        }
        
        productAnalyticsRepository.save(analytics);
    }
    
    /**
     * Update search analytics for keyword tracking
     */
    private void updateSearchAnalytics(BehaviorEventDto event) {
        LocalDate today = LocalDate.now();
        String keyword = event.getKeyword().toLowerCase().trim();
        
        SearchAnalytics analytics = searchAnalyticsRepository
                .findByKeywordAndDate(keyword, today)
                .orElseGet(() -> SearchAnalytics.builder()
                        .keyword(keyword)
                        .date(today)
                        .searchCount(0L)
                        .clickCount(0L)
                        .build());
        
        analytics.setSearchCount(analytics.getSearchCount() + 1);
        searchAnalyticsRepository.save(analytics);
    }
}
