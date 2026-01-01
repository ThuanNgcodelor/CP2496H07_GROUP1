# 🔴 PHASE 1: Behavior Tracking - Implementation Plan

## ✅ Đã Có Sẵn (Không Cần Làm)

| Component | File | Status |
|-----------|------|--------|
| **Redis Config** | `stock-service/.../config/RedisConfig.java` | ✅ Đã có |
| **Kafka Config** | `stock-service/.../config/KafkaConfig.java` | ✅ Đã có (cần mở rộng) |
| **BehaviorLog Model** | `stock-service/.../model/analytics/BehaviorLog.java` | ✅ Đã có |
| **ProductAnalytics Model** | `stock-service/.../model/analytics/ProductAnalytics.java` | ✅ Đã có |
| **SearchAnalytics Model** | `stock-service/.../model/analytics/SearchAnalytics.java` | ✅ Đã có |
| **Docker (Redis, Kafka)** | `docker-compose.yml` | ✅ Đã có |

---

## 📋 Cần Làm (Chi Tiết)

### 📦 Step 1.1: Event Tracking API (3 ngày)

#### Backend Files Cần Tạo:

```
stock-service/src/main/java/com/example/stockservice/
├── controller/analytics/
│   └── TrackingController.java              [NEW]
├── service/analytics/
│   └── TrackingService.java                 [NEW]
├── dto/analytics/
│   ├── TrackViewRequest.java                [NEW]
│   ├── TrackSearchRequest.java              [NEW]
│   ├── TrackCartRequest.java                [NEW]
│   └── BehaviorEventDto.java                [NEW]
└── repository/analytics/
    ├── BehaviorLogRepository.java           [NEW]
    ├── ProductAnalyticsRepository.java      [NEW]
    └── SearchAnalyticsRepository.java       [NEW]
```

#### API Endpoints:

| Method | Endpoint | Request Body | Description |
|--------|----------|--------------|-------------|
| POST | `/v1/stock/analytics/track/view` | `{productId, duration, source, sessionId}` | Track xem sản phẩm |
| POST | `/v1/stock/analytics/track/search` | `{keyword, resultCount, sessionId}` | Track tìm kiếm |
| POST | `/v1/stock/analytics/track/cart` | `{productId, quantity}` | Track thêm giỏ |

#### TrackingController.java:
```java
@RestController
@RequestMapping("/v1/stock/analytics/track")
public class TrackingController {
    
    @PostMapping("/view")
    public ResponseEntity<Void> trackView(@RequestBody TrackViewRequest request) {
        trackingService.trackView(request);
        return ResponseEntity.ok().build(); // Response ngay, xử lý async
    }
    
    @PostMapping("/search")
    public ResponseEntity<Void> trackSearch(@RequestBody TrackSearchRequest request) {...}
    
    @PostMapping("/cart")
    public ResponseEntity<Void> trackCart(@RequestBody TrackCartRequest request) {...}
}
```

---

### 📬 Step 1.2: Kafka Producer (1 ngày)

#### File Cần Tạo:
```
stock-service/src/main/java/com/example/stockservice/
├── service/analytics/
│   └── BehaviorKafkaProducer.java           [NEW]
├── event/
│   └── BehaviorEvent.java                   [NEW]
└── config/
    └── KafkaConfig.java                     [MODIFY - thêm analytics topic]
```

#### KafkaConfig.java (Thêm):
```java
@Value("${kafka.topic.analytics}")
private String analyticsTopic;

@Bean
public NewTopic analyticsTopic() {
    return TopicBuilder.name(analyticsTopic)
            .partitions(10)  // 10 partitions cho throughput cao
            .replicas(1)
            .build();
}

// Thêm generic producer cho BehaviorEvent
@Bean
public KafkaTemplate<String, Object> genericKafkaTemplate() {
    return new KafkaTemplate<>(genericProducerFactory());
}
```

#### BehaviorKafkaProducer.java:
```java
@Service
@RequiredArgsConstructor
public class BehaviorKafkaProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Value("${kafka.topic.analytics}")
    private String topic;
    
    @Async // Non-blocking
    public void sendEvent(BehaviorEvent event) {
        kafkaTemplate.send(topic, event.getProductId(), event);
    }
}
```

---

### 🔴 Step 1.3: Redis Counters (1 ngày)

#### File Cần Tạo:
```
stock-service/src/main/java/com/example/stockservice/
└── service/analytics/
    └── AnalyticsRedisService.java           [NEW]
```

#### AnalyticsRedisService.java:
```java
@Service
@RequiredArgsConstructor
public class AnalyticsRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    
    // === VIEW COUNTERS ===
    public void incrementViewCount(String productId) {
        String key = "analytics:view:" + productId;
        redisTemplate.opsForValue().increment(key);
        redisTemplate.expire(key, 7, TimeUnit.DAYS);
    }
    
    public Long getViewCount(String productId) {
        String key = "analytics:view:" + productId;
        Object value = redisTemplate.opsForValue().get(key);
        return value != null ? Long.parseLong(value.toString()) : 0L;
    }
    
    // === SEARCH COUNTERS ===
    public void incrementSearchCount(String keyword) {
        String key = "analytics:search:" + keyword.toLowerCase();
        redisTemplate.opsForValue().increment(key);
        // Thêm vào sorted set cho trending
        redisTemplate.opsForZSet().incrementScore("analytics:trending_search", keyword, 1);
    }
    
    // === RECENTLY VIEWED ===
    public void addRecentlyViewed(String userId, String productId) {
        String key = "analytics:recent:" + userId;
        redisTemplate.opsForList().leftPush(key, productId);
        redisTemplate.opsForList().trim(key, 0, 19); // Keep last 20
        redisTemplate.expire(key, 30, TimeUnit.DAYS);
    }
    
    public List<String> getRecentlyViewed(String userId, int limit) {
        String key = "analytics:recent:" + userId;
        return redisTemplate.opsForList().range(key, 0, limit - 1)
                .stream().map(Object::toString).toList();
    }
    
    // === TRENDING KEYWORDS ===
    public Set<String> getTrendingKeywords(int limit) {
        return redisTemplate.opsForZSet()
                .reverseRange("analytics:trending_search", 0, limit - 1)
                .stream().map(Object::toString).collect(Collectors.toSet());
    }
}
```

#### Redis Keys Pattern:
| Key | Type | TTL | Description |
|-----|------|-----|-------------|
| `analytics:view:{productId}` | String (counter) | 7 ngày | View count per product |
| `analytics:search:{keyword}` | String (counter) | 7 ngày | Search count per keyword |
| `analytics:recent:{userId}` | List | 30 ngày | Last 20 viewed products |
| `analytics:trending_search` | Sorted Set | ∞ | Top trending keywords |

---

### 📥 Step 1.4: Kafka Consumer (2 ngày)

#### File Cần Tạo:
```
stock-service/src/main/java/com/example/stockservice/
└── service/analytics/
    └── BehaviorKafkaConsumer.java           [NEW]
```

#### BehaviorKafkaConsumer.java:
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class BehaviorKafkaConsumer {
    private final BehaviorLogRepository behaviorLogRepository;
    private final ProductAnalyticsRepository productAnalyticsRepository;
    private final SearchAnalyticsRepository searchAnalyticsRepository;
    
    @KafkaListener(
        topics = "${kafka.topic.analytics}",
        groupId = "stock-service-analytics",
        containerFactory = "analyticsKafkaListenerContainerFactory"
    )
    public void consume(BehaviorEvent event) {
        try {
            // 1. Lưu behavior log
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
            
            // 2. Update aggregated analytics
            if (event.getProductId() != null) {
                updateProductAnalytics(event);
            }
            if (event.getKeyword() != null) {
                updateSearchAnalytics(event);
            }
            
        } catch (Exception e) {
            log.error("Error processing behavior event: {}", e.getMessage());
        }
    }
    
    private void updateProductAnalytics(BehaviorEvent event) {
        ProductAnalytics analytics = productAnalyticsRepository
                .findById(event.getProductId())
                .orElse(ProductAnalytics.builder()
                        .productId(event.getProductId())
                        .shopId(event.getShopId())
                        .build());
        
        switch (event.getEventType()) {
            case VIEW -> analytics.setViewCount(analytics.getViewCount() + 1);
            case ADD_CART -> analytics.setCartCount(analytics.getCartCount() + 1);
            case PURCHASE -> analytics.setPurchaseCount(analytics.getPurchaseCount() + 1);
        }
        analytics.setLastViewedAt(LocalDateTime.now());
        productAnalyticsRepository.save(analytics);
    }
}
```

---

### 🖥️ Step 1.5: Frontend Hooks (1 ngày)

#### Files Cần Tạo:
```
my-app/src/
├── api/
│   └── tracking.js                          [NEW]
└── hooks/
    └── useTrackBehavior.js                  [NEW]
```

#### tracking.js:
```javascript
import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/stock/analytics/track";
const api = createApiInstance(API_URL);

export const trackView = async (productId, source = 'direct', duration = 0) => {
    try {
        await api.post('/view', { productId, source, duration, sessionId: getSessionId() });
    } catch (e) {
        console.warn('Track view failed:', e);
    }
};

export const trackSearch = async (keyword, resultCount = 0) => {
    try {
        await api.post('/search', { keyword, resultCount, sessionId: getSessionId() });
    } catch (e) {
        console.warn('Track search failed:', e);
    }
};

export const trackCart = async (productId, quantity = 1) => {
    try {
        await api.post('/cart', { productId, quantity });
    } catch (e) {
        console.warn('Track cart failed:', e);
    }
};

const getSessionId = () => {
    let sessionId = sessionStorage.getItem('vibe_session');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('vibe_session', sessionId);
    }
    return sessionId;
};
```

#### useTrackBehavior.js:
```javascript
import { useEffect, useRef } from 'react';
import { trackView } from '../api/tracking';

export const useTrackProductView = (productId, source = 'direct') => {
    const startTime = useRef(Date.now());
    
    useEffect(() => {
        if (!productId) return;
        
        // Track khi rời trang
        return () => {
            const duration = Math.round((Date.now() - startTime.current) / 1000);
            trackView(productId, source, duration);
        };
    }, [productId, source]);
};
```

#### Tích hợp vào ProductDetail.jsx:
```jsx
import { useTrackProductView } from '../../hooks/useTrackBehavior';

function ProductDetail({ productId }) {
    // Track view khi user xem sản phẩm
    useTrackProductView(productId, 'product_detail');
    
    // ... rest of component
}
```

---

## 📊 Database Migrations

Đã có models, cần tạo tables trong MySQL:

```sql
-- behavior_logs table (từ BehaviorLog.java)
-- product_analytics table (từ ProductAnalytics.java)
-- search_analytics table (từ SearchAnalytics.java)

-- Spring JPA sẽ tự tạo nếu spring.jpa.hibernate.ddl-auto=update
```

---

## ⚙️ Config Cần Thêm

#### application.yml (stock-service):
```yaml
kafka:
  topic:
    analytics: analytics-topic
    product-updates: product-updates-topic
```

---

## ✅ Verification Checklist

| # | Test | Expected |
|---|------|----------|
| 1 | POST `/track/view` | Response 200 OK trong < 10ms |
| 2 | Check Redis | Key `analytics:view:{productId}` tăng |
| 3 | Check Kafka | Message xuất hiện trong `analytics-topic` |
| 4 | Check MySQL | Record mới trong `behavior_logs` |
| 5 | Check product_analytics | view_count tăng |

---

## 🗓️ Timeline

| Ngày | Task | Deliverable |
|------|------|-------------|
| Day 1 | Repositories + DTOs | 3 repos, 4 DTOs |
| Day 2 | TrackingController + Service | API endpoints working |
| Day 3 | Testing + Bug fixes | All endpoints tested |
| Day 4 | Kafka Producer + Topic | Events publishing |
| Day 5 | Redis Service | Counters working |
| Day 6-7 | Kafka Consumer | Events processed → MySQL |
| Day 8 | Frontend Hooks + Integration | Tracking từ React |

**Tổng: 8 ngày**
