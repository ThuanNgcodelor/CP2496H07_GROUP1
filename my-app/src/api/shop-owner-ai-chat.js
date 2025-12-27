import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/stock/ai-chat/shop-owner";
const api = createApiInstance(API_URL);

// Shop Owner AI Chat API - Tách biệt với client AI

/**
 * Gửi tin nhắn tới AI chatbot cho Shop Owner
 * @param {string} message - Nội dung tin nhắn
 * @param {string} conversationId - ID conversation (optional)
 * @param {string} shopOwnerId - Shop Owner ID
 * @returns {Promise<{message: string, conversationId: string, type: string, success: boolean}>}
 */
export const sendShopOwnerAIChatMessage = async (message, conversationId = null, shopOwnerId = null) => {
    const response = await api.post('/message', {
        message,
        conversationId,
        shopOwnerId
    });
    return response.data;
};

/**
 * Xóa lịch sử hội thoại AI của Shop Owner
 * @param {string} conversationId - ID của conversation cần xóa
 */
export const clearShopOwnerAIConversation = async (conversationId) => {
    await api.delete(`/conversation/${conversationId}`);
};

/**
 * Kiểm tra trạng thái AI service cho Shop Owner
 * @returns {Promise<string>}
 */
export const checkShopOwnerAIHealth = async () => {
    const response = await api.get('/health');
    return response.data;
};
