package com.example.userservice.model;

import com.example.userservice.enums.WalletEntryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_wallet_entries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserWalletEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId; // FK to User

    @Column(name = "order_id")
    private String orderId; // FK to Order (nếu liên quan đến order)

    @Column(name = "payment_id")
    private String paymentId; // FK to Payment (nếu liên quan đến payment)

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", length = 50, nullable = false)
    private WalletEntryType entryType; // REFUND, WITHDRAWAL, DEPOSIT, ADJUST

    @Column(name = "amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal amount; // Số tiền

    @Column(name = "balance_before", precision = 15, scale = 2, nullable = false)
    private BigDecimal balanceBefore; // Số dư trước

    @Column(name = "balance_after", precision = 15, scale = 2, nullable = false)
    private BigDecimal balanceAfter; // Số dư sau

    @Column(name = "ref_txn", length = 255, unique = true, nullable = false)
    private String refTxn; // Transaction reference (orderId + userId hoặc unique ID)

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // Mô tả

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

