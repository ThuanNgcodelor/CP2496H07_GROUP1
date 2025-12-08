package com.example.orderservice.repository;

import com.example.orderservice.model.ShippingOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShippingOrderRepository extends JpaRepository<ShippingOrder, String> {
    Optional<ShippingOrder> findByOrderId(String orderId);
    Optional<ShippingOrder> findByGhnOrderCode(String ghnOrderCode);
}

