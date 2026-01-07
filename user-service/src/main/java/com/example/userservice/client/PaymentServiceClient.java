package com.example.userservice.client;

import com.example.userservice.config.FeignConfig;
import com.example.userservice.dto.CreateVnpayPaymentRequest;
import com.example.userservice.dto.PaymentDto;
import com.example.userservice.dto.PaymentUrlResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "payment-service", path = "/v1/payment", configuration = FeignConfig.class)
public interface PaymentServiceClient {

    @PostMapping("/vnpay/create")
    ResponseEntity<PaymentUrlResponse> createVnpayPayment(@RequestBody CreateVnpayPaymentRequest request);

    @GetMapping("/vnpay/return")
    ResponseEntity<Map<String, String>> handleVnpayReturn(@RequestParam Map<String, String> params);

    @GetMapping("/by-order/{orderId}")
    ResponseEntity<PaymentDto> getPaymentByOrderId(@PathVariable("orderId") String orderId);
}
