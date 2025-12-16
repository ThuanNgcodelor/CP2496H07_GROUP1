package com.example.orderservice.model;

import com.example.orderservice.enums.LedgerEntryType;
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

@Entity
@Table(name = "shop_ledger_entry")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ShopLedgerEntry extends BaseEntity {

    @Column(name = "shop_owner_id", nullable = false)
    private String shopOwnerId; // FK to ShopOwner

    @Column(name = "order_id")
    private String orderId; // FK to Order

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", length = 50, nullable = false)
    private LedgerEntryType entryType; // EARNING, PAYOUT, ADJUST, FEE_DEDUCTION

    @Column(name = "amount_gross", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal amountGross = BigDecimal.ZERO; // Tổng tiền order

    @Column(name = "commission_payment", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal commissionPayment = BigDecimal.ZERO; // Phí thanh toán (4%)

    @Column(name = "commission_fixed", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal commissionFixed = BigDecimal.ZERO; // Phí cố định (4%)

    @Column(name = "commission_freeship", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal commissionFreeship = BigDecimal.ZERO; // Phí Freeship Xtra (8%)

    @Column(name = "commission_voucher", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal commissionVoucher = BigDecimal.ZERO; // Phí Voucher Xtra (5%)

    @Column(name = "commission_total", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal commissionTotal = BigDecimal.ZERO; // Tổng commission

    @Column(name = "amount_net", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal amountNet = BigDecimal.ZERO; // Tiền shop nhận (gross - commission)

    @Column(name = "shipping_fee", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO; // Phí ship phải trả

    @Column(name = "other_fees", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal otherFees = BigDecimal.ZERO; // Các phí khác

    @Column(name = "balance_before", precision = 15, scale = 2, nullable = false)
    private BigDecimal balanceBefore; // Số dư trước

    @Column(name = "balance_after", precision = 15, scale = 2, nullable = false)
    private BigDecimal balanceAfter; // Số dư sau

    @Column(name = "ref_txn", length = 255, unique = true, nullable = false)
    private String refTxn; // Transaction reference (orderId + shopOwnerId)

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // Mô tả
}

