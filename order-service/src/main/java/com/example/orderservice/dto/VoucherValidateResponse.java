package com.example.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherValidateResponse {
    private boolean valid;
    private String voucherId;
    private String code;
    private String title;
    private BigDecimal discount;
    private String message;
}

