package com.example.notificationservice.request;

import com.example.notificationservice.model.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String conversationId;
    private String content;
    @Builder.Default
    private Message.MessageType messageType = Message.MessageType.TEXT;
    private String imageId;
    private String productId;
}

