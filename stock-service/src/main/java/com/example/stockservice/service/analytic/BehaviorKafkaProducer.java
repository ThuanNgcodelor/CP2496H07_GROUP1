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
 * Kafka producer service for publishing behavior events asynchronously
 * Events are sent to analytics-topic for processing by consumers
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BehaviorKafkaProducer {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Value("${kafka.topic.analytics:analytics-topic}")
    private String analyticsTopic;
    
    /**
     * Send behavior event to Kafka asynchronously
     * Uses productId as partition key for ordering guarantee per product
     * 
     * @param event The behavior event to send
     */
    @Async
    public void sendEvent(BehaviorEventDto event) {
        try {
            String key = event.getProductId() != null ? event.getProductId() : event.getSessionId();
            
            CompletableFuture<SendResult<String, Object>> future = 
                    kafkaTemplate.send(analyticsTopic, key, event);
            
            future.whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to send behavior event: {}", ex.getMessage());
                } else {
                    log.debug("Sent behavior event: type={}, productId={}, partition={}", 
                            event.getEventType(), 
                            event.getProductId(),
                            result.getRecordMetadata().partition());
                }
            });
        } catch (Exception e) {
            log.error("Error sending behavior event to Kafka: {}", e.getMessage());
        }
    }
    
    /**
     * Send event synchronously (blocking) - use for critical events
     * 
     * @param event The behavior event to send
     * @return true if sent successfully, false otherwise
     */
    public boolean sendEventSync(BehaviorEventDto event) {
        try {
            String key = event.getProductId() != null ? event.getProductId() : event.getSessionId();
            kafkaTemplate.send(analyticsTopic, key, event).get();
            log.debug("Sent behavior event synchronously: type={}", event.getEventType());
            return true;
        } catch (Exception e) {
            log.error("Failed to send behavior event synchronously: {}", e.getMessage());
            return false;
        }
    }
}
