package com.example.userservice.client;

import com.example.userservice.dto.CartDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "stock-service", path = "/v1/stock")
public interface StockServiceClient {

    @GetMapping("/reviews/check-today/{userId}")
    ResponseEntity<Boolean> hasUserReviewedToday(@PathVariable("userId") String userId);

    @GetMapping("/reviews/count/shop/{shopId}")
    ResponseEntity<Long> getShopReviewCount(@PathVariable("shopId") String shopId);

    @GetMapping("/cart/user")
    ResponseEntity<CartDto> getCart(@RequestHeader("Authorization") String token);
<<<<<<< Updated upstream
    @GetMapping(value = "/product/{productId}",headers = "X-Internal-Call=true")
    ResponseEntity<List<ReviewDto>> getReviewsByProductId(@PathVariable String productId);

    @GetMapping(value = "/reviews/count/shop/{shopId}", headers = "X-Internal-Call=true")
    ResponseEntity<Long> getShopReviewCount(@PathVariable String shopId);

    @GetMapping("/reviews/check-today/{userId}")
    ResponseEntity<Boolean> hasUserReviewedToday(@PathVariable String userId);

=======
>>>>>>> Stashed changes
}
