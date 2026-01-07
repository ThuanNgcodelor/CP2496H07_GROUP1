package com.example.userservice.controller;

import com.example.userservice.dto.AddRefundRequest;
import com.example.userservice.jwt.JwtUtil;
import com.example.userservice.model.UserWallet;
import com.example.userservice.model.UserWallet;
import com.example.userservice.model.UserWalletEntry;
import com.example.userservice.dto.AddDepositRequest;
import com.example.userservice.dto.WithdrawRequest;
import com.example.userservice.service.wallet.UserWalletService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import java.util.Map;

@RestController
@RequestMapping("/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final UserWalletService walletService;
    private final JwtUtil jwtUtil;

    @GetMapping("/balance")
    public ResponseEntity<Map<String, Object>> getWalletBalance(HttpServletRequest request) {
        String userId = getUserIdFromRequest(request);
        UserWallet wallet = walletService.getOrCreateWallet(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("balanceAvailable", wallet.getBalanceAvailable());
        response.put("balancePending", wallet.getBalancePending());
        response.put("totalDeposits", wallet.getTotalDeposits());
        response.put("totalWithdrawals", wallet.getTotalWithdrawals());
        response.put("totalRefunds", wallet.getTotalRefunds());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refund")
    public ResponseEntity<Map<String, Object>> addRefund(
            @RequestBody AddRefundRequest request,
            HttpServletRequest httpRequest) {
        String userId = getUserIdFromRequest(httpRequest);

        UserWallet wallet = walletService.addRefund(
                userId,
                request.getOrderId(),
                request.getPaymentId(),
                request.getAmount(),
                request.getReason());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("walletId", wallet.getId());
        response.put("balanceAvailable", wallet.getBalanceAvailable());
        response.put("message", "Refund added to wallet successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/entries")
    public ResponseEntity<org.springframework.data.domain.Page<UserWalletEntry>> getWalletEntries(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = getUserIdFromRequest(request);
        return ResponseEntity.ok(walletService.getEntries(userId, page, size));
    }

    // Internal API for order-service
    @PostMapping("/internal/refund")
    public ResponseEntity<Map<String, Object>> addRefundInternal(@RequestBody AddRefundRequest request) {
        // Validate userId is provided
        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "UserId is required");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {
            UserWallet wallet = walletService.addRefund(
                    request.getUserId(),
                    request.getOrderId(),
                    request.getPaymentId(),
                    request.getAmount(),
                    request.getReason());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("walletId", wallet.getId());
            response.put("balanceAvailable", wallet.getBalanceAvailable());
            response.put("message", "Refund added to wallet successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to add refund: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<Map<String, Object>> deposit(@RequestBody AddDepositRequest request,
            HttpServletRequest httpRequest) {
        String userId = getUserIdFromRequest(httpRequest);
        String paymentUrl = walletService.deposit(userId, request.getAmount());

        Map<String, Object> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit/verify")
    public ResponseEntity<Map<String, Object>> verifyDeposit(@RequestBody Map<String, String> params,
            HttpServletRequest httpRequest) {
        String userId = getUserIdFromRequest(httpRequest);
        UserWallet wallet = walletService.verifyDeposit(userId, params);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("balanceAvailable", wallet.getBalanceAvailable());
        response.put("message", "Deposit successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, Object>> withdraw(@RequestBody WithdrawRequest request,
            HttpServletRequest httpRequest) {
        String userId = getUserIdFromRequest(httpRequest);
        UserWallet wallet = walletService.withdraw(
                userId,
                request.getAmount(),
                request.getBankAccount(),
                request.getBankName(),
                request.getAccountHolder());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("balanceAvailable", wallet.getBalanceAvailable());
        response.put("message", "Withdrawal successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit/simulated")
    public ResponseEntity<Map<String, Object>> depositSimulated(@RequestBody AddDepositRequest request,
            HttpServletRequest httpRequest) {
        String userId = getUserIdFromRequest(httpRequest);
        String paymentUrl = walletService.depositSimulated(userId, request.getAmount());

        Map<String, Object> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit/simulated/verify")
    public ResponseEntity<Map<String, Object>> verifySimulatedDeposit(@RequestBody Map<String, Object> params,
            HttpServletRequest httpRequest) {
        String userId = getUserIdFromRequest(httpRequest);
        String orderId = (String) params.get("orderId");

        // Handle amount which might be Integer or Double from JSON
        java.math.BigDecimal amount;
        Object amountObj = params.get("amount");
        if (amountObj instanceof Integer) {
            amount = java.math.BigDecimal.valueOf((Integer) amountObj);
        } else if (amountObj instanceof Double) {
            amount = java.math.BigDecimal.valueOf((Double) amountObj);
        } else if (amountObj instanceof String) {
            amount = new java.math.BigDecimal((String) amountObj);
        } else {
            amount = new java.math.BigDecimal(amountObj.toString());
        }

        UserWallet wallet = walletService.verifySimulatedDeposit(userId, orderId, amount);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("balanceAvailable", wallet.getBalanceAvailable());
        response.put("message", "Simulated deposit successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit/direct")
    public ResponseEntity<Map<String, Object>> depositDirect(@RequestBody AddDepositRequest request,
            HttpServletRequest httpRequest) {
        String userId = getUserIdFromRequest(httpRequest);
        UserWallet wallet = walletService.depositDirect(userId, request.getAmount());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("balanceAvailable", wallet.getBalanceAvailable());
        response.put("message", "Direct deposit successful");
        return ResponseEntity.ok(response);
    }

    private String getUserIdFromRequest(HttpServletRequest request) {
        // Check if internal call (from order-service)
        if ("true".equals(request.getHeader("X-Internal-Call"))) {
            // For internal calls, userId should be in request body or header
            return request.getHeader("X-User-Id");
        }
        // Extract from JWT token for external calls
        return jwtUtil.ExtractUserId(request);
    }
}
