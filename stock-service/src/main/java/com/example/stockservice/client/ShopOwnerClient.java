package com.example.stockservice.client;

import com.example.stockservice.dto.ShopOwnerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", contextId = "shopOwnerClient", path = "/v1/user/shop-owners")
public interface ShopOwnerClient {
    @GetMapping("/{userId}")
    ResponseEntity<ShopOwnerDto> getShopOwnerByUserId(@PathVariable String userId);
}
