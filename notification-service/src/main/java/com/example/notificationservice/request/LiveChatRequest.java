package com.example.notificationservice.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveChatRequest {
    
    @NotBlank(message = "Message is required")
    @Size(max = 500, message = "Message must be less than 500 characters")
    private String message;
    
    // Username from frontend (fallback if not in JWT session)
    private String username;
    
    // Avatar URL from frontend
    private String avatarUrl;
    
    // True if sender is shop owner
    private Boolean isOwner;
}
