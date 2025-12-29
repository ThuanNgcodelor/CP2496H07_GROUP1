import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/payment";
const api = createApiInstance(API_URL);

/**
 * Tạo URL thanh toán VNPay
 * @param {{amount:number, orderId?:string, orderInfo?:string, bankCode?:string, locale?:string, returnUrl?:string, userId?:string, addressId?:string, orderDataJson?:string}} payload
 * @returns {Promise<{paymentUrl:string, txnRef:string}>}
 */
export const createVnpayPayment = async (payload) => {
  const { data } = await api.post("/vnpay/create", payload);
  return data;
};

/**
 * Kiểm tra kết quả thanh toán VNPay từ callback
 * @param {Object} params - Query parameters từ VNPay callback
 * @returns {Promise<{status:string}>}
 */
export const checkVnpayReturn = async (params) => {
  // Convert params object to URLSearchParams
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    queryParams.append(key, params[key]);
  });

  const { data } = await api.get(`/vnpay/return?${queryParams.toString()}`);
  return data;
};

/**
 * Tạo thanh toán MoMo
 * @param {{amount:number, orderId?:string, orderInfo?:string, userId?:string, addressId?:string, orderDataJson?:string}} payload
 * @returns {Promise<{code:string, message:string, paymentUrl:string, txnRef:string}>}
 */
export const createMomoPayment = async (payload) => {
  const { data } = await api.post("/momo/create", payload);
  return data;
};

/**
 * Kiểm tra kết quả thanh toán MoMo từ callback
 * @param {Object} params - Query parameters từ MoMo callback
 * @returns {Promise<{status:string}>}
 */
export const checkMomoReturn = async (params) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    queryParams.append(key, params[key]);
  });

  const { data } = await api.get(`/momo/return?${queryParams.toString()}`);
  return data;
};

