import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/client/Header.jsx";
import CommentsBox from "../../components/client/product/CommentsBox.jsx";
import ShopInfoBar from "../../components/client/product/ShopInfoBar.jsx";
import ChatBotWidget from "../../components/client/ChatBotWidget.jsx";
import { fetchProductById, fetchProductImageById, fetchAddToCart } from "../../api/product.js";
import { getCart, getShopOwnerByUserId } from "../../api/user.js";
import { useCart } from "../../contexts/CartContext.jsx";
import imgFallback from "../../assets/images/shop/6.png";

const USE_OBJECT_URL = true;

const arrayBufferToDataUrl = (buffer, contentType) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return `data:${contentType};base64,${base64}`;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCart } = useCart();
  const [product, setProduct] = useState(null);
  const [shopOwner, setShopOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgUrl, setImgUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState([]); // All images/videos
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredThumbnailIndex, setHoveredThumbnailIndex] = useState(null); // For hover preview
  const [lightboxOpen, setLightboxOpen] = useState(false); // Lightbox modal
  const [lightboxIndex, setLightboxIndex] = useState(0); // Current image in lightbox
  const createdUrlsRef = useRef([]);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = await fetchProductById(id);
        const p = res.data;
        setProduct(p);

        // Load shop owner info if userId exists
        if (p?.userId) {
          try {
            const shopData = await getShopOwnerByUserId(p.userId);
            setShopOwner(shopData);
          } catch (err) {
            // Shop owner loading failed, continue without it
          }
        }

        // Load all images/videos
        const allImageIds = [];
        if (p?.imageId) allImageIds.push(p.imageId);
        if (Array.isArray(p?.imageIds) && p.imageIds.length > 0) {
          p.imageIds.forEach(id => {
            if (id && !allImageIds.includes(id)) {
              allImageIds.push(id);
            }
          });
        }

        if (allImageIds.length > 0) {
          const loadedUrls = [];
          for (let i = 0; i < allImageIds.length; i++) {
            try {
              const imgRes = await fetchProductImageById(allImageIds[i]);
            const contentType = imgRes.headers["content-type"] || "image/jpeg";
            let url;
            if (USE_OBJECT_URL && imgRes.data) {
              const blob = new Blob([imgRes.data], { type: contentType });
              url = URL.createObjectURL(blob);
              createdUrlsRef.current.push(url);
            } else {
              url = arrayBufferToDataUrl(imgRes.data, contentType);
            }
              loadedUrls.push({ url, type: contentType.startsWith('video/') ? 'video' : 'image' });
              if (i === 0) {
            setImgUrl(url);
              }
          } catch {
              // Skip failed images
            }
          }
          setImageUrls(loadedUrls);
          if (loadedUrls.length > 0 && !imgUrl) {
            setImgUrl(loadedUrls[0].url);
          }
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      if (USE_OBJECT_URL && createdUrlsRef.current.length) {
        createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        createdUrlsRef.current = [];
      }
    };
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, imageUrls.length]);

  const priceDisplay = useMemo(() => {
    if (!product) return "";
    const { price, originalPrice, discountPercent } = product;
    if (discountPercent && discountPercent > 0 && originalPrice && originalPrice > price) {
      return (
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4 fw-bold">
            {price.toLocaleString("vi-VN")} ₫
          </span>
          <span className="text-decoration-line-through text-muted">
            {originalPrice.toLocaleString("vi-VN")} ₫
          </span>
          <span className="badge bg-danger">-{discountPercent}%</span>
        </div>
      );
    }
    return (
      <span className="fs-4 fw-bold">
        {(product.price || 0).toLocaleString("vi-VN")} ₫
      </span>
    );
  }, [product]);

  const onAddToCart = async () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSizeId) {
      setError("Please select a size before adding to cart.");
      return;
    }
    
    try {
      setPosting(true);
      setError(null);
      
      const requestData = { 
        productId: product.id, 
        quantity: Number(qty) || 1 
      };
      
      if (selectedSizeId) {
        requestData.sizeId = selectedSizeId;
      }
      
      await fetchAddToCart(requestData);
      const cart = await getCart();
      setCart(cart);
      
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
    } catch (e) {
      if (e?.response?.status === 403) {
        setError("You need to sign in to add items to the cart.");
      } else {
        setError(e?.response?.data?.message || e.message || "Failed to add to cart");
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="wrapper">
      <Header />
      <main className="main-content">
        <div className="container py-4">
          {loading && <p>Loading product...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {product && (
            <div className="row g-4" style={{ display: 'flex', alignItems: 'stretch' }}>
              {/* Product Image Gallery - Left Side */}
              <div className="col-md-5" style={{ display: 'flex' }}>
                <div className="bg-white border rounded-3 p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Main Image/Video Display - Clickable to open lightbox */}
                  <div 
                    className="d-flex justify-content-center align-items-center position-relative mb-3" 
                    style={{ 
                      aspectRatio: '1 / 1',
                      backgroundColor: '#fafafa',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: imageUrls.length > 0 ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (imageUrls.length > 0) {
                        setLightboxIndex(currentImageIndex);
                        setLightboxOpen(true);
                      }
                    }}
                  >
                    {(() => {
                      // Show hovered thumbnail preview if hovering, otherwise show current selected
                      const displayIndex = hoveredThumbnailIndex !== null ? hoveredThumbnailIndex : currentImageIndex;
                      const displayItem = imageUrls.length > 0 && imageUrls[displayIndex] ? imageUrls[displayIndex] : null;
                      
                      if (displayItem) {
                        return displayItem.type === 'video' ? (
                          <video
                            src={displayItem.url}
                            controls
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "cover"
                            }}
                          />
                        ) : (
                          <img
                            src={displayItem.url}
                            onError={(e) => (e.currentTarget.src = imgFallback)}
                            alt={product.name}
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "cover"
                            }}
                          />
                        );
                      }
                      return (
                  <img
                    src={imgUrl || imgFallback}
                    onError={(e) => (e.currentTarget.src = imgFallback)}
                    alt={product.name}
                          style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover"
                          }}
                        />
                      );
                    })()}
                  </div>

                  {/* Thumbnails with Navigation */}
                  {imageUrls.length > 1 && (
                    <div className="position-relative">
                      <div 
                        className="d-flex gap-2 overflow-auto" 
                        style={{ 
                          maxWidth: '100%',
                          scrollBehavior: 'smooth',
                          padding: '0 40px'
                        }}
                        id="thumbnail-scroll"
                      >
                        {imageUrls.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            onMouseEnter={() => setHoveredThumbnailIndex(index)}
                            onMouseLeave={() => setHoveredThumbnailIndex(null)}
                            style={{
                              minWidth: '80px',
                              height: '80px',
                              border: currentImageIndex === index ? '3px solid #ee4d2d' : '1px solid #ddd',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              flexShrink: 0,
                              backgroundColor: '#fff',
                              transition: 'border-color 0.2s'
                            }}
                          >
                            {item.type === 'video' ? (
                              <video
                                src={item.url}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                muted
                              />
                            ) : (
                              <img
                                src={item.url}
                                alt={`${product.name} ${index + 1}`}
                                onError={(e) => (e.currentTarget.src = imgFallback)}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Navigation buttons for thumbnails */}
                      {imageUrls.length > 5 && (
                        <>
                          <button
                            type="button"
                            className="btn btn-light position-absolute"
                            style={{
                              left: '0',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10,
                              padding: 0,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => {
                              const container = document.getElementById('thumbnail-scroll');
                              if (container) {
                                container.scrollBy({ left: -100, behavior: 'smooth' });
                              }
                            }}
                          >
                            <i className="fa fa-chevron-left" style={{ fontSize: '12px' }}></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-light position-absolute"
                            style={{
                              right: '0',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10,
                              padding: 0,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => {
                              const container = document.getElementById('thumbnail-scroll');
                              if (container) {
                                container.scrollBy({ left: 100, behavior: 'smooth' });
                              }
                            }}
                          >
                            <i className="fa fa-chevron-right" style={{ fontSize: '12px' }}></i>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {/* Spacer to ensure equal height with right column */}
                  <div style={{ flexGrow: 1 }}></div>
                </div>
              </div>

              {/* Product Info - Right Side */}
              <div className="col-md-7" style={{ display: 'flex' }}>
                <div className="bg-white border rounded-3 p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Product Name */}
                  <h1 className="mb-3" style={{ fontSize: '1.75rem', fontWeight: 500, lineHeight: 1.4 }}>
                    {product.name}
                  </h1>

                  {/* Creation Date */}
                {product.createdAt && (
                    <div className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>
                      Created: {new Intl.DateTimeFormat('vi-VN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }).format(new Date(product.createdAt))}
                    </div>
                  )}

                   <div className="mb-3 d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-1">
                      <span style={{ color: '#ffc107', fontSize: '1rem' }}>★</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {product.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                      ({product.reviewCount || 0} đánh giá)
                    </span>
                    {product.soldOf > 0 && (
                      <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                        | Đã bán: <strong>{product.soldOf}</strong>
                      </span>
                    )}
                  </div>
                  {/* Price Display */}
                  <div className="mb-4" style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                    {priceDisplay}
                  </div>

                  {/* Rating and Sales Info */}
                  

                  {/* Stock and Status Badges */}
                  <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
                    {product.category?.name && (
                      <span className="badge bg-secondary px-3 py-2" style={{ fontSize: '0.875rem' }}>
                        {product.category.name}
                      </span>
                    )}
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                      Stock: <strong>{selectedSizeId 
                        ? product.sizes?.find(s => s.id === selectedSizeId)?.stock || product.stock || 0
                        : product.stock ?? 0}</strong>
                    </span>
                  </div>

                  {/* Vouchers (Placeholder for future development) */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="fa fa-tag text-danger"></i>
                      <strong style={{ fontSize: '0.9rem' }}>Voucher Của Shop</strong>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-danger" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                        Giảm 2%
                      </span>
                      <span className="badge bg-danger" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                        Giảm 3%
                      </span>
                      {/* Add more vouchers here */}
                    </div>
                  </div>

                  {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-4">
                      <label className="form-label fw-bold mb-2" style={{ fontSize: '1rem' }}>
                        Select Size:
                      </label>
                    <div className="d-flex flex-wrap gap-2">
                        {product.sizes.map((size) => {
                          const isSelected = selectedSizeId === size.id;
                          const isOutOfStock = (size.stock || 0) <= 0;
                          return (
                        <button
                          key={size.id}
                          type="button"
                              className={`btn ${isSelected ? 'btn-danger' : 'btn-outline-secondary'}`}
                              onClick={() => !isOutOfStock && setSelectedSizeId(size.id)}
                              disabled={isOutOfStock}
                              style={{ 
                                minWidth: '80px',
                                padding: '8px 16px',
                                fontSize: '0.875rem',
                                borderWidth: isSelected ? '2px' : '1px',
                                opacity: isOutOfStock ? 0.5 : 1,
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <div>{size.name}</div>
                              <small style={{ fontSize: '0.75rem', display: 'block', marginTop: '2px' }}>
                                {isOutOfStock ? 'Out of stock' : `Stock: ${size.stock}`}
                          </small>
                        </button>
                          );
                        })}
                    </div>
                    {selectedSizeId && (
                        <p className="text-success mt-2 mb-0" style={{ fontSize: '0.875rem' }}>
                          <i className="fa fa-check-circle me-1"></i> Size selected
                      </p>
                    )}
                  </div>
                )}

                  {/* Spacer to push buttons to bottom */}
                  <div style={{ flexGrow: 1 }}></div>

                  {/* Quantity and Action Buttons */}
                  <div className="mt-auto">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <label className="form-label fw-bold mb-0" style={{ fontSize: '1rem', minWidth: '80px' }}>
                        Quantity:
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          style={{ width: '36px', height: '36px', padding: 0 }}
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          disabled={qty <= 1}
                        >
                          <i className="fa fa-minus"></i>
                        </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedSizeId 
                      ? product.sizes?.find(s => s.id === selectedSizeId)?.stock || 1
                      : product.stock || 1}
                    value={qty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const maxQty = selectedSizeId 
                        ? product.sizes?.find(s => s.id === selectedSizeId)?.stock || 1
                        : product.stock || 1;
                            setQty(Math.max(1, Math.min(val || 1, maxQty)));
                          }}
                          className="form-control text-center"
                          style={{ width: '80px', height: '36px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          style={{ width: '36px', height: '36px', padding: 0 }}
                          onClick={() => {
                            const maxQty = selectedSizeId 
                              ? product.sizes?.find(s => s.id === selectedSizeId)?.stock || 1
                              : product.stock || 1;
                            setQty(Math.min(qty + 1, maxQty));
                          }}
                          disabled={qty >= (selectedSizeId 
                            ? product.sizes?.find(s => s.id === selectedSizeId)?.stock || 1
                            : product.stock || 1)}
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                  <button 
                    disabled={posting || (product.sizes?.length > 0 && !selectedSizeId)} 
                        className="btn btn-outline-danger flex-fill py-2 fw-bold"
                        style={{ fontSize: '0.9rem' }}
                    onClick={onAddToCart}
                  >
                    {posting ? (
                      <>
                        <i className="fa fa-spinner fa-spin me-2"></i>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-shopping-cart me-2"></i>
                            ADD TO CART
                          </>
                        )}
                      </button>
                      <button 
                        disabled={posting || (product.sizes?.length > 0 && !selectedSizeId)} 
                        className="btn btn-danger flex-fill py-2 fw-bold"
                        style={{ fontSize: '0.9rem' }}
                        onClick={async () => {
                          if (!product) return;
                          if (product.sizes && product.sizes.length > 0 && !selectedSizeId) {
                            setError("Please select a size before buying.");
                            return;
                          }
                          try {
                            setPosting(true);
                            setError(null);
                            const requestData = { 
                              productId: product.id, 
                              quantity: Number(qty) || 1 
                            };
                            if (selectedSizeId) {
                              requestData.sizeId = selectedSizeId;
                            }
                            await fetchAddToCart(requestData);
                            const cart = await getCart();
                            setCart(cart);
                            window.dispatchEvent(new CustomEvent('cart-updated'));
                            // Navigate to cart with product selection info
                            navigate('/cart', { 
                              state: { 
                                selectProduct: { 
                                  productId: product.id, 
                                  sizeId: selectedSizeId 
                                } 
                              } 
                            });
                          } catch (e) {
                            if (e?.response?.status === 403) {
                              setError("You need to sign in to buy products.");
                            } else {
                              setError(e?.response?.data?.message || e.message || "Failed to add to cart");
                            }
                          } finally {
                            setPosting(false);
                          }
                        }}
                      >
                        {posting ? (
                          <>
                            <i className="fa fa-spinner fa-spin me-2"></i>
                            Processing...
                          </>
                        ) : (
                          <>
                            BUY NOW
                      </>
                    )}
                  </button>
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex align-items-center gap-3">
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Chia sẻ:</span>
                      <div className="d-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-primary"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          title="Share on Facebook"
                        >
                          <i className="fab fa-facebook-f"></i>
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-info"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          title="Share on Twitter"
                        >
                          <i className="fab fa-twitter"></i>
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-danger"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          title="Share on Pinterest"
                        >
                          <i className="fab fa-pinterest"></i>
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-secondary"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          title="Copy link"
                        >
                          <i className="fa fa-link"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {product && shopOwner && (
            <>
              {/* Full-width Shop Info Bar below product section */}
              <div className="row mt-3">
                <div className="col-12">
                  <ShopInfoBar 
                    shopOwner={shopOwner}
                    onViewShop={() => navigate(`/shop/${product.userId}`)}
                    onChat={() => {
                      // Dispatch event để mở chat với shop owner về sản phẩm này
                      window.dispatchEvent(new CustomEvent('open-chat-with-product', {
                        detail: {
                          shopOwnerId: product.userId,
                          productId: product.id
                        }
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <CommentsBox productId={product.id} product={product} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Chat Widget */}
      <ChatBotWidget />

      {/* Lightbox Modal */}
      {lightboxOpen && imageUrls.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLightboxOpen(false);
            }
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
          >
            ×
          </button>

          {/* Main Image/Video in Lightbox */}
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {imageUrls[lightboxIndex]?.type === 'video' ? (
              <video
                src={imageUrls[lightboxIndex].url}
                controls
                autoPlay
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <img
                src={imageUrls[lightboxIndex]?.url || imgFallback}
                onError={(e) => (e.currentTarget.src = imgFallback)}
                alt={product?.name}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  objectFit: 'contain'
                }}
              />
            )}

            {/* Navigation Arrows in Lightbox */}
            {imageUrls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
                  }}
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
                  }}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  <i className="fa fa-chevron-right"></i>
                </button>
              </>
            )}

            {/* Image Counter */}
            {imageUrls.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}
              >
                {lightboxIndex + 1} / {imageUrls.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
