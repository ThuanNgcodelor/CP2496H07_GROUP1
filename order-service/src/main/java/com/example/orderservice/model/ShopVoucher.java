package com.example.orderservice.model;

import com.example.orderservice.enums.DiscountType;
import com.example.orderservice.enums.VoucherScope;
import com.example.orderservice.enums.VoucherStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "shop_vouchers",
        uniqueConstraints = @UniqueConstraint(name = "uk_shop_code", columnNames = {"shop_owner_id", "code"})
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ShopVoucher extends BaseEntity {

    @Column(name = "shop_owner_id", nullable = false)
    private String shopOwnerId;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", precision = 15, scale = 2, nullable = false)
    private BigDecimal discountValue;

    @Column(name = "max_discount_amount", precision = 15, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "min_order_value", precision = 15, scale = 2)
    private BigDecimal minOrderValue;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    @Column(name = "quantity_total")
    @Builder.Default
    private Integer quantityTotal = 0;

    @Column(name = "quantity_used")
    @Builder.Default
    private Integer quantityUsed = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private VoucherStatus status = VoucherStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "applicable_scope", nullable = false)
    @Builder.Default
    private VoucherScope applicableScope = VoucherScope.ALL_PRODUCTS;
}

