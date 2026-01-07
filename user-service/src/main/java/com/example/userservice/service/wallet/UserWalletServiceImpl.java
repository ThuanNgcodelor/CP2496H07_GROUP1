package com.example.userservice.service.wallet;

import com.example.userservice.enums.WalletEntryType;
import com.example.userservice.exception.NotFoundException;
import com.example.userservice.model.UserWallet;
import com.example.userservice.model.UserWalletEntry;
import com.example.userservice.repository.UserWalletEntryRepository;
import com.example.userservice.repository.UserWalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserWalletServiceImpl implements UserWalletService {

        private final UserWalletRepository walletRepository;
        private final UserWalletEntryRepository entryRepository;
        private final com.example.userservice.client.PaymentServiceClient paymentServiceClient;

        @Override
        public org.springframework.data.domain.Page<UserWalletEntry> getEntries(String userId, int page, int size) {
                org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page,
                                size, org.springframework.data.domain.Sort.by("createdAt").descending());
                return entryRepository.findByUserId(userId, pageable);
        }

        @Override
        @Transactional
        public UserWallet getOrCreateWallet(String userId) {
                return walletRepository.findByUserId(userId)
                                .orElseGet(() -> {
                                        UserWallet wallet = UserWallet.builder()
                                                        .userId(userId)
                                                        .balanceAvailable(BigDecimal.ZERO)
                                                        .balancePending(BigDecimal.ZERO)
                                                        .totalDeposits(BigDecimal.ZERO)
                                                        .totalWithdrawals(BigDecimal.ZERO)
                                                        .totalRefunds(BigDecimal.ZERO)
                                                        .build();
                                        log.info("[WALLET] Created new wallet for user: {}", userId);
                                        return walletRepository.save(wallet);
                                });
        }

        @Override
        public UserWallet getWallet(String userId) {
                return walletRepository.findByUserId(userId)
                                .orElseThrow(() -> new NotFoundException("Wallet not found for user: " + userId));
        }

        @Override
        @Transactional
        public UserWallet addRefund(String userId, String orderId, String paymentId, BigDecimal amount, String reason) {
                // Create entry first to capture correct balanceBefore
                createEntry(userId, orderId, paymentId, WalletEntryType.REFUND, amount,
                                "Refund from cancelled order: " + orderId + ". Reason: "
                                                + (reason != null ? reason : "N/A"));

                UserWallet wallet = getOrCreateWallet(userId);

                BigDecimal balanceBefore = wallet.getBalanceAvailable();
                BigDecimal balanceAfter = balanceBefore.add(amount);

                // Update wallet
                wallet.setBalanceAvailable(balanceAfter);
                wallet.setTotalRefunds(wallet.getTotalRefunds().add(amount));
                wallet = walletRepository.save(wallet);

                log.info("[WALLET] Added refund to wallet: userId={}, amount={}, balanceBefore={}, balanceAfter={}",
                                userId, amount, balanceBefore, balanceAfter);

                return wallet;
        }

        @Override
        @Transactional
        @Override
        @Transactional
        public UserWallet withdraw(String userId, BigDecimal amount, String bankAccount, String bankName,
                        String accountHolder) {
                if (amount.compareTo(BigDecimal.valueOf(10000)) < 0) {
                        throw new RuntimeException("Minimum withdrawal amount is 10,000 VND");
                }

                UserWallet wallet = getWallet(userId);

                if (wallet.getBalanceAvailable().compareTo(amount) < 0) {
                        throw new RuntimeException(
                                        "Insufficient balance. Available: " + wallet.getBalanceAvailable()
                                                        + ", Requested: " + amount);
                }

                // Create entry first
                createEntry(userId, null, null, WalletEntryType.WITHDRAWAL, amount,
                                "Withdrawal to " + bankName + " - " + bankAccount);

                BigDecimal balanceBefore = wallet.getBalanceAvailable();
                BigDecimal balanceAfter = balanceBefore.subtract(amount);

                // Update wallet
                wallet.setBalanceAvailable(balanceAfter);
                wallet.setTotalWithdrawals(wallet.getTotalWithdrawals().add(amount));
                wallet = walletRepository.save(wallet);

                log.info("[WALLET] Withdrawal from wallet: userId={}, amount={}, balanceBefore={}, balanceAfter={}",
                                userId, amount, balanceBefore, balanceAfter);

                return wallet;
        }

        // ... existing methods ...

        @Override
        @Transactional
        public UserWallet depositDirect(String userId, BigDecimal amount) {
                if (amount.compareTo(BigDecimal.valueOf(10000)) < 0) {
                        throw new RuntimeException("Minimum deposit amount is 10,000 VND");
                }

                // Generate a unique orderId
                String orderId = "WALLET_DIRECT_" + userId + "_" + System.currentTimeMillis();

                // Credit Wallet directly
                createEntry(userId, orderId, null, WalletEntryType.DEPOSIT, amount,
                                "Direct Deposit (Manual)");

                UserWallet wallet = getOrCreateWallet(userId);
                wallet.setBalanceAvailable(wallet.getBalanceAvailable().add(amount));
                wallet.setTotalDeposits(wallet.getTotalDeposits().add(amount));

                log.info("[WALLET] Direct deposit successful: userId={}, amount={}, orderId={}", userId, amount,
                                orderId);

                return walletRepository.save(wallet);
        }

        @Override
        @Transactional
        public UserWalletEntry createEntry(String userId, String orderId, String paymentId, WalletEntryType entryType,
                        BigDecimal amount, String description) {
                UserWallet wallet = getOrCreateWallet(userId);

                BigDecimal balanceBefore = wallet.getBalanceAvailable();
                BigDecimal balanceAfter = balanceBefore;

                // Calculate balance after based on entry type
                if (entryType == WalletEntryType.REFUND || entryType == WalletEntryType.DEPOSIT) {
                        balanceAfter = balanceBefore.add(amount);
                } else if (entryType == WalletEntryType.WITHDRAWAL || entryType == WalletEntryType.ADJUST
                                || entryType == WalletEntryType.SUBSCRIPTION_FEE) {
                        balanceAfter = balanceBefore.subtract(amount);
                }

                String refTxn = entryType.name() + "_" + (orderId != null ? orderId : userId) + "_"
                                + System.currentTimeMillis();

                // Check if refTxn already exists
                if (entryRepository.existsByRefTxn(refTxn)) {
                        refTxn = refTxn + "_" + UUID.randomUUID().toString().substring(0, 8);
                }

                UserWalletEntry entry = UserWalletEntry.builder()
                                .userId(userId)
                                .orderId(orderId)
                                .paymentId(paymentId)
                                .entryType(entryType)
                                .amount(amount)
                                .balanceBefore(balanceBefore)
                                .balanceAfter(balanceAfter)
                                .refTxn(refTxn)
                                .description(description)
                                .build();

                return entryRepository.save(entry);
        }

        @Override
        @Transactional
        public UserWallet paySubscription(String userId, BigDecimal amount, String planName) {
                UserWallet wallet = getOrCreateWallet(userId); // Ensure wallet exists

                if (wallet.getBalanceAvailable().compareTo(amount) < 0) {
                        throw new RuntimeException("Insufficient balance to pay for subscription: " + planName);
                }

                // Create entry first
                createEntry(userId, null, null, WalletEntryType.SUBSCRIPTION_FEE, amount,
                                "Payment for subscription plan: " + planName);

                BigDecimal balanceBefore = wallet.getBalanceAvailable();
                BigDecimal balanceAfter = balanceBefore.subtract(amount);

                // Update wallet
                wallet.setBalanceAvailable(balanceAfter);
                wallet = walletRepository.save(wallet);

                log.info("[WALLET] Paid subscription: userId={}, amount={}, plan={}, balanceAfter={}",
                                userId, amount, planName, balanceAfter);

                return wallet;
        }

        @Override
        public String deposit(String userId, BigDecimal amount) {
                // Generate a unique orderId for this deposit transaction
                String orderId = "WALLET_DEPOSIT_" + userId + "_" + System.currentTimeMillis();

                // Create request for payment-service (VNPay)
                com.example.userservice.dto.CreateVnpayPaymentRequest request = com.example.userservice.dto.CreateVnpayPaymentRequest
                                .builder()
                                .amount(amount.longValue()) // VNPAY uses Long (VND)
                                .orderInfo("Nap tien vao vi")
                                .orderId(orderId)
                                .userId(userId)
                                .build();

                try {
                        org.springframework.http.ResponseEntity<com.example.userservice.dto.PaymentUrlResponse> response = paymentServiceClient
                                        .createVnpayPayment(request);
                        if (response.getBody() != null) {
                                return response.getBody().getPaymentUrl();
                        }
                        throw new RuntimeException("Empty response from payment service");
                } catch (Exception e) {
                        log.error("[WALLET] Failed to create deposit payment: {}", e.getMessage());
                        throw new RuntimeException("Failed to initiate deposit: " + e.getMessage());
                }
        }

        @Override
        @Transactional
        public UserWallet verifyDeposit(String userId, java.util.Map<String, String> params) {
                try {
                        // 1. Verify hash via payment-service
                        org.springframework.http.ResponseEntity<java.util.Map<String, String>> verifyResponse = paymentServiceClient
                                        .handleVnpayReturn(params);

                        // Check if payment-service verified it successfully (status=PAID or similar in
                        // response)
                        // Actually handleVnpayReturn returns a Map with status name
                        String statusObj = verifyResponse.getBody().get("status");
                        if (!"PAID".equals(statusObj)) {
                                throw new RuntimeException("Payment verification failed. Status: " + statusObj);
                        }

                        // 2. Extract orderId (txnRef) from params to cross-check
                        // VNPay param: vnp_TxnRef
                        String orderId = params.get("vnp_TxnRef");
                        if (orderId == null) {
                                throw new RuntimeException("Missing transaction reference");
                        }

                        // Verify it is a WALLET_DEPOSIT transaction
                        if (!orderId.startsWith("WALLET_DEPOSIT_")) {
                                // If it's a regular order payment, we shouldn't handle it here as a deposit
                                // But maybe the user just wants to see status?
                                // For now strict check.
                                throw new RuntimeException("Invalid transaction type for wallet deposit");
                        }

                        // 3. Check if we already processed this deposit
                        // The refTxn in user_wallet_entries will be "DEPOSIT_..." + orderId...
                        // But wait, createEntry generates refTxn = entryType + ...
                        // Let's check if an entry with this orderId already exists to be safe
                        boolean exists = entryRepository.existsByOrderIdAndEntryType(orderId, WalletEntryType.DEPOSIT);
                        if (exists) {
                                log.info("[WALLET] Deposit already processed for orderId: {}", orderId);
                                return getWallet(userId);
                        }

                        // 4. Get payment amount from Payment Service (to be secure, don't trust params
                        // only)
                        org.springframework.http.ResponseEntity<com.example.userservice.dto.PaymentDto> paymentRes = paymentServiceClient
                                        .getPaymentByOrderId(orderId);

                        if (paymentRes.getBody() == null) {
                                throw new RuntimeException("Could not fetch payment details for " + orderId);
                        }

                        BigDecimal amount = paymentRes.getBody().getAmount();

                        // 5. Credit Wallet
                        // Create Entry FIRST
                        createEntry(userId, orderId, paymentRes.getBody().getId(), WalletEntryType.DEPOSIT, amount,
                                        "Deposit via VNPay");

                        UserWallet wallet = getOrCreateWallet(userId);
                        wallet.setBalanceAvailable(wallet.getBalanceAvailable().add(amount));
                        wallet.setTotalDeposits(wallet.getTotalDeposits().add(amount));

                        log.info("[WALLET] Deposit successful: userId={}, amount={}, orderId={}", userId, amount,
                                        orderId);

                        return walletRepository.save(wallet);

                } catch (Exception e) {
                        log.error("[WALLET] Verify deposit failed: {}", e.getMessage());
                        throw new RuntimeException("Deposit verification failed: " + e.getMessage());
                }
        }

        @Override
        public String depositSimulated(String userId, BigDecimal amount) {
                // Generate a unique orderId for this simulated deposit
                String orderId = "WALLET_SIMULATED_" + userId + "_" + System.currentTimeMillis();

                // Return a clear, mock-style URL.
                return "/payment/mock-banking?orderId=" + orderId + "&amount=" + amount.toString();
        }

        @Override
        @Transactional
        public UserWallet verifySimulatedDeposit(String userId, String orderId, BigDecimal amount) {
                try {
                        // Verify orderId format
                        if (!orderId.startsWith("WALLET_SIMULATED_")) {
                                throw new RuntimeException("Invalid transaction type for simulated deposit");
                        }

                        // Check if already processed
                        boolean exists = entryRepository.existsByOrderIdAndEntryType(orderId, WalletEntryType.DEPOSIT);
                        if (exists) {
                                log.info("[WALLET] Simulated deposit already processed for orderId: {}", orderId);
                                return getWallet(userId);
                        }

                        // Credit Wallet
                        String mockPaymentId = "SIM-" + UUID.randomUUID().toString().substring(0, 8);

                        createEntry(userId, orderId, mockPaymentId, WalletEntryType.DEPOSIT, amount,
                                        "Simulated Deposit (Mock Banking)");

                        UserWallet wallet = getOrCreateWallet(userId);
                        wallet.setBalanceAvailable(wallet.getBalanceAvailable().add(amount));
                        wallet.setTotalDeposits(wallet.getTotalDeposits().add(amount));

                        log.info("[WALLET] Simulated deposit successful: userId={}, amount={}, orderId={}", userId,
                                        amount,
                                        orderId);

                        return walletRepository.save(wallet);

                } catch (Exception e) {
                        log.error("[WALLET] Verify simulated deposit failed: {}", e.getMessage());
                        throw new RuntimeException("Simulated deposit failed: " + e.getMessage());
                }
        }

        @Override
        @Transactional
        public UserWallet depositDirect(String userId, BigDecimal amount) {
                // Generate a unique orderId
                String orderId = "WALLET_DIRECT_" + userId + "_" + System.currentTimeMillis();

                // Credit Wallet directly
                createEntry(userId, orderId, null, WalletEntryType.DEPOSIT, amount,
                                "Direct Deposit (Manual)");

                UserWallet wallet = getOrCreateWallet(userId);
                wallet.setBalanceAvailable(wallet.getBalanceAvailable().add(amount));
                wallet.setTotalDeposits(wallet.getTotalDeposits().add(amount));

                log.info("[WALLET] Direct deposit successful: userId={}, amount={}, orderId={}", userId, amount,
                                orderId);

                return walletRepository.save(wallet);
        }
}