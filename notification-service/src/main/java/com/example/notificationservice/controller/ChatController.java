package com.example.notificationservice.controller;

import com.example.notificationservice.dto.ConversationDto;
import com.example.notificationservice.dto.MessageDto;
import com.example.notificationservice.jwt.JwtUtil;
import com.example.notificationservice.request.SendMessageRequest;
import com.example.notificationservice.request.StartConversationRequest;
import com.example.notificationservice.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/notifications/chat")
public class ChatController {
    
    private final ChatService chatService;
    private final JwtUtil jwtUtil;
    
    /**
     * Bắt đầu hoặc lấy conversation
     * POST /v1/notifications/chat/conversations/start
     */
    @PostMapping("/conversations/start")
    public ResponseEntity<ConversationDto> startConversation(
        @RequestBody StartConversationRequest request,
        HttpServletRequest httpRequest
    ) {
        String clientId = jwtUtil.ExtractUserId(httpRequest);
        ConversationDto conversation = chatService.getOrCreateConversation(
            clientId,
            request.getShopOwnerId(),
            request.getProductId()
        );
        return ResponseEntity.ok(conversation);
    }
    
    /**
     * Lấy danh sách conversations của user
     * GET /v1/notifications/chat/conversations
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations(HttpServletRequest httpRequest) {
        String userId = jwtUtil.ExtractUserId(httpRequest);
        List<ConversationDto> conversations = chatService.getConversations(userId);
        return ResponseEntity.ok(conversations);
    }
    
    /**
     * Lấy messages của conversation
     * GET /v1/notifications/chat/conversations/{conversationId}/messages
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
        @PathVariable String conversationId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        List<MessageDto> messages = chatService.getMessages(conversationId, page, size);
        return ResponseEntity.ok(messages);
    }
    
    /**
     * Gửi message
     * POST /v1/notifications/chat/messages
     */
    @PostMapping("/messages")
    public ResponseEntity<MessageDto> sendMessage(
        @RequestBody SendMessageRequest request,
        HttpServletRequest httpRequest
    ) {
        String senderId = jwtUtil.ExtractUserId(httpRequest);
        MessageDto message = chatService.sendMessage(senderId, request);
        return ResponseEntity.ok(message);
    }
    
    /**
     * Đánh dấu messages là đã đọc
     * PUT /v1/notifications/chat/conversations/{conversationId}/read
     */
    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(
        @PathVariable String conversationId,
        HttpServletRequest httpRequest
    ) {
        String userId = jwtUtil.ExtractUserId(httpRequest);
        chatService.markMessagesAsRead(conversationId, userId);
        return ResponseEntity.ok().build();
    }
}

