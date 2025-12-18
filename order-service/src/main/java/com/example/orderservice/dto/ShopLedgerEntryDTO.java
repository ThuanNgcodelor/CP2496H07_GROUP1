package com.example.orderservice.dto;

import com.example.orderservice.enums.LedgerEntryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopLedgerEntryDTO {
    private String id;
    private String orderId;
    private LedgerEntryType entryType;
    private BigDecimal amountGross;
    private BigDecimal commissionTotal;
    private BigDecimal amountNet;
    private BigDecimal shippingFee; // Phí ship
    private BigDecimal balanceAfter;
    private String description;
    private LocalDateTime createdAt;
}
