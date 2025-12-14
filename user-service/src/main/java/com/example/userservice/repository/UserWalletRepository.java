package com.example.userservice.repository;

import com.example.userservice.model.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserWalletRepository extends JpaRepository<UserWallet, String> {
    Optional<UserWallet> findByUserId(String userId);
    boolean existsByUserId(String userId);
}

