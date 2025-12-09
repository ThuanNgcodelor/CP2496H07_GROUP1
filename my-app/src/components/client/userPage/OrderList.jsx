import React, { useEffect, useMemo, useState } from "react";
import { openRatingMockModal } from "./RatingMockModal.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getOrdersByUser, cancelOrder } from "../../../api/order.js";
import { fetchImageById } from "../../../api/image.js";
import { fetchProductById } from "../../../api/product.js";
import Loading from "../Loading.jsx";

const PAGE_SIZE = 5;

const STATUS_CONFIG = {
  ALL: { label: "All", color: "#555", bg: "#f8f8f8" },
  PENDING: { label: "Pending", color: "#ee4d2d", bg: "#fff5f0" },
  PROCESSING: { label: "Processing", color: "#2673dd", bg: "#e8f4ff" },
  SHIPPED: { label: "Shipped", color: "#2673dd", bg: "#e8f4ff" },
  DELIVERED: { label: "Delivered", color: "#26aa99", bg: "#e8f9f7" },
  COMPLETED: { label: "Completed", color: "#26aa99", bg: "#e8f9f7" },
  CANCELLED: { label: "Cancelled", color: "#999", bg: "#f5f5f5" },
  RETURNED: { label: "Return/Refund", color: "#ee4d2d", bg: "#fff5f0" }
};

const STATUS_NUMERIC_MAP = {
  0: "PENDING",
  1: "PROCESSING",
  2: "SHIPPED",
  3: "DELIVERED",
  4: "CANCELLED",
  5: "COMPLETED",
  6: "RETURNED",
};

const normalizeStatus = (status) => {
  if (status === null || status === undefined) return "";
  if (typeof status === "number") {
    return STATUS_NUMERIC_MAP[status] || String(status);
  }
  const str = String(status).toUpperCase();
  if (STATUS_NUMERIC_MAP[str]) return STATUS_NUMERIC_MAP[str];
  return str;
};

const formatVND = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

const fmtDateTime = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return "-";
  }
};

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total, total - 1, current, current - 1, current + 1]);
  const arr = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withEllipsis = [];
  for (let i = 0; i < arr.length; i++) {
    withEllipsis.push(arr[i]);
    if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) withEllipsis.push("…");
  }
  return withEllipsis;
}

export default function OrderList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [imageUrls, setImageUrls] = useState({});
  const [confirmModal, setConfirmModal] = useState({ open: false, orderId: null });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOrdersByUser();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Cannot load orders. Please try again.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load images for order items
  useEffect(() => {
    if (orders.length === 0) return;

    let isActive = true;
    const urls = {};
    const productCache = new Map();

    const loadImages = async () => {
      const imagePromises = [];
      
      orders.forEach((order) => {
        (order.orderItems || []).forEach((item) => {
          const itemKey = item.id || `${item.productId}-${item.sizeId}`;
          let imageId = item.imageId;
          
          // If no imageId, try to fetch from product
          if (!imageId && item.productId) {
            imagePromises.push(
              (async () => {
                try {
                  let product = productCache.get(item.productId);
                  if (!product) {
                    const prodRes = await fetchProductById(item.productId);
                    product = prodRes?.data;
                    if (product) productCache.set(item.productId, product);
                  }
                  imageId = product?.imageId || null;
                  
                  if (imageId && !urls[imageId]) {
                    try {
                      const res = await fetchImageById(imageId);
                      const blob = new Blob([res.data], {
                        type: res.headers["content-type"] || "image/jpeg",
                      });
                      const url = URL.createObjectURL(blob);
                      urls[imageId] = url;
                      urls[itemKey] = url; // Also store by item key
                    } catch {
                      urls[imageId] = null;
                      urls[itemKey] = null;
                    }
                  } else {
                    urls[itemKey] = urls[imageId] || null;
                  }
                } catch {
                  urls[itemKey] = null;
                }
              })()
            );
          } else if (imageId && !urls[imageId]) {
            imagePromises.push(
              fetchImageById(imageId)
                .then((res) => {
                  const blob = new Blob([res.data], {
                    type: res.headers["content-type"] || "image/jpeg",
                  });
                  const url = URL.createObjectURL(blob);
                  urls[imageId] = url;
                  urls[itemKey] = url; // Also store by item key
                })
                .catch(() => {
                  urls[imageId] = null;
                  urls[itemKey] = null;
                })
            );
          } else if (imageId && urls[imageId]) {
            urls[itemKey] = urls[imageId];
          }
        });
      });

      await Promise.all(imagePromises);

      if (isActive) {
        setImageUrls(urls);
      }
    };

    loadImages();

    return () => {
      isActive = false;
      Object.values(imageUrls).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [orders]);

  // Auto expand order from URL
  useEffect(() => {
    const orderIdFromUrl = searchParams.get('orderId');
    if (orderIdFromUrl && orders.length > 0) {
      setTimeout(() => {
        const element = document.querySelector(`[data-order-id="${orderIdFromUrl}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [searchParams, orders]);

  // Filter orders by tab
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by status tab
    if (activeTab !== "ALL") {
      result = result.filter(order => normalizeStatus(order.orderStatus) === activeTab);
    }

    return result;
  }, [orders, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredOrders, page]
  );

  const pageNumbers = getPageNumbers(page, totalPages);

  const getStatusBadge = (status) => {
    const normalized = normalizeStatus(status);
    const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.PENDING;
    return (
      <span
        style={{
          color: config.color,
          background: config.bg,
          padding: '4px 12px',
          borderRadius: '2px',
          fontSize: '13px',
          fontWeight: 500,
          textTransform: 'uppercase'
        }}
      >
        {config.label}
      </span>
    );
  };

  const handleViewShop = (order) => {
    // Try to navigate to shop page, fallback to home if shopId not available
    if (order.shopId) {
      navigate(`/shop/${order.shopId}`);
    } else {
      navigate('/shop');
    }
  };

  const [successMessage, setSuccessMessage] = useState('');

  const handleCancelOrder = (orderId) => {
    setConfirmModal({ open: true, orderId, reason: "" });
  };

  const closeConfirm = () => setConfirmModal({ open: false, orderId: null, reason: "" });

  const confirmCancel = async () => {
    if (!confirmModal.orderId) return;
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const reasonText = confirmModal.reason?.trim() || '';
      await cancelOrder(confirmModal.orderId, reasonText);
      setSuccessMessage('Order cancelled successfully');
      const data = await getOrdersByUser();
      setOrders(Array.isArray(data) ? data : []);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      setError(e.message || 'Failed to cancel order. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  return (
    <div style={{ padding: '0', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', background: 'white', width: '100%' }}>
        <h4 style={{ fontSize: '20px', fontWeight: 500, color: '#222', margin: 0 }}>My Orders</h4>
      </div>
      
      <div style={{ background: 'white', minHeight: '400px', width: '100%', margin: 0 }}>
        {/* Status Tabs - Shopee Style */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div className="d-flex" style={{ overflowX: 'auto', padding: '0 24px' }}>
            {Object.keys(STATUS_CONFIG).map(status => (
              <button
                key={status}
                onClick={() => {
                  setActiveTab(status);
                  setPage(1);
                }}
                style={{
                  padding: '16px 20px',
                  border: 'none',
                  background: 'transparent',
                  color: activeTab === status ? '#ee4d2d' : '#555',
                  borderBottom: activeTab === status ? '2px solid #ee4d2d' : '2px solid transparent',
                  fontWeight: activeTab === status ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                {STATUS_CONFIG[status]?.label || status}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
            <Loading />
          </div>
        )}

        {error && (
          <div style={{ padding: '16px 24px', background: 'white' }}>
            <div className="alert alert-danger" style={{ margin: 0 }}>{error}</div>
          </div>
        )}

        {successMessage && (
          <div style={{ padding: '16px 24px', background: 'white' }}>
            <div className="alert alert-success" style={{ margin: 0 }}>{successMessage}</div>
          </div>
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-5" style={{ background: 'white', padding: '60px 20px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 16px',
              background: '#f5f5f5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fa fa-clipboard-list" style={{ fontSize: '48px', color: '#ddd' }}></i>
            </div>
            <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
              No orders yet
            </p>
          </div>
        )}

        {!loading && !error && pagedOrders.length > 0 && (
          <>
            {/* Order Cards - Shopee Style */}
            <div style={{ padding: '24px', background: 'white' }}>
              {pagedOrders.map((order) => (
                <div
                  key={order.id}
                  data-order-id={order.id}
                  style={{
                    background: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Order Header - Shopee Style */}
                  <div
                    className="d-flex justify-content-between align-items-center p-3"
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                      background: '#fafafa'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#222' }}>
                        MERIER STORE
                      </span>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleViewShop(order)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #ee4d2d',
                          color: '#ee4d2d',
                          fontSize: '12px',
                          padding: '4px 12px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ee4d2d';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#ee4d2d';
                        }}
                      >
                        <i className="fa fa-comment me-1"></i> Chat
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleViewShop(order)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #ddd',
                          color: '#555',
                          fontSize: '12px',
                          padding: '4px 12px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#ee4d2d';
                          e.currentTarget.style.color = '#ee4d2d';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#ddd';
                          e.currentTarget.style.color = '#555';
                        }}
                      >
                        View Shop
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {(normalizeStatus(order.orderStatus) === 'COMPLETED' || normalizeStatus(order.orderStatus) === 'DELIVERED') && (
                        <span style={{ fontSize: '12px', color: '#26aa99' }}>
                          <i className="fa fa-truck me-1"></i> Delivery successful
                        </span>
                      )}
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>

                  {/* Order Items - Shopee Style */}
                  <div className="p-3">
                    {(order.orderItems || []).map((item, idx) => {
                      const itemKey = item.id || `${item.productId}-${item.sizeId}`;
                      const imgUrl = imageUrls[item.imageId] || imageUrls[itemKey] || null;
                      return (
                        <div
                          key={item.id || idx}
                          className="d-flex gap-3 mb-3 pb-3"
                          style={{
                            borderBottom: idx < order.orderItems.length - 1 ? '1px solid #f0f0f0' : 'none'
                          }}
                        >
                          {/* Product Image */}
                          <div
                            style={{
                              width: '80px',
                              height: '80px',
                              border: '1px solid #f0f0f0',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              background: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={item.productName}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div style={{
                              display: imgUrl ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%'
                            }}>
                              <i className="fa fa-image" style={{ fontSize: '24px', color: '#ccc' }}></i>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', color: '#222', marginBottom: '4px', wordBreak: 'break-word' }}>
                              {item.productName}
                            </div>
                            {item.sizeName && (
                              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                                Variant: {item.sizeName}
                              </div>
                            )}
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              x{item.quantity}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-end" style={{ minWidth: '120px', flexShrink: 0 }}>
                            {item.originalPrice && item.originalPrice > item.unitPrice && (
                              <div style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through', marginBottom: '4px' }}>
                                {formatVND(item.originalPrice)}
                              </div>
                            )}
                            <div style={{ fontSize: '14px', color: '#ee4d2d', fontWeight: 500 }}>
                              {formatVND(item.unitPrice)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer - Shopee Style */}
                  <div
                    className="d-flex justify-content-between align-items-center p-3"
                    style={{
                      borderTop: '1px solid #f0f0f0',
                      background: '#fffaf5'
                    }}
                  >
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <i className="fa fa-calendar me-1"></i> {fmtDateTime(order.updateTimestamp)}
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-end" style={{ fontSize: '12px' }}>
                        <div style={{ fontSize: '18px', color: '#ee4d2d', fontWeight: 500 }}>
                          {formatVND((order.totalPrice || 0) + (order.shippingFee || 0))}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        {normalizeStatus(order.orderStatus) === 'DELIVERED' && (
                          <>
                            <button
                              className="btn"
                              style={{
                                background: '#ee4d2d',
                                color: 'white',
                                border: 'none',
                                padding: '8px 20px',
                                fontSize: '13px',
                                borderRadius: '2px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f05d40'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#ee4d2d'}
                            >
                              Buy Again
                            </button>
                            <button
                              className="btn"
                              style={{
                                background: 'white',
                                color: '#ee4d2d',
                                border: '1px solid #ee4d2d',
                                padding: '8px 16px',
                                fontSize: '13px',
                                borderRadius: '2px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f0'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                              onClick={() => openRatingMockModal('view')}
                            >
                              View Rating (mock)
                            </button>
                            <button
                              className="btn"
                              style={{
                                background: 'white',
                                color: '#555',
                                border: '1px solid #ddd',
                                padding: '8px 16px',
                                fontSize: '13px',
                                borderRadius: '2px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#ee4d2d';
                                e.currentTarget.style.color = '#ee4d2d';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#ddd';
                                e.currentTarget.style.color = '#555';
                              }}
                              onClick={() => openRatingMockModal('rate')}
                              /*
                                  title: 'Đánh giá sản phẩm (mock)',
                                  width: 720,
                                  html: `
                                    <div style="text-align:left;font-size:13px;color:#222;">
                                      <div style="background:#fff7e6;border:1px solid #ffd591;padding:10px 12px;border-radius:4px;margin-bottom:12px;color:#b46900;font-size:12px;">
                                        Chia sẻ cảm nhận của bạn về tất cả sản phẩm trong đơn hàng để nhận Shopee Xu (mock).
                                      </div>
                                      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;">
                                        <div style="width:64px;height:64px;border:1px solid #f0f0f0;border-radius:4px;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#fafafa;">
                                          <i class="fa fa-image" style="color:#ccc;font-size:24px;"></i>
                                        </div>
                                        <div style="flex:1;">
                                          <div style="font-weight:600;margin-bottom:6px;">Tên sản phẩm (mock)</div>
                                          <div style="color:#999;font-size:12px;margin-bottom:6px;">Mua từ: Mock Shop</div>
                                          <div style="display:flex;gap:6px;color:#facc15;font-size:20px;margin-bottom:10px;">★★★★★</div>
                                          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                                            ${['Chất lượng sản phẩm tuyệt vời', 'Đóng gói đẹp', 'Giao hàng nhanh', 'Shop phục vụ tốt', 'Rất đáng tiền'].map(t => `
                                              <span style="border:1px solid #ddd;padding:6px 10px;border-radius:20px;font-size:12px;background:#f9f9f9;">${t}</span>
                                            `).join('')}
                                          </div>
                                          <textarea style="width:100%;min-height:96px;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:13px;" placeholder="Hãy chia sẻ cảm nhận của bạn (mock)"></textarea>
                                          <div style="display:flex;align-items-center;gap:8px;margin-top:10px;color:#999;font-size:12px;">
                                            <div style="width:40px;height:40px;border:1px dashed #ddd;border-radius:4px;display:flex;align-items:center;justify-content:center;">
                                              <i class="fa fa-plus"></i>
                                            </div>
                                            <span>Thêm tối đa 5 hình & 1 video để nhận Shopee Xu (mock)</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  `,
                                  confirmButtonText: 'Submit (mock)',
                                  confirmButtonColor: '#ee4d2d',
                                  showCancelButton: true,
                                  cancelButtonText: 'Close',
                                  focusConfirm: false
                                });
                              }}
                              */
                            >
                              Rate Now (mock)
                            </button>
                          </>
                        )}
                        {order.orderStatus === 'PENDING' && (
                          <>
                            <button
                              className="btn"
                              onClick={() => handleCancelOrder(order.id)}
                              style={{
                                background: 'white',
                                color: '#ee4d2d',
                                border: '1px solid #ee4d2d',
                                padding: '8px 20px',
                                fontSize: '13px',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#fff5f0';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                              }}
                            >
                              Cancel Order
                            </button>
                            <button
                              className="btn"
                              style={{
                                background: 'white',
                                color: '#555',
                                border: '1px solid #ddd',
                                padding: '8px 20px',
                                fontSize: '13px',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#ee4d2d';
                                e.currentTarget.style.color = '#ee4d2d';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#ddd';
                                e.currentTarget.style.color = '#555';
                              }}
                            >
                              Contact Seller
                            </button>
                          </>
                        )}
                        {order.orderStatus === 'APPROVED' && (
                          <button
                            className="btn"
                            onClick={() => handleCancelOrder(order.id)}
                            style={{
                              background: 'white',
                              color: '#ee4d2d',
                              border: '1px solid #ee4d2d',
                              padding: '8px 20px',
                              fontSize: '13px',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#fff5f0';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                            }}
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: '24px', background: 'white', borderTop: '1px solid #f0f0f0' }}>
                <nav>
                  <ul className="pagination justify-content-center mb-0" style={{ gap: '4px' }}>
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                          border: '1px solid #ddd',
                          color: page === 1 ? '#ccc' : '#555',
                          background: 'white',
                          padding: '8px 12px',
                          cursor: page === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        ‹
                      </button>
                    </li>

                    {pageNumbers.map((p, i) =>
                      p === "…" ? (
                        <li key={`el-${i}`} className="page-item disabled">
                          <span className="page-link" style={{ border: '1px solid #ddd', color: '#999', padding: '8px 12px' }}>…</span>
                        </li>
                      ) : (
                        <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setPage(p)}
                            style={{
                              border: '1px solid #ddd',
                              color: p === page ? 'white' : '#555',
                              background: p === page ? '#ee4d2d' : 'white',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              minWidth: '40px'
                            }}
                          >
                            {p}
                          </button>
                        </li>
                      )
                    )}

                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{
                          border: '1px solid #ddd',
                          color: page === totalPages ? '#ccc' : '#555',
                          background: 'white',
                          padding: '8px 12px',
                          cursor: page === totalPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirm cancel modal */}
      {confirmModal.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 4,
              width: '100%',
              maxWidth: 420,
              padding: '20px 24px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            }}
          >
            <p style={{ margin: '0 0 20px 0', fontSize: 16, color: '#333', textAlign: 'center' }}>
            Are you sure you want to cancel this order?
            </p>
            <textarea
              placeholder="Reason (optional)"
              value={confirmModal.reason || ''}
              onChange={(e) => setConfirmModal(prev => ({ ...prev, reason: e.target.value }))}
              style={{
                width: '100%',
                minHeight: 80,
                marginBottom: 16,
                padding: '10px 12px',
                borderRadius: 4,
                border: '1px solid #ddd',
                fontSize: 13,
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={closeConfirm}
                style={{
                  minWidth: 100,
                  padding: '10px 16px',
                  border: '1px solid #ddd',
                  background: 'white',
                  color: '#555',
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                style={{
                  minWidth: 100,
                  padding: '10px 16px',
                  border: 'none',
                  background: '#ee4d2d',
                  color: 'white',
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
