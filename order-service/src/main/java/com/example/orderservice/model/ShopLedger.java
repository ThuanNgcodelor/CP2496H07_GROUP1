package com.example.orderservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shop_ledger")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

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

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

