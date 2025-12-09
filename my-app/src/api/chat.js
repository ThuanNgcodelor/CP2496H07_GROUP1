/**
 * Chat API - Handle conversations and messages
 * Base URL: /v1/notifications/chat
 */

import createApiInstance from './createApiInstance';

const API_URL = '/v1/notifications/chat';
const api = createApiInstance(API_URL);

/**
 * Start or get existing conversation
 * @param {string} shopOwnerId - Shop owner user ID
 * @param {string} productId - Product ID (optional, null for general chat)
 * @returns {Promise<Object>} Conversation object
 */
export const startConversation = async (shopOwnerId, productId = null) => {
  try {
    const response = await api.post('/conversations/start', {
      shopOwnerId,
      productId
    });
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for current user
 * @returns {Promise<Array>} List of conversations
 */
export const getConversations = async () => {
  try {
    const response = await api.get('/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Get messages of a conversation
 * @param {string} conversationId - Conversation ID
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 20)
 * @returns {Promise<Array>} List of messages
 */
export const getMessages = async (conversationId, page = 0, size = 20) => {
  try {
    const response = await api.get(
      `/conversations/${conversationId}/messages`,
      {
        params: { page, size }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a message
 * @param {string} conversationId - Conversation ID
 * @param {string} content - Message content
 * @param {string} messageType - Message type: TEXT, IMAGE, PRODUCT_LINK
 * @param {string} imageId - Image ID (optional)
 * @param {string} productId - Product ID (optional)
 * @returns {Promise<Object>} Message object
 */
export const sendMessage = async (conversationId, content, messageType = 'TEXT', imageId = null, productId = null) => {
  try {
    const response = await api.post('/messages', {
      conversationId,
      content,
      messageType,
      imageId,
      productId
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Mark messages as read
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<void>}
 */
export const markAsRead = async (conversationId) => {
  try {
    await api.put(`/conversations/${conversationId}/read`);
  } catch (error) {
    console.error('Error marking as read:', error);
    throw error;
  }
};

