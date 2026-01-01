import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/stock/analytics";
const api = createApiInstance(API_URL);

// ==================== TRACKING APIs ====================

/**
 * Track product view event
 * Call this when user views a product detail page
 * 
 * @param {string} productId - Product ID being viewed
 * @param {string} source - Source of the view (homepage, search, category, recommendation)
 * @param {number} duration - Duration in seconds how long user viewed
 * @returns {Promise<void>}
 */
export const trackView = async (productId, source = 'direct', duration = 0) => {
    try {
        await api.post('/track/view', {
            productId,
            source,
            duration,
            sessionId: getSessionId()
        });
    } catch (e) {
        console.warn('Track view failed:', e);
        // Don't throw - tracking should not break the app
    }
};

/**
 * Track search event
 * Call this when user performs a search
 * 
 * @param {string} keyword - Search keyword
 * @param {number} resultCount - Number of results returned
 * @returns {Promise<void>}
 */
export const trackSearch = async (keyword, resultCount = 0) => {
    try {
        await api.post('/track/search', {
            keyword,
            resultCount,
            sessionId: getSessionId()
        });
    } catch (e) {
        console.warn('Track search failed:', e);
    }
};

/**
 * Track add to cart event
 * Call this when user adds a product to cart
 * 
 * @param {string} productId - Product ID being added
 * @param {number} quantity - Quantity being added
 * @returns {Promise<void>}
 */
export const trackCart = async (productId, quantity = 1) => {
    try {
        await api.post('/track/cart', {
            productId,
            quantity
        });
    } catch (e) {
        console.warn('Track cart failed:', e);
    }
};

/**
 * Track purchase event
 * Call this when user successfully places an order
 * This is typically called for each product in the order
 * 
 * @param {string} productId - Product ID purchased
 * @param {number} quantity - Quantity purchased
 * @returns {Promise<void>}
 */
export const trackPurchase = async (productId, quantity = 1) => {
    try {
        await api.post('/track/purchase', {
            productId,
            quantity
        });
    } catch (e) {
        console.warn('Track purchase failed:', e);
    }
};

// ==================== QUERY APIs ====================

/**
 * Get recently viewed products for current user
 * 
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<string[]>} Array of product IDs
 */
export const getRecentlyViewed = async (limit = 10) => {
    try {
        const response = await api.get('/recently-viewed', { params: { limit } });
        return response.data;
    } catch (e) {
        console.warn('Get recently viewed failed:', e);
        return [];
    }
};

/**
 * Get trending search keywords
 * 
 * @param {number} limit - Maximum number of keywords to return
 * @returns {Promise<string[]>} Array of trending keywords
 */
export const getTrendingKeywords = async (limit = 10) => {
    try {
        const response = await api.get('/trending/keywords', { params: { limit } });
        return response.data;
    } catch (e) {
        console.warn('Get trending keywords failed:', e);
        return [];
    }
};

/**
 * Get trending products (most viewed)
 * 
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<string[]>} Array of product IDs
 */
export const getTrendingProducts = async (limit = 10) => {
    try {
        const response = await api.get('/trending/products', { params: { limit } });
        return response.data;
    } catch (e) {
        console.warn('Get trending products failed:', e);
        return [];
    }
};

/**
 * Get view count for a specific product
 * 
 * @param {string} productId - Product ID
 * @returns {Promise<number>} View count
 */
export const getViewCount = async (productId) => {
    try {
        const response = await api.get(`/view-count/${productId}`);
        return response.data.viewCount;
    } catch (e) {
        console.warn('Get view count failed:', e);
        return 0;
    }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get or create session ID for tracking
 * Stored in sessionStorage to persist across page navigation
 */
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('vibe_session');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('vibe_session', sessionId);
    }
    return sessionId;
};
