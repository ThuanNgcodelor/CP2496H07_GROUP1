package com.example.orderservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "shop_ledger")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ShopLedger extends BaseEntity {

    @Column(name = "shop_owner_id", unique = true, nullable = false)
    private String shopOwnerId; // FK to ShopOwner

    @Column(name = "balance_available", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal balanceAvailable = BigDecimal.ZERO; // Số dư có thể rút

    @Column(name = "balance_pending", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal balancePending = BigDecimal.ZERO; // Số dư đang chờ (order chưa COMPLETED)

    @Column(name = "total_earnings", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalEarnings = BigDecimal.ZERO; // Tổng doanh thu

    @Column(name = "total_commission", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalCommission = BigDecimal.ZERO; // Tổng phí đã trừ

    @Column(name = "total_payouts", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalPayouts = BigDecimal.ZERO; // Tổng đã rút
}

