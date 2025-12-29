package com.example.stockservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service", url = "http://localhost:8084") // Adjust URL/Name if needed
public interface NotificationClient {

    @PostMapping("/v1/notifications/broadcast/shops")
    void broadcastToShops(@RequestParam("message") String message, @RequestParam("title") String title);
}
