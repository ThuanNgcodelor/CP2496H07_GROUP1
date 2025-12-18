import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import imgFallback from "../../../assets/images/shop/6.png";
import { getAllAddress, getUser } from "../../../api/user.js";
import { calculateShippingFee, createOrder } from "../../../api/order.js";
import { createVnpayPayment } from "../../../api/payment.js";
import { validateVoucher } from "../../../api/voucher.js";
import Swal from "sweetalert2";

const formatVND = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "₫";

export function CheckoutPage({
  selectedItems: selectedItemsProp = [],
  imageUrls: imageUrlsProp = {},
  productNames: productNamesProp = {},
  shippingFee: shippingFeeProp = 0,
  voucherDiscount: voucherDiscountProp = 0,
  subtotal: subtotalProp = 0
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalSelectedAddressId, setModalSelectedAddressId] = useState(null);
  const [shippingFee, setShippingFee] = useState(shippingFeeProp);
  const [calculatingShippingFee, setCalculatingShippingFee] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  
  // Voucher states
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const selectedItems = location.state?.selectedItems ?? selectedItemsProp;
  const imageUrls = location.state?.imageUrls ?? imageUrlsProp;
  const productNames = location.state?.productNames ?? productNamesProp;
  const subtotal =
    location.state?.subtotal ??
    selectedItems.reduce(
      (sum, it) =>
        sum +
        ((it.totalPrice != null
          ? Number(it.totalPrice)
          : Number(it.unitPrice || it.price || 0) * Number(it.quantity || 0)) || 0),
      0
    ) ??
    subtotalProp;

  const total = subtotal + shippingFee - voucherDiscount;

  const toast = (icon, title) =>
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
    });

  const refreshAddresses = async () => {
    setAddressLoading(true);
    try {
      const data = await getAllAddress();
      setAddresses(data);
      const def = data.find((a) => a.isDefault);
      if (def) {
        setSelectedAddressId(def.id);
        setSelectedAddress(def);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
        setSelectedAddress(data[0]);
      }
    } catch (e) {
      console.error("Failed to refresh addresses:", e);
      Swal.fire({
        icon: "error",
        title: t('address.loadFailed'),
        text: t('address.tryAgain'),
      });
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    refreshAddresses();
    
    // Get userId
    getUser().then(user => {
      setUserId(user?.id || user?.userId || null);
    }).catch((err) => {
      if (err?.response?.status === 401) {
        Cookies.remove("accessToken");
        navigate("/login");
      }
      console.error("Failed to get user:", err);
    });
  }, [token, navigate]);

  // Calculate shipping fee when address or selected items change
  useEffect(() => {
    const calculateFee = async () => {
      if (!selectedAddressId || selectedItems.length === 0) {
        setShippingFee(0);
        return;
      }
      
      setCalculatingShippingFee(true);
      try {
        const result = await calculateShippingFee(selectedAddressId, selectedItems);
        if (result && result.shippingFee) {
          setShippingFee(result.shippingFee);
        } else {
          setShippingFee(0);
        }
      } catch (error) {
        console.error("Failed to calculate shipping fee:", error);
        setShippingFee(0);
      } finally {
        setCalculatingShippingFee(false);
      }
    };
    
    // Debounce calculation
    const timeoutId = setTimeout(calculateFee, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedAddressId, selectedItems]);

  // Update selectedAddress when selectedAddressId changes
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      setSelectedAddress(addr || null);
    }
  }, [selectedAddressId, addresses]);

  const handleOpenAddressModal = () => {
    setModalSelectedAddressId(selectedAddressId);
    setShowAddressModal(true);
  };

  const handleAddressSelect = (id) => setModalSelectedAddressId(id);

  const handleConfirmSelection = () => {
    if (modalSelectedAddressId) {
      setSelectedAddressId(modalSelectedAddressId);
      setShowAddressModal(false);
      toast("success", t('cart.address.selected'));
    }
  };

  useEffect(() => {
    if (!showAddressModal) setModalSelectedAddressId(null);
  }, [showAddressModal]);

  // Handle apply voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast("warning", "Vui lòng nhập mã voucher");
      return;
    }

    // Lấy shopOwnerId từ item đầu tiên
    const shopOwnerId = selectedItems[0]?.shopOwnerId;
    if (!shopOwnerId) {
      toast("error", "Không tìm thấy thông tin shop");
      return;
    }

    setVoucherLoading(true);
    try {
      const response = await validateVoucher(voucherCode, shopOwnerId, subtotal);
      
      if (response.valid) {
        setVoucherDiscount(response.discount);
        setAppliedVoucher({
          code: response.code,
          title: response.title,
          discount: response.discount,
          voucherId: response.voucherId
        });
        toast("success", `Áp dụng voucher thành công! Giảm ${formatVND(response.discount)}`);
      } else {
        toast("error", response.message || "Voucher không hợp lệ");
        setVoucherDiscount(0);
        setAppliedVoucher(null);
      }
    } catch (error) {
      console.error("Validate voucher error:", error);
      toast("error", error?.response?.data?.message || "Không thể áp dụng voucher");
      setVoucherDiscount(0);
      setAppliedVoucher(null);
    } finally {
      setVoucherLoading(false);
    }
  };

  // Handle remove voucher
  const handleRemoveVoucher = () => {
    setVoucherCode("");
    setVoucherDiscount(0);
    setAppliedVoucher(null);
    toast("info", "Đã hủy voucher");
  };

  const handlePlaceOrder = async (e) => {
    e?.preventDefault?.();
    if (orderLoading) return;

    if (selectedItems.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: t('cart.checkout.noItemsSelected'),
        text: t('cart.checkout.selectAtLeastOne'),
        confirmButtonText: t('common.ok'),
      });
      return;
    }
    if (addresses.length === 0) {
      const go = await Swal.fire({
        icon: "info",
        title: t('cart.checkout.noAddressFound'),
        text: t('cart.checkout.needAddress'),
        showCancelButton: true,
        confirmButtonText: t('cart.checkout.addAddress'),
        cancelButtonText: t('common.cancel'),
      });
      if (go.isConfirmed) navigate("/information/address");
      return;
    }
    if (!selectedAddressId) {
      await Swal.fire({
        icon: "info",
        title: t('cart.checkout.selectDeliveryAddress'),
        text: t('cart.checkout.chooseAddress'),
        confirmButtonText: t('cart.checkout.chooseNow'),
      });
      setModalSelectedAddressId(null);
      setShowAddressModal(true);
      return;
    }

    setOrderLoading(true);
    try {
      const orderData = {
        selectedItems: selectedItems.map((it) => ({
          productId: it.productId || it.id,
          sizeId: it.sizeId,
          quantity: it.quantity,
          unitPrice: it.unitPrice || it.price,
        })),
        addressId: selectedAddressId,
        paymentMethod: paymentMethod || "COD",
        voucherId: appliedVoucher?.voucherId || null,
        voucherDiscount: voucherDiscount || 0,
        shippingFee: shippingFee || 0,
      };

      Swal.fire({
        title: t('cart.checkout.creatingOrder'),
        text: t('cart.checkout.pleaseWait'),
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      // If VNPay, create payment first (order will be created after payment success)
      if (paymentMethod === "VNPAY" || paymentMethod === "CARD") {
        try {
          // Calculate final total with shipping and voucher discount
          const totalWithShipping = subtotal + shippingFee - voucherDiscount;
          
          if (!userId) {
            throw new Error("Cannot get user ID");
          }

          // Create payment with order data (order will be created after payment success)
          const payPayload = {
            amount: Math.max(1, Math.round(totalWithShipping)),
            orderInfo: "Thanh toan don hang",
            userId: userId,
            addressId: selectedAddressId,
            orderDataJson: JSON.stringify({
              userId: userId,
              addressId: selectedAddressId,
              shippingFee: shippingFee || 0,
              voucherId: appliedVoucher?.voucherId || null,
              voucherDiscount: voucherDiscount || 0,
              selectedItems: selectedItems.map((it) => ({
                productId: it.productId || it.id,
                sizeId: it.sizeId,
                quantity: it.quantity,
                unitPrice: it.unitPrice || it.price,
              })),
            }),
          };
          
          const payRes = await createVnpayPayment(payPayload);
          Swal.close();
          
          if (payRes?.paymentUrl) {
            // Redirect to VNPay - order will be created after payment success
            window.location.href = payRes.paymentUrl;
            return;
          } else {
            throw new Error("No payment URL returned");
          }
        } catch (payErr) {
          console.error("Create VNPay payment failed:", payErr);
          Swal.close();
          await Swal.fire({
            icon: "error",
            title: t('payment.paymentError.title'),
            text: payErr?.response?.data?.message || payErr?.message || t('payment.paymentError.text'),
            confirmButtonText: t('common.ok'),
          });
          return;
        }
      }

      // COD flow - use async Kafka
      const result = await createOrder(orderData);
      Swal.close();

      toast("success", t('cart.checkout.orderCreated'));
      navigate("/information/orders");
    } catch (err) {
      console.error("Failed to create order:", err);
      Swal.close();
      
      if (err.type === 'INSUFFICIENT_STOCK') {
        const details = err.details;
        let stockMessage = err.message;
        
        if (details && details.available && details.requested) {
          stockMessage = `${t('cart.checkout.insufficientStock')}. ${t('cart.checkout.available')}: ${details.available}, ${t('cart.checkout.requested')}: ${details.requested}`;
        }
        
        await Swal.fire({
          icon: "warning",
          title: t('cart.checkout.insufficientStock'),
          html: `
            <p>${stockMessage}</p>
            <p class="text-muted">${t('cart.checkout.reduceQuantity')}</p>
          `,
          confirmButtonText: t('common.ok'),
          confirmButtonColor: "#ff6b35"
        });
      } else if (err.type === 'ADDRESS_NOT_FOUND') {
        await Swal.fire({
          icon: "error",
          title: t('cart.checkout.invalidAddress'),
          text: t('cart.checkout.selectValidAddress'),
          confirmButtonText: t('cart.checkout.selectAddress'),
          confirmButtonColor: "#dc3545"
        }).then((result) => {
          if (result.isConfirmed) {
            setShowAddressModal(true);
          }
        });
      } else if (err.type === 'CART_EMPTY') {
        await Swal.fire({
          icon: "info",
          title: t('cart.checkout.emptyCart'),
          text: t('cart.checkout.cartEmpty'),
          confirmButtonText: t('cart.checkout.goShopping'),
          confirmButtonColor: "#007bff"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/shop");
          }
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: t('cart.checkout.checkoutFailed'),
          html: `
            <p>${err.message || t('cart.checkout.errorOccurred')}</p>
            <p class="text-muted">${t('cart.checkout.contactSupport')}</p>
          `,
          confirmButtonText: t('common.tryAgain'),
          confirmButtonColor: "#dc3545"
        });
      }
    } finally {
      setOrderLoading(false);
    }
  };

  // Group items by shop owner name
  const itemsByShop = {};
  selectedItems.forEach((item) => {
    const shopName = item.shopOwnerName || item.shopName || 'Unknown Shop';
    if (!itemsByShop[shopName]) {
      itemsByShop[shopName] = [];
    }
    itemsByShop[shopName].push(item);
  });

  return (
    <>
      <style>{`
        .checkout-page {
          background: #f5f5f5;
          min-height: 100vh;
          padding-bottom: 40px;
        }
        .checkout-header {
          background: #fff;
          border-bottom: 1px solid #f0f0f0;
          padding: 12px 0;
        }
        .checkout-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .checkout-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 600;
          color: #ee4d2d;
        }
        .checkout-logo-separator {
          width: 1px;
          height: 20px;
          background: #ddd;
        }
        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .checkout-section {
          background: #fff;
          border-radius: 4px;
          margin-bottom: 20px;
          padding: 20px;
        }
        .checkout-section-title {
          font-size: 16px;
          font-weight: 600;
          color: #ee4d2d;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .checkout-address {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .checkout-address-info {
          flex: 1;
        }
        .checkout-address-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        .checkout-address-details {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }
        .checkout-address-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .checkout-btn-default {
          background: #d4a574;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
        }
        .checkout-link {
          color: #1890ff;
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
        }
        .checkout-link:hover {
          text-decoration: underline;
        }
        .checkout-product-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        .checkout-favorite-badge {
          background: #ee4d2d;
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .checkout-shop-name {
          font-size: 14px;
          color: #333;
          font-weight: 600;
        }
        .checkout-chat-btn {
          background: #52c41a;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
        }
        .checkout-product-item {
          display: flex;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .checkout-product-item:last-child {
          border-bottom: none;
        }
        .checkout-product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
        }
        .checkout-product-info {
          flex: 1;
        }
        .checkout-product-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
        }
        .checkout-product-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          font-size: 13px;
          color: #666;
        }
        .checkout-product-detail-item {
          display: flex;
          flex-direction: column;
        }
        .checkout-product-detail-label {
          color: #999;
          margin-bottom: 4px;
        }
        .checkout-product-detail-value {
          color: #333;
          font-weight: 600;
        }
        .checkout-insurance {
          margin-top: 16px;
          padding: 16px;
          background: #fafafa;
          border-radius: 4px;
          display: flex;
          gap: 12px;
        }
        .checkout-insurance-checkbox {
          width: 18px;
          height: 18px;
          margin-top: 2px;
        }
        .checkout-insurance-content {
          flex: 1;
        }
        .checkout-insurance-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        .checkout-insurance-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        .checkout-insurance-price {
          font-size: 14px;
          color: #ee4d2d;
          font-weight: 600;
        }
        .checkout-shipping-method {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px 0;
        }
        .checkout-shipping-info {
          flex: 1;
        }
        .checkout-shipping-label {
          font-size: 14px;
          color: #333;
          margin-bottom: 12px;
        }
        .checkout-shipping-badge {
          background: #52c41a;
          color: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .checkout-shipping-details {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        .checkout-shipping-fee {
          font-size: 14px;
          color: #333;
          font-weight: 600;
          min-width: 100px;
          text-align: right;
        }
        .checkout-payment-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .checkout-payment-tab {
          padding: 12px 16px;
          color: #666;
          text-decoration: none;
          font-size: 14px;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          cursor: pointer;
          position: relative;
        }
        .checkout-payment-tab.active {
          color: #ee4d2d;
          border-bottom-color: #ee4d2d;
        }
        .checkout-payment-tab.active::after {
          content: '✓';
          position: absolute;
          bottom: -2px;
          right: 8px;
          color: #ee4d2d;
          font-size: 12px;
          background: #fff;
          padding: 0 4px;
        }
        .checkout-payment-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          margin-bottom: 8px;
          cursor: pointer;
        }
        .checkout-payment-option:hover {
          border-color: #ee4d2d;
        }
        .checkout-payment-option.selected {
          border-color: #ee4d2d;
          background: #fff5f0;
        }
        .checkout-payment-radio {
          width: 18px;
          height: 18px;
        }
        .checkout-payment-info {
          flex: 1;
        }
        .checkout-payment-name {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
        .checkout-payment-details {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
        .checkout-summary {
          background: #fff;
          border-radius: 4px;
          padding: 20px;
          position: sticky;
          top: 20px;
        }
        .checkout-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .checkout-summary-row.total {
          border-top: 1px solid #f0f0f0;
          padding-top: 16px;
          margin-top: 8px;
        }
        .checkout-summary-label {
          color: #666;
        }
        .checkout-summary-value {
          color: #333;
          font-weight: 600;
        }
        .checkout-summary-value.total {
          color: #ee4d2d;
          font-size: 20px;
        }
        .checkout-place-order {
          background: #ee4d2d;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          width: 100%;
          cursor: pointer;
          margin-top: 20px;
        }
        .checkout-place-order:hover:not(:disabled) {
          background: #d63f21;
        }
        .checkout-place-order:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .checkout-terms {
          font-size: 12px;
          color: #666;
          text-align: center;
          margin-top: 12px;
          line-height: 1.6;
        }
        .checkout-terms-link {
          color: #ee4d2d;
          text-decoration: none;
        }
        .checkout-chat-float {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #ee4d2d;
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 1000;
        }
        .modal.show { display: block !important; }
        .modal-backdrop { z-index: 10000 !important; }
      `}</style>

      <div className="checkout-page">
        {/* Header */}
        <div className="checkout-header">
          <div className="checkout-header-content">
            <div className="checkout-logo">
              <span>🛍️</span>
              <span>Shopee</span>
            </div>
            <div className="checkout-logo-separator"></div>
            <span style={{ color: '#ee4d2d', fontSize: '16px', fontWeight: 600 }}>Thanh Toán</span>
          </div>
        </div>

        <div className="checkout-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px' }}>
            <div>
              {/* Shipping Address */}
              <div className="checkout-section">
                <div className="checkout-section-title">
                  <span>📍</span>
                  {t('checkoutPage.shippingAddress')}
                  {addressLoading && (
                    <small className="text-muted">({t('checkout.loading')})</small>
                  )}
                </div>
                {addressLoading ? (
                  <div style={{ color: '#666', fontSize: '14px', padding: '12px' }}>
                    {t('checkout.loadingAddresses')}
                  </div>
                ) : addresses.length > 0 ? (
                  selectedAddress ? (
                    <div className="checkout-address">
                      <div className="checkout-address-info">
                        <div className="checkout-address-name">
                          {selectedAddress.recipientName} (+84) {selectedAddress.recipientPhone?.replace(/\s/g, '') || 'N/A'}
                        </div>
                        <div className="checkout-address-details">
                          {selectedAddress.streetAddress || ''}<br />
                          {selectedAddress.province || ''}
                        </div>
                      </div>
                      <div className="checkout-address-actions">
                        {selectedAddress.isDefault && (
                          <button className="checkout-btn-default">Mặc Định</button>
                        )}
                        <a className="checkout-link" onClick={handleOpenAddressModal}>Thay Đổi</a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      {t('checkout.noAddressSelected')}
                      <div style={{ marginTop: '12px' }}>
                        <a className="checkout-link" onClick={handleOpenAddressModal}>
                          {t('checkout.selectAddress')}
                        </a>
                      </div>
                    </div>
                  )
                ) : (
                  <div style={{ color: '#666', fontSize: '14px', padding: '12px' }}>
                    <p>{t('checkout.noAddressesFound')}</p>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={() => navigate("/information/address")}
                      style={{ marginTop: '8px' }}
                    >
                      {t('checkout.addAddress')}
                    </button>
                  </div>
                )}
              </div>

              {/* Products */}
              {selectedItems.length > 0 && (
                <div className="checkout-section">
                  <div className="checkout-section-title">{t('checkoutPage.products')}</div>
                  
                  {Object.entries(itemsByShop).map(([shopName, shopItems]) => (
                    <div key={shopName}>
                      {/* Product Header with Favorite badge */}
                      <div className="checkout-product-header">
                        <span className="checkout-favorite-badge">Yêu thích+</span>
                        <span className="checkout-shop-name">{shopName}</span>
                        <button className="checkout-chat-btn">
                          💬 Chat ngay
                        </button>
                      </div>

                      {shopItems.map((item) => {
                        const pid = item.productId ?? item.id;
                        const img = imageUrls[pid] ?? imgFallback;
                        return (
                          <div key={pid} className="checkout-product-item">
                            <img
                              src={img || imgFallback}
                              alt={productNames[pid] || item.productName || "Product"}
                              className="checkout-product-image"
                              onError={(e) => (e.currentTarget.src = imgFallback)}
                            />
                            <div className="checkout-product-info">
                              <div className="checkout-product-name">
                                {productNames[pid] || item.productName || pid}
                              </div>
                              <div className="checkout-product-details">
                                <div className="checkout-product-detail-item">
                                  <span className="checkout-product-detail-label">{t('checkoutPage.classification')}</span>
                                  <span className="checkout-product-detail-value">{item.sizeName || 'N/A'}</span>
                                </div>
                                <div className="checkout-product-detail-item">
                                  <span className="checkout-product-detail-label">{t('checkoutPage.unitPrice')}</span>
                                  <span className="checkout-product-detail-value">{formatVND(item.unitPrice || item.price || 0)}</span>
                                </div>
                                <div className="checkout-product-detail-item">
                                  <span className="checkout-product-detail-label">{t('checkoutPage.quantity')}</span>
                                  <span className="checkout-product-detail-value">{item.quantity}</span>
                                </div>
                                <div className="checkout-product-detail-item">
                                  <span className="checkout-product-detail-label">{t('checkoutPage.subtotal')}</span>
                                  <span className="checkout-product-detail-value" style={{ color: '#ee4d2d' }}>
                                    {formatVND((item.unitPrice || item.price || 0) * item.quantity)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Device Insurance */}
                      <div className="checkout-insurance">
                        <input type="checkbox" className="checkout-insurance-checkbox" />
                        <div className="checkout-insurance-content">
                          <div className="checkout-insurance-title">
                            {t('checkoutPage.deviceInsurance')}
                          </div>
                          <div className="checkout-insurance-desc">
                            {t('checkoutPage.insuranceDescription')}
                          </div>
                          <div className="checkout-insurance-price">
                            13.999₫ | {t('checkoutPage.quantity')}: 1 | {t('checkoutPage.subtotal')}: 13.999₫
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Shipping Method */}
              <div className="checkout-section">
                <div className="checkout-shipping-label">
                  {t('checkoutPage.shippingMethod')}: <span style={{ color: '#ee4d2d', fontWeight: 600 }}>Nhanh</span>
                </div>
                <div className="checkout-shipping-method">
                  <div className="checkout-shipping-info">
                    <div className="checkout-shipping-badge">
                      🚚 {t('checkoutPage.deliveryEstimate')} 18 Th12 - 19 Th12
                    </div>
                    <div className="checkout-shipping-details">
                      Nhận Voucher trị giá 15.000₫ nếu đơn hàng được giao đến bạn sau ngày 19 Tháng 12 2025. :)
                    </div>
                    <a className="checkout-link" style={{ marginTop: '8px', display: 'inline-block' }}>
                      {t('checkoutPage.change')}
                    </a>
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        {t('checkoutPage.inspectOnDelivery')}
                      </span>
                    </div>
                  </div>
                  <div className="checkout-shipping-fee">
                    {calculatingShippingFee ? (
                      <small className="text-muted">{t('checkout.calculating')}</small>
                    ) : (
                      formatVND(shippingFee)
                    )}
                  </div>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#333' }}>
                    <span>{t('checkoutPage.totalAmount')} ({selectedItems.length} {t('checkoutPage.products')}):</span>
                    <span style={{ color: '#ee4d2d', fontWeight: 600, fontSize: '16px' }}>
                      {formatVND(subtotal + shippingFee)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Voucher Section */}
              <div className="checkout-section">
                <div className="checkout-section-title">
                  <span>🎫</span>
                  Mã Voucher
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã voucher (VD: HEHE)"
                    disabled={!!appliedVoucher}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: appliedVoucher ? '#f5f5f5' : '#fff'
                    }}
                  />
                  {!appliedVoucher ? (
                    <button
                      onClick={handleApplyVoucher}
                      disabled={voucherLoading || !voucherCode.trim()}
                      style={{
                        padding: '12px 24px',
                        background: voucherLoading || !voucherCode.trim() ? '#ccc' : '#ee4d2d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: voucherLoading || !voucherCode.trim() ? 'not-allowed' : 'pointer',
                        minWidth: '120px'
                      }}
                    >
                      {voucherLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveVoucher}
                      style={{
                        padding: '12px 24px',
                        background: '#fff',
                        color: '#ee4d2d',
                        border: '1px solid #ee4d2d',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        minWidth: '120px'
                      }}
                    >
                      Hủy voucher
                    </button>
                  )}
                </div>
                {appliedVoucher && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px 16px',
                    background: '#e8f5e9',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#4caf50', fontSize: '18px' }}>✓</span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#2e7d32' }}>
                        {appliedVoucher.code} - {appliedVoucher.title}
                      </div>
                      <div style={{ fontSize: '13px', color: '#4caf50' }}>
                        Giảm {formatVND(appliedVoucher.discount)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method - Only COD and VNPAY */}
              <div className="checkout-section">
                <div className="checkout-section-title">{t('checkoutPage.paymentMethod')}</div>
                <div className="checkout-payment-tabs">
                  <div
                    className={`checkout-payment-tab ${paymentMethod === 'COD' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    {t('checkoutPage.cashOnDelivery')}
                  </div>
                  <div
                    className={`checkout-payment-tab ${paymentMethod === 'VNPAY' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('VNPAY')}
                  >
                    {t('checkout.vnpay')}
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <div
                    className={`checkout-payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <input
                      type="radio"
                      className="checkout-payment-radio"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <div className="checkout-payment-info">
                      <div className="checkout-payment-name">
                        {t('checkout.cod')}
                      </div>
                      <div className="checkout-payment-details">
                        {t('checkout.codDescription')}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`checkout-payment-option ${paymentMethod === 'VNPAY' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('VNPAY')}
                  >
                    <input
                      type="radio"
                      className="checkout-payment-radio"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={() => setPaymentMethod('VNPAY')}
                    />
                    <div className="checkout-payment-info">
                      <div className="checkout-payment-name">
                        {t('checkout.vnpay')}
                      </div>
                      <div className="checkout-payment-details">
                        {t('checkout.vnpayDescription')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="checkout-summary">
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">{t('checkoutPage.totalMerchandise')}</span>
                <span className="checkout-summary-value">{formatVND(subtotal)}</span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">{t('checkoutPage.totalShippingFee')}</span>
                <span className="checkout-summary-value">
                  {calculatingShippingFee ? (
                    <small className="text-muted">{t('checkout.calculating')}</small>
                  ) : (
                    formatVND(shippingFee)
                  )}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">{t('checkoutPage.totalVoucherDiscount')}</span>
                <span className="checkout-summary-value" style={{ color: '#ee4d2d' }}>
                  -{formatVND(voucherDiscount)}
                </span>
              </div>
              <div className="checkout-summary-row total">
                <span className="checkout-summary-label">{t('checkoutPage.totalPayment')}</span>
                <span className="checkout-summary-value total">{formatVND(total)}</span>
              </div>
              <button 
                className="checkout-place-order"
                onClick={handlePlaceOrder}
                disabled={orderLoading || selectedItems.length === 0 || !selectedAddressId}
                title={
                  selectedItems.length === 0
                    ? t('checkout.pleaseSelectAtLeastOneItem')
                    : !selectedAddressId
                    ? t('checkout.pleaseSelectDeliveryAddress')
                    : ""
                }
              >
                {orderLoading ? t('checkout.creatingOrder') : t('checkoutPage.placeOrder')}
              </button>
              <div className="checkout-terms">
                {t('checkoutPage.termsAgreement')}{' '}
                <a href="#" className="checkout-terms-link">
                  {t('checkoutPage.terms')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        <button className="checkout-chat-float">
          💬 Chat
        </button>

        {/* Address Selection Modal */}
        {showAddressModal &&
          ReactDOM.createPortal(
            <div
              className="modal show d-block"
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 10000,
              }}
              aria-modal="true"
              role="dialog"
            >
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{t('cart.address.selectDeliveryAddress')}</h5>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={refreshAddresses}
                        disabled={addressLoading}
                        title={t('cart.address.refresh')}
                      >
                        <i
                          className={`fa fa-refresh ${
                            addressLoading ? "fa-spin" : ""
                          }`}
                        ></i>
                      </button>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowAddressModal(false)}
                        aria-label="Close"
                      />
                    </div>
                  </div>

                  <div className="modal-body">
                    {addresses.length === 0 ? (
                      <div className="text-center">
                        <p className="text-muted mb-3">
                          {t('cart.address.noAddressesFound')}
                        </p>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            setShowAddressModal(false);
                            navigate("/information/address");
                          }}
                        >
                          {t('cart.address.addAddress')}
                        </button>
                      </div>
                    ) : (
                      <div className="row">
                        {addresses.map((a) => (
                          <div key={a.id} className="col-md-6 mb-3">
                            <div
                              className={`card h-100 ${
                                modalSelectedAddressId === a.id
                                  ? "border-primary"
                                  : ""
                              }`}
                              onClick={() => handleAddressSelect(a.id)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                  <h6 className="card-title">
                                    {a.addressName || t('cart.address.unnamedAddress')}
                                  </h6>
                                  {a.isDefault && (
                                    <span className="badge bg-primary">
                                      {t('cart.address.default')}
                                    </span>
                                  )}
                                </div>
                                <p className="card-text">
                                  <strong>{a.recipientName}</strong>
                                  <br />
                                  {a.streetAddress}
                                  <br />
                                  {a.province}
                                  <br />
                                  Phone: {a.recipientPhone}
                                </p>
                                {modalSelectedAddressId === a.id && (
                                  <div className="text-primary">
                                    <i className="fa fa-check-circle"></i>{" "}
                                    {t('cart.address.selected')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddressModal(false)}
                    >
                      {t('common.cancel')}
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleConfirmSelection}
                        disabled={!modalSelectedAddressId}
                      >
                        {t('cart.address.confirmSelection')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </>
  );
}
