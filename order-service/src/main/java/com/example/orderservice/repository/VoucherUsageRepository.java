package com.example.orderservice.repository;

import com.example.orderservice.enums.VoucherType;
import com.example.orderservice.model.VoucherUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, String> {
    boolean existsByVoucherIdAndOrderId(String voucherId, String orderId);
    
    boolean existsByVoucherIdAndUserId(String voucherId, String userId);
    
    long countByVoucherIdAndVoucherType(String voucherId, VoucherType voucherType);
    
    List<VoucherUsage> findByOrderId(String orderId);
    
    Optional<VoucherUsage> findByVoucherIdAndOrderId(String voucherId, String orderId);
}

