package com.example.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private String id;
    private String orderId;
    private String txnRef;
    private BigDecimal amount;
    private String currency;
    private String method;
    private String status;
    private String bankCode;
    private String cardType;
    private String gatewayTxnNo;
    private String responseCode;
    private Instant createdAt;
    private Instant updatedAt;
}

