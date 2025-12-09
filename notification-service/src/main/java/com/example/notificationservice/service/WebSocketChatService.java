package com.example.notificationservice.service;

import com.example.notificationservice.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketChatService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Gửi message đến tất cả users trong conversation qua WebSocket
     * Destination: /topic/conversation/{conversationId}/messages
     */
    public void sendMessageToConversation(String conversationId, MessageDto message) {
        String destination = "/topic/conversation/" + conversationId + "/messages";
        log.info("Sending message to conversation {} via WebSocket: {}", conversationId, message.getId());
        messagingTemplate.convertAndSend(destination, message);
    }
    
    /**
     * Gửi notification về conversation mới đến user
     * Destination: /topic/user/{userId}/conversations
     */
    public void notifyNewConversation(String userId, String conversationId) {
        String destination = "/topic/user/" + userId + "/conversations";
        log.info("Notifying user {} about new conversation: {}", userId, conversationId);
        messagingTemplate.convertAndSend(destination, conversationId);
    }
}

