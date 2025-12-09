package com.example.notificationservice.client;

import com.example.notificationservice.dto.ProductDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class StockServiceClient {
    
    private final RestTemplate restTemplate;
    
    @Value("${services.stock-service.url:http://localhost:8083}")
    private String stockServiceUrl;
    
    public ProductDto getProductById(String productId) {
        try {
            String url = stockServiceUrl + "/v1/product/" + productId;
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<ProductDto> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                ProductDto.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.error("Error fetching product {}: {}", productId, e.getMessage());
        }
        
        // Return default product if error
        return ProductDto.builder()
            .id(productId)
            .name("Product " + productId)
            .build();
    }
}

