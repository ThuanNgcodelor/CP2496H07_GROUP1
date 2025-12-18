import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user";
const api = createApiInstance(API_URL);

// ============ PUBLIC APIs (no auth required) ============

/**
 * Lấy tất cả plans đang active (for shop owners)
 */
export const getActivePlans = async () => {
    const response = await api.get("/subscription-plan/active");
    return response.data;
};

/**
 * Lấy plan theo code
 */
export const getPlanByCode = async (code) => {
    const response = await api.get(`/subscription-plan/code/${code}`);
    return response.data;
};

// ============ ADMIN APIs (auth required - auto handled by createApiInstance) ========

/**
 * Lấy tất cả plans (admin only)
 */
export const getAllSubscriptionPlans = async () => {
    const response = await api.get("/subscription-plan");
    return response.data;
};

/**
 * Lấy plan theo ID
 */
export const getSubscriptionPlanById = async (id) => {
    const response = await api.get(`/subscription-plan/${id}`);
    return response.data;
};

/**
 * Tạo plan mới
 */
export const createSubscriptionPlan = async (data) => {
    const response = await api.post("/subscription-plan", data);
    return response.data;
};

/**
 * Cập nhật plan
 */
export const updateSubscriptionPlan = async (id, data) => {
    const response = await api.put(`/subscription-plan/${id}`, data);
    return response.data;
};

/**
 * Xóa plan
 */
export const deleteSubscriptionPlan = async (id) => {
    await api.delete(`/subscription-plan/${id}`);
};

/**
 * Toggle active status
 */
export const toggleSubscriptionPlanActive = async (id) => {
    await api.patch(`/subscription-plan/${id}/toggle`);
};

/**
 * Cập nhật display order
 */
export const updatePlanDisplayOrder = async (id, order) => {
    await api.patch(`/subscription-plan/${id}/order`, null, {
        params: { order }
    });
};

// ============ PRICING APIs ============

/**
 * Lấy pricing của plan
 */
export const getPlanPricing = async (planId) => {
    const response = await api.get(`/subscription-plan/${planId}/pricing`);
    return response.data;
};

/**
 * Thêm pricing mới
 */
export const createPlanPricing = async (planId, data) => {
    const response = await api.post(`/subscription-plan/${planId}/pricing`, data);
    return response.data;
};

/**
 * Cập nhật pricing
 */
export const updatePlanPricing = async (pricingId, data) => {
    const response = await api.put(`/subscription-plan/pricing/${pricingId}`, data);
    return response.data;
};

/**
 * Xóa pricing
 */
export const deletePlanPricing = async (pricingId) => {
    await api.delete(`/subscription-plan/pricing/${pricingId}`);
};

// ============ FEATURE APIs ============

/**
 * Lấy features của plan
 */
export const getPlanFeatures = async (planId) => {
    const response = await api.get(`/subscription-plan/${planId}/features`);
    return response.data;
};

/**
 * Thêm feature mới
 */
export const createPlanFeature = async (planId, data) => {
    const response = await api.post(`/subscription-plan/${planId}/features`, data);
    return response.data;
};

/**
 * Cập nhật feature
 */
export const updatePlanFeature = async (featureId, data) => {
    const response = await api.put(`/subscription-plan/features/${featureId}`, data);
    return response.data;
};

/**
 * Xóa feature
 */
export const deletePlanFeature = async (featureId) => {
    await api.delete(`/subscription-plan/features/${featureId}`);
};

/**
 * Sắp xếp lại features
 */
export const reorderPlanFeatures = async (planId, featureIds) => {
    await api.put(`/subscription-plan/${planId}/features/reorder`, featureIds);
};

// ============ STATISTICS APIs ============

/**
 * Lấy thống kê plan
 */
export const getPlanStats = async (planId) => {
    const response = await api.get(`/subscription-plan/${planId}/stats`);
    return response.data;
};

/**
 * Lấy danh sách shops đã subscribe plan này
 */
export const getShopSubscriptionsByPlan = async (planId, page = 0, size = 10) => {
    const response = await api.get(`/subscription-plan/${planId}/subscriptions`, {
        params: { page, size }
    });
    return response.data;
};
