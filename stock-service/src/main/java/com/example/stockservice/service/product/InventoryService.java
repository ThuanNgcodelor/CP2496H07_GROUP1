package com.example.stockservice.service.product;

import com.example.stockservice.enums.InventoryLogType;
import com.example.stockservice.enums.ProductStatus;
import com.example.stockservice.model.InventoryLog;
import com.example.stockservice.model.Product;
import com.example.stockservice.model.Size;
import com.example.stockservice.repository.InventoryLogRepository;
import com.example.stockservice.repository.ProductRepository;
import com.example.stockservice.repository.SizeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryLogRepository inventoryLogRepository;
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;

    @Transactional
    public void logStockChange(String productId, String sizeId, int changeAmount, String userId, InventoryLogType type,
            String reason) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Size size = null;
        String sizeName = "Standard";
        int currentStock = 0;

        if (sizeId != null) {
            size = sizeRepository.findById(sizeId)
                    .orElseThrow(() -> new RuntimeException("Size not found"));
            sizeName = size.getName();
            currentStock = size.getStock();
        }

        // Create Log
        InventoryLog log = InventoryLog.builder()
                .productId(productId)
                .sizeId(sizeId)
                .productName(product.getName())
                .sizeName(sizeName)
                .changeAmount(changeAmount)
                .currentStock(currentStock)
                .type(type)
                .reason(reason)
                .userId(userId)
                .build();

        log.setCreatedTimestamp(LocalDateTime.now());
        log.setUpdatedTimestamp(LocalDateTime.now());

        inventoryLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public Page<InventoryLog> getInventoryLogs(String userId, String productId, String search, Pageable pageable) {
        if (productId != null && !productId.isEmpty()) {
            return inventoryLogRepository.findByUserIdAndProductIdOrderByCreatedTimestampDesc(userId, productId,
                    pageable);
        }
        if (search != null && !search.isEmpty()) {
            return inventoryLogRepository.findByUserIdAndProductNameContainingIgnoreCaseOrderByCreatedTimestampDesc(
                    userId, search, pageable);
        }
        return inventoryLogRepository.findByUserIdOrderByCreatedTimestampDesc(userId, pageable);
    }

    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts(String userId, int threshold) {
        List<Product> allProducts = productRepository.findByUserId(userId);
        List<Product> lowStockProducts = new ArrayList<>();

        for (Product product : allProducts) {
            if (product.getStatus() == ProductStatus.BANNED || product.getStatus() == ProductStatus.SUSPENDED) {
                continue;
            }

            boolean isLow = false;
            if (product.getSizes() != null) {
                for (Size s : product.getSizes()) {
                    if (s.getStock() <= threshold) {
                        isLow = true;
                        break;
                    }
                }
            }
            if (isLow) {
                lowStockProducts.add(product);
            }
        }
        return lowStockProducts;
    }

    @Transactional
    public void manualAdjustStock(String userId, String productId, String sizeId, int newStock, String reason) {
        // Verify ownership happens in controller or security layer mostly, but good to
        // check
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        Size size = sizeRepository.findById(sizeId)
                .orElseThrow(() -> new RuntimeException("Size not found"));

        int oldStock = size.getStock();
        int diff = newStock - oldStock;

        if (diff == 0)
            return;

        // Update Stock
        size.setStock(newStock);
        sizeRepository.save(size);

        // Update Product Status if needed
        checkAndUpdateProductStatus(product);

        // Log it
        logStockChange(productId, sizeId, diff, userId, InventoryLogType.ADJUSTMENT, reason);
    }

    private void checkAndUpdateProductStatus(Product product) {
        // Use direct DB count to ensure data consistency and avoid stale L1 cache
        // issues
        long positiveStockCount = sizeRepository.countByProductIdAndStockGreaterThan(product.getId(), 0);
        boolean allOutOfStock = (positiveStockCount == 0);

        if (allOutOfStock) {
            if (product.getStatus() != ProductStatus.BANNED && product.getStatus() != ProductStatus.SUSPENDED) {
                product.setStatus(ProductStatus.OUT_OF_STOCK);
                productRepository.save(product);
            }
        } else {
            if (product.getStatus() == ProductStatus.OUT_OF_STOCK) {
                product.setStatus(ProductStatus.IN_STOCK);
                productRepository.save(product);
            }
        }
    }
}
