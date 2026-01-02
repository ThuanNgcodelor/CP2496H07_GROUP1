package com.example.stockservice.service.analytic;

import com.example.stockservice.dto.analytics.BehaviorEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * ===== PHASE 1: KAFKA PRODUCER =====
 * 
 * Service gửi behavior events đến Kafka một cách ASYNC (bất đồng bộ)
 * Events được gửi đến topic: analytics-topic
 * 
 * TẠI SAO DÙNG KAFKA?
 * - Không block user request (gửi async, response trong 5ms)
 * - High throughput: xử lý hàng ngàn events/giây
 * - Đảm bảo thứ tự events theo productId (partition key)
 * - Retry tự động nếu gửi thất bại
 * 
 * LUỒNG:
 * TrackingService → BehaviorKafkaProducer → Kafka → BehaviorKafkaConsumer → MySQL
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BehaviorKafkaProducer {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Value("${kafka.topic.analytics:analytics-topic}")
    private String analyticsTopic;
    
    /**
     * Gửi behavior event đến Kafka (ASYNC - không chờ đợi)
     * 
     * Hoạt động:
     * 1. Xác định partition key = productId (hoặc sessionId nếu không có productId)
     * 2. Gửi message đến Kafka topic
     * 3. Log kết quả khi hoàn thành (callback)
     * 
     * Dùng @Async để chạy trên thread pool riêng, không block request
     * 
     * @param event Event hành vi cần gửi
     */
    @Async
    public void sendEvent(BehaviorEventDto event) {
        try {
            // Key = productId để đảm bảo events của cùng 1 product vào cùng partition
            // → Giữ thứ tự sự kiện cho mỗi sản phẩm
            String key = event.getProductId() != null ? event.getProductId() : event.getSessionId();
            
            CompletableFuture<SendResult<String, Object>> future = 
                    kafkaTemplate.send(analyticsTopic, key, event);
            
            // Callback khi gửi xong (thành công hoặc thất bại)
            future.whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Gửi behavior event thất bại: {}", ex.getMessage());
                } else {
                    log.debug("Đã gửi behavior event: type={}, productId={}, partition={}", 
                            event.getEventType(), 
                            event.getProductId(),
                            result.getRecordMetadata().partition());
                }
            });
        } catch (Exception e) {
            log.error("Lỗi gửi behavior event đến Kafka: {}", e.getMessage());
        }
    }
    
    /**
     * Gửi event ĐỒNG BỘ (blocking) - dùng cho events quan trọng
     * 
     * Ví dụ: events cần đảm bảo gửi thành công trước khi response
     * 
     * @param event Event hành vi cần gửi
     * @return true nếu gửi thành công, false nếu thất bại
     */
    public boolean sendEventSync(BehaviorEventDto event) {
        try {
            String key = event.getProductId() != null ? event.getProductId() : event.getSessionId();
            kafkaTemplate.send(analyticsTopic, key, event).get(); // .get() = blocking wait
            log.debug("Đã gửi behavior event đồng bộ: type={}", event.getEventType());
            return true;
        } catch (Exception e) {
            log.error("Gửi behavior event đồng bộ thất bại: {}", e.getMessage());
            return false;
        }
    }
}
