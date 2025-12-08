package com.example.orderservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipping_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingOrder extends BaseEntity {
    
    @Column(name = "order_id", unique = true, nullable = false)
    private String orderId;
    
    @Column(name = "ghn_order_code", unique = true, length = 50)
    private String ghnOrderCode;
    
    @Column(name = "shipping_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingFee;
    
    @Column(name = "cod_amount", precision = 10, scale = 2)
    private BigDecimal codAmount;
    
    @Column(name = "weight", nullable = false)
    private Integer weight; // Gram
    
    @Column(name = "status", length = 50)
    private String status;
    
    @Column(name = "expected_delivery_time")
    private LocalDateTime expectedDeliveryTime;
    
    @Column(name = "ghn_response", columnDefinition = "TEXT")
    private String ghnResponse;
}

