package com.example.stockservice.controller;

import com.example.stockservice.dto.StockAdjustmentRequest;
import com.example.stockservice.jwt.JwtUtil;
import com.example.stockservice.model.InventoryLog;
import com.example.stockservice.model.Product;
import com.example.stockservice.service.product.InventoryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/stock/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;
    private final JwtUtil jwtUtil;
    private final org.modelmapper.ModelMapper modelMapper;

    @GetMapping("/logs")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<Page<InventoryLog>> getInventoryLogs(
            HttpServletRequest request,
            @RequestParam(required = false) String productId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String userId = jwtUtil.ExtractUserId(request);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(inventoryService.getInventoryLogs(userId, productId, search, pageable));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<com.example.stockservice.dto.ProductDto>> getLowStockProducts(
            HttpServletRequest request,
            @RequestParam(defaultValue = "10") int threshold) {

        String userId = jwtUtil.ExtractUserId(request);
        List<Product> products = inventoryService.getLowStockProducts(userId, threshold);
        List<com.example.stockservice.dto.ProductDto> dtos = products.stream()
                .map(product -> modelMapper.map(product, com.example.stockservice.dto.ProductDto.class))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/adjust")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<?> adjustStock(
            HttpServletRequest request,
            @RequestBody StockAdjustmentRequest adjustmentRequest) {

        String userId = jwtUtil.ExtractUserId(request);
        inventoryService.manualAdjustStock(
                userId,
                adjustmentRequest.getProductId(),
                adjustmentRequest.getSizeId(),
                adjustmentRequest.getNewStock(),
                adjustmentRequest.getReason());
        return ResponseEntity.ok("Stock adjusted successfully");
    }
}
