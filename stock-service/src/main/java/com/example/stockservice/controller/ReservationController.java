package com.example.stockservice.controller;

import com.example.stockservice.service.reservation.StockReservationService;
import com.example.stockservice.service.reservation.StockReservationService.ReservationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller cho Stock Reservation operations.
 * Chỉ cho phép internal calls (từ order-service).
 */
@RestController
@RequestMapping("/v1/stock/reservation")
@RequiredArgsConstructor
@Slf4j
public class ReservationController {

    private final StockReservationService reservationService;
    
    /**
     * Reserve stock for an order
     * POST /v1/stock/reservation/reserve
     * 
     * Request body: { orderId, productId, sizeId, quantity }
     * Response: { success: true/false, status, reservedQuantity/message }
     */
    @PostMapping("/reserve")
    public ResponseEntity<?> reserveStock(@RequestBody ReserveRequest request) {
        log.info("[API] Reserve request: orderId={}, product={}, size={}, qty={}", 
                 request.orderId(), request.productId(), request.sizeId(), request.quantity());
        
        ReservationResult result = reservationService.reserveStock(
            request.orderId(),
            request.productId(),
            request.sizeId(),
            request.quantity()
        );
        
        if (result.isSuccess()) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "status", result.getStatus(),
                "reservedQuantity", result.getReservedQuantity()
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "status", result.getStatus(),
                "message", result.getMessage()
            ));
        }
    }
    
    /**
     * Confirm reservation (after payment/order success)
     * POST /v1/stock/reservation/confirm
     * 
     * Request body: { orderId, productId, sizeId }
     */
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmReservation(@RequestBody ReserveRequest request) {
        log.info("[API] Confirm request: orderId={}, product={}, size={}", 
                 request.orderId(), request.productId(), request.sizeId());
        
        reservationService.confirmReservation(
            request.orderId(),
            request.productId(),
            request.sizeId()
        );
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Reservation confirmed"
        ));
    }
    
    /**
     * Cancel reservation and rollback stock
     * POST /v1/stock/reservation/cancel
     * 
     * Request body: { orderId, productId, sizeId }
     * Response: { success: true, rolledBackQuantity }
     */
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelReservation(@RequestBody ReserveRequest request) {
        log.info("[API] Cancel request: orderId={}, product={}, size={}", 
                 request.orderId(), request.productId(), request.sizeId());
        
        int rolledBack = reservationService.cancelReservation(
            request.orderId(),
            request.productId(),
            request.sizeId()
        );
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "rolledBackQuantity", rolledBack
        ));
    }
    
    /**
     * Get current stock from cache
     * GET /v1/stock/reservation/stock/{productId}/{sizeId}
     */
    @GetMapping("/stock/{productId}/{sizeId}")
    public ResponseEntity<?> getStock(
            @PathVariable String productId,
            @PathVariable String sizeId) {
        
        int stock = reservationService.getStock(productId, sizeId);
        
        if (stock < 0) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(Map.of(
            "productId", productId,
            "sizeId", sizeId,
            "stock", stock
        ));
    }
    
    /**
     * Manually trigger cache warm-up
     * POST /v1/stock/reservation/warmup
     */
    @PostMapping("/warmup")
    public ResponseEntity<?> warmUpCache() {
        log.info("[API] Manual cache warm-up triggered");
        reservationService.warmUpStockCache();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Cache warm-up completed"
        ));
    }
    
    // ==================== REQUEST DTO ====================
    
    /**
     * Request DTO for reservation operations
     */
    public record ReserveRequest(
        String orderId,
        String productId,
        String sizeId,
        int quantity
    ) {}
}
