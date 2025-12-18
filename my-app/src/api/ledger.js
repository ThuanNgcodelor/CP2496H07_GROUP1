import createApiInstance from "./createApiInstance";

const API_URL = "/v1/order/ledger";
const api = createApiInstance(API_URL);

/**
 * Get Shop Ledger Balance
 * @param {string} shopOwnerId 
 * @returns {Promise<Object>}
 */
export const getBalance = async (shopOwnerId) => {
    try {
        const response = await api.get(`/balance/${shopOwnerId}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch balance");
    }
};

/**
 * Get Ledger Entries
 * @param {string} shopOwnerId 
 * @param {number} page 
 * @param {number} size 
 * @returns {Promise<Object>}
 */
export const getEntries = async (shopOwnerId, page = 0, size = 20) => {
    try {
        const response = await api.get(`/entries/${shopOwnerId}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch entries");
    }
};

/**
 * Request Payout
 * @param {string} shopOwnerId 
 * @param {Object} payoutRequest { amount, bankAccountNumber, bankName, accountHolderName }
 * @returns {Promise<Object>}
 */
export const requestPayout = async (shopOwnerId, payoutRequest) => {
    try {
        const response = await api.post(`/payout/request/${shopOwnerId}`, payoutRequest);
        return response.data;
    } catch (error) {
        throw new Error("Failed to request payout");
    }
};

/**
 * Get Payout History
 * @param {string} shopOwnerId 
 * @returns {Promise<Array>}
 */
export const getPayoutHistory = async (shopOwnerId) => {
    try {
        const response = await api.get(`/payout/history/${shopOwnerId}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch payout history");
    }
};

/**
 * Export Invoice (Excel file)
 * @param {string} payoutId 
 * @returns {Promise<Blob>}
 */
export const exportInvoice = async (payoutId) => {
    try {
        const response = await api.get(`/payout/invoice/${payoutId}`, {
            responseType: 'blob' // Important for downloading files
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to export invoice");
    }
};

/**
 * Export Payout History (Excel file)
 * @param {string} shopOwnerId 
 * @returns {Promise<Blob>}
 */
export const exportPayoutHistory = async (shopOwnerId) => {
    try {
        const response = await api.get(`/payout/history/export/${shopOwnerId}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to export payout history");
    }
};
