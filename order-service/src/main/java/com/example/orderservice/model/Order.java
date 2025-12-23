package com.example.orderservice.model;

import com.example.orderservice.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    private String userId;
    private String addressId;

    // Tổng tiền CUỐI CÙNG user phải trả
    private double totalPrice;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee; // Phí ship

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", length = 50)
    private OrderStatus orderStatus;

    @Column(name = "payment_method", length = 20)
    private String paymentMethod; // COD, VNPAY, CARD

    private String cancelReason;
    private String returnReason;

    // Voucher fields
    @Column(name = "voucher_id")
    private String voucherId;

    @Column(name = "voucher_discount", precision = 15, scale = 2)
    private BigDecimal voucherDiscount;

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();
}
