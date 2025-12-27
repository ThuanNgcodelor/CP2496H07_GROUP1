package com.example.stockservice.client;

import com.example.stockservice.dto.OrderDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Feign Client để gọi order-service
 * Dùng cho AI Chat để tra cứu đơn hàng của user và shop owner
 */
@FeignClient(name = "order-service", path = "/v1/order")
public interface OrderServiceClient {
    
    /**
     * Lấy danh sách đơn hàng của user
     */
    @GetMapping("/internal/user-orders/{userId}")
    ResponseEntity<List<OrderDto>> getOrdersByUserId(@PathVariable String userId);
    
    /**
     * Lấy chi tiết đơn hàng theo ID
     */
    @GetMapping("/internal/orders/{orderId}")
    ResponseEntity<OrderDto> getOrderById(@PathVariable String orderId);

    // ==================== SHOP OWNER ENDPOINTS ====================

    /**
     * Lấy danh sách đơn hàng của shop owner (theo status)
     */
    @GetMapping("/internal/shop-owner/{shopOwnerId}/orders")
    ResponseEntity<List<OrderDto>> getShopOwnerOrders(
            @PathVariable String shopOwnerId, 
            @RequestParam(required = false) String status);

    /**
     * Lấy thống kê đơn hàng của shop owner
     */
    @GetMapping("/internal/shop-owner/{shopOwnerId}/order-stats")
    ResponseEntity<Map<String, Object>> getShopOwnerOrderStats(@PathVariable String shopOwnerId);

    /**
     * Bulk confirm tất cả đơn pending của shop owner
     */
    @PostMapping("/internal/shop-owner/{shopOwnerId}/bulk-confirm")
    ResponseEntity<Map<String, Object>> bulkConfirmPendingOrders(@PathVariable String shopOwnerId);
}


