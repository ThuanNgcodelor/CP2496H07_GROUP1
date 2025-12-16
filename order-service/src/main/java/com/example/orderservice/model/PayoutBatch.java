package com.example.orderservice.model;

import com.example.orderservice.enums.PayoutStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payout_batch")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayoutBatch extends BaseEntity {

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
}

