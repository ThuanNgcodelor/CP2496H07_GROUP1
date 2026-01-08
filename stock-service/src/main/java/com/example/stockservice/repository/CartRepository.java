package com.example.stockservice.repository;

import com.example.stockservice.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByIdAndUserId(String id, String userId);
    Optional<Cart> findByUserId(String userId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT c FROM carts c WHERE c.userId = :userId")
    Optional<Cart> findByUserIdWithLock(@org.springframework.data.repository.query.Param("userId") String userId);
}
