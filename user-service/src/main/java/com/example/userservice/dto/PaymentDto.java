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
public class PaymentDto {
    private String id;
    private String orderId;
    private String txnRef;
    private BigDecimal amount;
    private String currency;
    private String method; // VNPAY, MOMO, COD
    private String status; // PENDING, PAID, FAILED, REFUNDED
    private String paymentUrl;
    private String returnUrl;
}
