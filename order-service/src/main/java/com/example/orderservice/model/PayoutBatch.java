package com.example.orderservice.model;

import com.example.orderservice.enums.PayoutStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payout_batch")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayoutBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "shop_owner_id", nullable = false)
    private String shopOwnerId; // FK to ShopOwner

    @Column(name = "amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal amount; // Số tiền rút

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    @Builder.Default
    private PayoutStatus status = PayoutStatus.PENDING; // PENDING, PROCESSING, COMPLETED, FAILED

    @Column(name = "bank_account_number", length = 50, nullable = false)
    private String bankAccountNumber; // Số tài khoản ngân hàng

    @Column(name = "bank_name", length = 100, nullable = false)
    private String bankName; // Tên ngân hàng

    @Column(name = "account_holder_name", length = 255, nullable = false)
    private String accountHolderName; // Tên chủ tài khoản

    @Column(name = "transaction_ref", length = 255, unique = true, nullable = false)
    private String transactionRef; // Transaction reference (unique)

    @Column(name = "processed_at")
    private LocalDateTime processedAt; // Thời gian xử lý

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason; // Lý do thất bại

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

