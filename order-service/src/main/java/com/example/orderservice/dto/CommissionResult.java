package com.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CommissionResult {
    private BigDecimal grossAmount;
    private BigDecimal commissionPayment;
    private BigDecimal commissionFixed;
    private BigDecimal commissionFreeship;
    private BigDecimal commissionVoucher;
    private BigDecimal totalCommission;
    private BigDecimal netAmount;
    private BigDecimal shippingFee; // Phí ship shop phải trả (nếu không có gói Freeship)
    private BigDecimal finalBalance;
}
