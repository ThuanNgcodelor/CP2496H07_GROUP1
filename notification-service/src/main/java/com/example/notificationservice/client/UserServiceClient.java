package com.example.notificationservice.client;

import com.example.notificationservice.dto.UserDto;
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
public class UserServiceClient {
    
    private final RestTemplate restTemplate;
    
    @Value("${services.user-service.url:http://localhost:8082}")
    private String userServiceUrl;
    
    public UserDto getUserById(String userId) {
        try {
            String url = userServiceUrl + "/v1/user/" + userId;
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<UserDto> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                UserDto.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.error("Error fetching user {}: {}", userId, e.getMessage());
        }
        
        // Return default user if error
        return UserDto.builder()
            .id(userId)
            .username("User " + userId)
            .email("")
            .build();
    }
}

