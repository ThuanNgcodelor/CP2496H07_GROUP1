import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user";
const api = createApiInstance(API_URL);

// Client APIs (Public - no auth required, add to PUBLIC_401_ALLOWLIST if needed)
export const getActiveBanners = async () => {
    const response = await api.get("/banner/active");
    return response.data;
};

export const getActiveBannersByPosition = async (position) => {
    const response = await api.get(`/banner/active/${position}`);
    return response.data;
};

export const trackBannerClick = async (id) => {
    await api.post(`/banner/${id}/click`);
};

export const trackBannerView = async (id) => {
    await api.post(`/banner/${id}/view`);
};

// Admin APIs (Auth required - auto handled by createApiInstance)
export const getAllBanners = async () => {
    const response = await api.get("/banner");
    return response.data;
};

export const getBannerById = async (id) => {
    const response = await api.get(`/banner/${id}`);
    return response.data;
};

export const createBanner = async (formData) => {
    const response = await api.post("/banner", formData, {
        transformRequest: [(payload, headers) => {
            delete headers.common?.["Content-Type"];
            delete headers.post?.["Content-Type"];
            delete headers["Content-Type"];
            return payload;
        }],
    });
    return response.data;
};

export const updateBanner = async (id, formData) => {
    const response = await api.put(`/banner/${id}`, formData, {
        transformRequest: [(payload, headers) => {
            delete headers.common?.["Content-Type"];
            delete headers.put?.["Content-Type"];
            delete headers["Content-Type"];
            return payload;
        }],
    });
    return response.data;
};

export const deleteBanner = async (id) => {
    await api.delete(`/banner/${id}`);
};

export const toggleBannerActive = async (id) => {
    await api.patch(`/banner/${id}/toggle`);
};

export const updateBannerDisplayOrder = async (id, order) => {
    await api.patch(`/banner/${id}/order`, null, {
        params: { order }
    });
};
