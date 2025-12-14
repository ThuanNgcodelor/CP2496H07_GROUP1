package com.example.userservice.repository;

import com.example.userservice.enums.WalletEntryType;
import com.example.userservice.model.UserWalletEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserWalletEntryRepository extends JpaRepository<UserWalletEntry, String> {
    List<UserWalletEntry> findByUserIdOrderByCreatedAtDesc(String userId);
    List<UserWalletEntry> findByUserIdAndEntryTypeOrderByCreatedAtDesc(String userId, WalletEntryType entryType);
    List<UserWalletEntry> findByOrderId(String orderId);
    boolean existsByRefTxn(String refTxn);
}

