package com.example.orderservice.repository;

import com.example.orderservice.enums.VoucherStatus;
import com.example.orderservice.model.ShopVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopVoucherRepository extends JpaRepository<ShopVoucher, String> {
    Optional<ShopVoucher> findByCodeAndShopOwnerId(String code, String shopOwnerId);
    
    Optional<ShopVoucher> findByCodeAndStatus(String code, VoucherStatus status);
    
    List<ShopVoucher> findByShopOwnerIdAndStatus(String shopOwnerId, VoucherStatus status);
    
    List<ShopVoucher> findByShopOwnerId(String shopOwnerId);
    
    boolean existsByCodeAndShopOwnerId(String code, String shopOwnerId);
    boolean existsByShopOwnerIdAndCode(String shopOwnerId, String code);
}

