import createApiInstance from "./createApiInstance.js";

const api = createApiInstance();

/**
 * Validate voucher và tính discount
 * @param {string} code - Mã voucher
 * @param {string} shopOwnerId - ID shop owner
 * @param {number} orderAmount - Tổng giá trị đơn hàng
 */
export const validateVoucher = async (code, shopOwnerId, orderAmount) => {
  const response = await api.get("/v1/order/vouchers/validate", {
    params: { code, shopOwnerId, orderAmount }
  });
  return response.data;
};

/**
 * Lấy danh sách voucher của shop
 * @param {string} shopOwnerId - ID shop owner
 */
export const getShopVouchers = async (shopOwnerId) => {
  const response = await api.get(`/v1/order/vouchers/shop/${shopOwnerId}`);
  return response.data;
};

/**
 * Lấy voucher theo code
 * @param {string} code - Mã voucher
 * @param {string} shopOwnerId - ID shop owner
 */
export const getVoucherByCode = async (code, shopOwnerId) => {
  const response = await api.get("/v1/order/vouchers/by-code", {
    params: { code, shopOwnerId }
  });
  return response.data;
};

export default {
  validateVoucher,
  getShopVouchers,
  getVoucherByCode
};

