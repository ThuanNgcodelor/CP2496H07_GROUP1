package com.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddRefundRequest {
    private String userId; // For internal calls
    private String orderId;
    private String paymentId;
    private BigDecimal amount;
    private String reason;
}

