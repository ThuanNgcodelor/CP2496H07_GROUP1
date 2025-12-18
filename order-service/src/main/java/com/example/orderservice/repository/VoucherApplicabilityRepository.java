package com.example.orderservice.repository;

import com.example.orderservice.model.VoucherApplicability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoucherApplicabilityRepository extends JpaRepository<VoucherApplicability, String> {
}
