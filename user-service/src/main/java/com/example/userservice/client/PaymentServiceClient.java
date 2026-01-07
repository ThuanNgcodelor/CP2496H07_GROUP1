package com.example.userservice.client;

import com.example.userservice.config.FeignConfig;
import com.example.userservice.dto.PaymentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "payment-service", path = "/v1/payment", configuration = FeignConfig.class)
public interface PaymentServiceClient {

    @GetMapping("/by-order/{orderId}")
    ResponseEntity<PaymentDto> getPaymentByOrderId(@PathVariable("orderId") String orderId);
}
