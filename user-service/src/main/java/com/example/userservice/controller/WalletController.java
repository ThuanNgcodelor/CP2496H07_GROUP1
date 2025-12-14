package com.example.userservice.controller;

import com.example.userservice.dto.AddRefundRequest;
import com.example.userservice.jwt.JwtUtil;
import com.example.userservice.model.UserWallet;
import com.example.userservice.model.UserWalletEntry;
import com.example.userservice.service.wallet.UserWalletService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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
                request.getReason()
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("walletId", wallet.getId());
        response.put("balanceAvailable", wallet.getBalanceAvailable());
        response.put("message", "Refund added to wallet successfully");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/entries")
    public ResponseEntity<List<UserWalletEntry>> getWalletEntries(HttpServletRequest request) {
        // TODO: Implement get entries
        return ResponseEntity.ok(List.of());
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
                    request.getReason()
            );
            
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

