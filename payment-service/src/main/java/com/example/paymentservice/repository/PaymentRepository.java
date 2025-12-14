package com.example.paymentservice.repository;

import com.example.paymentservice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByTxnRef(String txnRef);
    Optional<Payment> findByOrderId(String orderId);
    List<Payment> findByOrderIdOrderByCreatedAtDesc(String orderId);
}