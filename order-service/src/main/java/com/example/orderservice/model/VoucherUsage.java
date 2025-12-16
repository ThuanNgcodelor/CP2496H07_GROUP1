package com.example.orderservice.model;

import com.example.orderservice.enums.VoucherType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "voucher_usage",
        uniqueConstraints = @UniqueConstraint(name = "uk_voucher_order", columnNames = {"voucher_id", "voucher_type", "order_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class VoucherUsage extends BaseEntity {

    @Column(name = "voucher_id", nullable = false)
    private String voucherId;

    @Enumerated(EnumType.STRING)
    @Column(name = "voucher_type", nullable = false)
    private VoucherType voucherType;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "amount_discount", precision = 15, scale = 2, nullable = false)
    private BigDecimal amountDiscount;
}

