package com.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVnpayPaymentRequest {
    private long amount;
    private String orderInfo;
    private String orderId; // Ref wallet transaction
    private String returnUrl;
    // Optional fields mimicking payment-service DTO
    private String bankCode;
    private String locale;
    private String ipAddr;
    private String userId;
    private String addressId;
    private String orderDataJson;
}
