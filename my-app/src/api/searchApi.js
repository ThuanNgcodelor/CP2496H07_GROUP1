import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1";
const api = createApiInstance(API_URL);

/**
 * Search products with filters
 * @param {Object} searchRequest - { query, filters, page, size, sortBy }
 * @returns {Promise} SearchResponse with products and metadata
 */
export const searchProducts = async (searchRequest) => {
    try {
        const response = await api.post('/stock/search/query', {
            query: searchRequest.query || '',
            filters: searchRequest.filters || null,
            page: searchRequest.page || 0,
            size: searchRequest.size || 20,
            sortBy: searchRequest.sortBy || 'relevance'
        });
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

/**
 * Get autocomplete suggestions
 * @param {string} query - Partial search query
 * @param {number} limit - Max number of suggestions (default: 10)
 * @returns {Promise} AutocompleteResponse with suggestions
 */
export const getAutocomplete = async (query, limit = 10) => {
    try {
        const response = await api.get('/stock/search/autocomplete', {
            params: { q: query, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting autocomplete:', error);
        throw error;
    }
};

/**
 * Get user's search history
 * @param {number} limit - Max number of history items (default: 10)
 * @returns {Promise} { history: string[] }
 */
export const getSearchHistory = async (limit = 10) => {
    try {
        const response = await api.get('/stock/search/history', {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting search history:', error);
        // Return empty history nếu có lỗi (có thể user chưa login)
        return { history: [] };
    }
};

/**
 * Clear all search history
 * @returns {Promise} { message: string }
 */
export const clearSearchHistory = async () => {
    try {
        const response = await api.delete('/stock/search/history');
        return response.data;
    } catch (error) {
        console.error('Error clearing search history:', error);
        throw error;
    }
};

/**
 * Remove a single search history item
 * @param {string} query - Query to remove
 * @returns {Promise} { message: string }
 */
export const removeSearchHistoryItem = async (query) => {
    try {
        const response = await api.delete('/stock/search/history/item', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing history item:', error);
        throw error;
    }
};
