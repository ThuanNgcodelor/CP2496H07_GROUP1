package com.example.paymentservice.controller;



import com.example.paymentservice.dto.CreateVnpayPaymentRequest;
import com.example.paymentservice.dto.PaymentUrlResponse;
import com.example.paymentservice.enums.PaymentStatus;
import com.example.paymentservice.model.Payment;
import com.example.paymentservice.repository.PaymentRepository;
import com.example.paymentservice.service.VnpayPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VnpayPaymentService vnpayPaymentService;
    private final PaymentRepository paymentRepository;

    @PostMapping("/vnpay/create")
    public ResponseEntity<PaymentUrlResponse> createPayment(@Valid @RequestBody CreateVnpayPaymentRequest req,
                                                            HttpServletRequest servletRequest) {
        PaymentUrlResponse response = vnpayPaymentService.createPayment(req, servletRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<?> handleReturn(HttpServletRequest request) {
        PaymentStatus status = vnpayPaymentService.handleReturn(request.getParameterMap());
        Map<String, String> response = new HashMap<>();
        response.put("status", status.name());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable String orderId) {
        Optional<Payment> payment = paymentRepository.findByOrderId(orderId);
        if (payment.isPresent()) {
            return ResponseEntity.ok(payment.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update-order-id/{paymentId}")
    public ResponseEntity<Map<String, Object>> updatePaymentOrderId(
            @PathVariable String paymentId,
            @RequestParam String orderId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Payment not found");
            return ResponseEntity.notFound().build();
        }
        
        Payment payment = paymentOpt.get();
        payment.setOrderId(orderId);
        paymentRepository.save(payment);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment orderId updated successfully");
        return ResponseEntity.ok(response);
    }
}