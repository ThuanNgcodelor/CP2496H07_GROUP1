package com.example.orderservice.repository;

import com.example.orderservice.model.ShopLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopLedgerRepository extends JpaRepository<ShopLedger, String> {
    Optional<ShopLedger> findByShopOwnerId(String shopOwnerId);
    boolean existsByShopOwnerId(String shopOwnerId);
}

