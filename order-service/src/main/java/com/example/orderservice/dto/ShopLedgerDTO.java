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
public class ShopLedgerDTO {
    private String shopOwnerId;
    private BigDecimal balanceAvailable;
    private BigDecimal balancePending;
    private BigDecimal totalEarnings;
    private BigDecimal totalCommission;
    private BigDecimal totalPayouts;
}
