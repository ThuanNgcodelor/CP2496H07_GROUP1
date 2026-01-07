package com.example.userservice.service.wallet;

import com.example.userservice.enums.WalletEntryType;
import com.example.userservice.model.UserWallet;
import com.example.userservice.model.UserWalletEntry;

import java.math.BigDecimal;

public interface UserWalletService {
    UserWallet getOrCreateWallet(String userId);

    UserWallet getWallet(String userId);

    UserWallet addRefund(String userId, String orderId, String paymentId, BigDecimal amount, String reason);

    UserWallet withdraw(String userId, BigDecimal amount, String bankAccount, String bankName, String accountHolder);

    UserWallet paySubscription(String userId, BigDecimal amount, String planName);

    UserWalletEntry createEntry(String userId, String orderId, String paymentId, WalletEntryType entryType,
            BigDecimal amount, String description);

    org.springframework.data.domain.Page<UserWalletEntry> getEntries(String userId, int page, int size);

    // Deposit features
    String deposit(String userId, BigDecimal amount);

    UserWallet verifyDeposit(String userId, java.util.Map<String, String> params);

    // Simulated Deposit
    String depositSimulated(String userId, BigDecimal amount);

    UserWallet verifySimulatedDeposit(String userId, String orderId, BigDecimal amount);

    // Direct Deposit (Simple)
    UserWallet depositDirect(String userId, BigDecimal amount);
}
