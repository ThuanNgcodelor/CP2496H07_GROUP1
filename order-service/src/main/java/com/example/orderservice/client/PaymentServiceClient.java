package com.example.orderservice.client;

import com.example.orderservice.config.FeignConfig;
import com.example.orderservice.dto.PaymentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "payment-service", path = "/v1/payment", configuration = FeignConfig.class)
public interface PaymentServiceClient {

    @GetMapping(value = "/by-order/{orderId}",headers = "X-Internal-Call=true")
    ResponseEntity<PaymentDto> getPaymentByOrderId(@PathVariable String orderId);

    @PutMapping(value = "/update-order-id/{paymentId}",headers = "X-Internal-Call=true")
    ResponseEntity<Map<String, Object>> updatePaymentOrderId(@PathVariable String paymentId, @RequestParam String orderId);
}

