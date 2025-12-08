package com.example.orderservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GhnCalculateFeeResponse {
    
    @JsonProperty("code")
    private Integer code; // 200 = success
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private GhnFeeData data;
    
    @Data
    public static class GhnFeeData {
        
        @JsonProperty("total")
        private Long total; // Phí ship VNĐ
        
        @JsonProperty("service_fee")
        private Long serviceFee;
        
        @JsonProperty("insurance_fee")
        private Long insuranceFee;
        
        @JsonProperty("pick_station_fee")
        private Long pickStationFee;
        
        @JsonProperty("coupon_value")
        private Long couponValue;
    }
}

