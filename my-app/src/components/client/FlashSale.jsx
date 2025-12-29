import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import flashSaleAPI from '../../api/flashSale/flashSaleAPI';
import { fetchProductImageById } from '../../api/product';

export default function FlashSale() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    loadFlashSaleProducts();
  }, []);

  const loadFlashSaleProducts = async () => {
    try {
      setLoading(true);
      // Get current active session
      const sessionData = await flashSaleAPI.getCurrentSession();

      if (sessionData && sessionData.id) {
        setSession(sessionData);

        // Get products for this session
        const productsData = await flashSaleAPI.getPublicSessionProducts(sessionData.id);

        // Filter only approved products
        const approvedProducts = productsData.filter(p => p.status === 'APPROVED');
        setProducts(approvedProducts);

        // Load images for products
        loadProductImages(approvedProducts);
      }
    } catch (error) {
      console.error('Failed to load flash sale products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProductImages = async (products) => {
    const urls = {};
    for (const product of products) {
      if (product.productImageId) {
        try {
          const imgRes = await fetchProductImageById(product.productImageId);
          const contentType = imgRes.headers["content-type"] || "image/jpeg";
          const blob = new Blob([imgRes.data], { type: contentType });
          urls[product.productId] = URL.createObjectURL(blob);
        } catch (err) {
          console.error(`Failed to load image for product ${product.productId}:`, err);
        }
      }
    }
    setImageUrls(urls);
  };

  const formatVND = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "₫";

  // Don't render if no active session or no products
  if (!loading && (!session || products.length === 0)) {
    return null;
  }

  return (
    <div style={{ background: 'white', padding: '24px 0', marginTop: '8px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="fa fa-bolt" style={{ color: '#ee4d2d', fontSize: '20px' }}></i>
            <h4 style={{ fontSize: '18px', color: '#ee4d2d', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>
              FLASH SALE
            </h4>
          </div>
          <Link to="/flash-sale" style={{ color: '#ee4d2d', textDecoration: 'none', fontSize: '14px' }}>
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px', color: '#ee4d2d' }}></i>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.productId}`}
                style={{
                  minWidth: 'clamp(150px, 20vw, 180px)',
                  background: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  padding: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ee4d2d';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(238,77,45,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '100%',
                      paddingBottom: '100%',
                      background: '#f5f5f5',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {imageUrls[product.productId] ? (
                      <img
                        src={imageUrls[product.productId]}
                        alt={product.productName}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <i className="fa fa-image" style={{ fontSize: '48px', color: '#ccc' }}></i>
                    )}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: '#ee4d2d',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  >
                    -{product.discountPercent}%
                  </div>
                </div>

                <div style={{ fontSize: '16px', fontWeight: 600, color: '#ee4d2d', marginBottom: '4px' }}>
                  {formatVND(product.salePrice)}
                </div>

                <div style={{ fontSize: '12px', color: '#888', textDecoration: 'line-through', marginBottom: '8px' }}>
                  {formatVND(product.originalPrice)}
                </div>

                <div style={{
                  background: '#ee4d2d',
                  borderRadius: '2px',
                  padding: '4px 8px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    background: 'rgba(255,255,255,0.2)',
                    width: `${Math.min(((product.soldCount || 0) / (product.flashSaleStock || 1)) * 100, 100)}%`,
                    transition: 'width 0.3s'
                  }}></div>
                  <div style={{
                    fontSize: '11px',
                    color: 'white',
                    fontWeight: 600,
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center'
                  }}>
                    {product.flashSaleStock - (product.soldCount || 0) > 0
                      ? `Còn ${product.flashSaleStock - (product.soldCount || 0)}`
                      : 'Hết hàng'
                    }
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
