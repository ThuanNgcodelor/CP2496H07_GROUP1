package com.example.stockservice.client;

import com.example.stockservice.dto.OrderDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

/**
 * Feign Client để gọi order-service
 * Dùng cho AI Chat để tra cứu đơn hàng của user
 */
@FeignClient(name = "order-service", path = "/v1/order")
public interface OrderServiceClient {
    
    /**
     * Lấy danh sách đơn hàng của user
     * Cần truyền JWT token để xác thực
     */
    @GetMapping("/internal/user-orders/{userId}")
    ResponseEntity<List<OrderDto>> getOrdersByUserId(@PathVariable String userId);
    
    /**
     * Lấy chi tiết đơn hàng theo ID
     */
    @GetMapping("/internal/orders/{orderId}")
    ResponseEntity<OrderDto> getOrderById(@PathVariable String orderId);
}
