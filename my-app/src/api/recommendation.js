import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/stock/analytics/recommendations";
const api = createApiInstance(API_URL);

// ==================== RECOMMENDATION APIs ====================

/**
 * Get recently viewed products for current user (with full details)
 * Requires authentication
 * 
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} Array of product recommendation objects
 */
export const getRecentlyViewedProducts = async (limit = 10) => {
    try {
        const response = await api.get('/recently-viewed', { params: { limit } });
        return response.data;
    } catch (e) {
        console.warn('Get recently viewed products failed:', e);
        return [];
    }
};

/**
 * Get trending products (most viewed)
 * Available for all users (guest and authenticated)
 * 
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} Array of product recommendation objects
 */
export const getTrendingProductsWithDetails = async (limit = 12) => {
    try {
        const response = await api.get('/trending', { params: { limit } });
        return response.data;
    } catch (e) {
        console.warn('Get trending products failed:', e);
        return [];
    }
};

/**
 * Get personalized recommendations for current user
 * Requires authentication
 * 
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} Array of product recommendation objects
 */
export const getPersonalizedRecommendations = async (limit = 12) => {
    try {
        const response = await api.get('/personalized', { params: { limit } });
        return response.data;
    } catch (e) {
        console.warn('Get personalized recommendations failed:', e);
        return [];
    }
};

/**
 * Get similar products to a given product
 * Available for all users
 * 
 * @param {string} productId - Product ID to find similar products for
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} Array of product recommendation objects
 */
export const getSimilarProducts = async (productId, limit = 6) => {
    try {
        const response = await api.get(`/similar/${productId}`, { params: { limit } });
        return response.data;
    } catch (e) {
        console.warn('Get similar products failed:', e);
        return [];
    }
};

export default {
    getRecentlyViewedProducts,
    getTrendingProductsWithDetails,
    getPersonalizedRecommendations,
    getSimilarProducts
};
