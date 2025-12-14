package com.example.userservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_wallets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "user_id", unique = true, nullable = false)
    private String userId; // FK to User

    @Column(name = "balance_available", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal balanceAvailable = BigDecimal.ZERO; // Số dư có thể rút

    @Column(name = "balance_pending", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal balancePending = BigDecimal.ZERO; // Số dư đang chờ (refund đang xử lý)

    @Column(name = "total_deposits", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalDeposits = BigDecimal.ZERO; // Tổng đã nạp

    @Column(name = "total_withdrawals", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalWithdrawals = BigDecimal.ZERO; // Tổng đã rút

    @Column(name = "total_refunds", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalRefunds = BigDecimal.ZERO; // Tổng đã được refund

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

