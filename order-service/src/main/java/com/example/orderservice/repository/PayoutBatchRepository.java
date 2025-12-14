package com.example.orderservice.repository;

import com.example.orderservice.enums.PayoutStatus;
import com.example.orderservice.model.PayoutBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayoutBatchRepository extends JpaRepository<PayoutBatch, String> {
    List<PayoutBatch> findByShopOwnerIdOrderByCreatedAtDesc(String shopOwnerId);
    List<PayoutBatch> findByStatus(PayoutStatus status);
    boolean existsByTransactionRef(String transactionRef);
}

