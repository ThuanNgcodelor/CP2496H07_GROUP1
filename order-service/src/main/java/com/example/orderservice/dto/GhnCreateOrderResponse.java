package com.example.orderservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GhnCreateOrderResponse {
    
    @JsonProperty("code")
    private Integer code; // 200 = success
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private GhnOrderData data;
    
    @Data
    public static class GhnOrderData {
        
        @JsonProperty("order_code")
        private String orderCode; // Mã vận đơn GHN
        
        @JsonProperty("total_fee")
        private Long totalFee; // Phí ship
        
        @JsonProperty("expected_delivery_time")
        private String expectedDeliveryTime; // ISO datetime string
    }
}

