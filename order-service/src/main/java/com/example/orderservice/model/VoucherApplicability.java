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

@Entity
@Table(
        name = "voucher_applicability",
        uniqueConstraints = @UniqueConstraint(name = "uk_scope", columnNames = {"voucher_id", "voucher_type", "product_id", "category_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class VoucherApplicability extends BaseEntity {

    @Column(name = "voucher_id", nullable = false)
    private String voucherId;

    @Enumerated(EnumType.STRING)
    @Column(name = "voucher_type", nullable = false)
    private VoucherType voucherType;

    @Column(name = "product_id")
    private String productId;

    @Column(name = "category_id")
    private String categoryId;
}

