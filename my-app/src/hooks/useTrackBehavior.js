import { useEffect, useRef, useCallback } from 'react';
import { trackView, trackSearch, trackCart } from '../api/tracking';

/**
 * ===== HOOK THEO DÕI HÀNH VI NGƯỜI DÙNG =====
 * 
 * Các React hooks để theo dõi hành vi người dùng trên frontend
 * Gửi dữ liệu đến backend thông qua tracking API
 * 
 * CÁC HOOK:
 * - useTrackProductView: Theo dõi xem sản phẩm (kèm thời gian xem)
 * - useTrackSearch: Theo dõi tìm kiếm (có debounce)
 * - useTrackAddToCart: Theo dõi thêm vào giỏ hàng
 * - trackProductView: Hàm helper không dùng hook
 */

/**
 * Hook theo dõi XEM SẢN PHẨM với thời gian xem
 * 
 * Cách hoạt động:
 * 1. Ghi nhận thời điểm bắt đầu xem
 * 2. Khi user rời trang (component unmount) → tính duration
 * 3. Gửi tracking event đến backend
 * 
 * @param {string} productId - ID sản phẩm đang xem
 * @param {string} source - Nguồn xem (homepage, search, category, recommendation)
 * 
 * @example
 * // Trong ProductDetail.jsx
 * function ProductDetail({ productId }) {
 *     useTrackProductView(productId, 'product_detail');
 *     // ... phần còn lại của component
 * }
 */
export const useTrackProductView = (productId, source = 'direct') => {
    const startTime = useRef(Date.now());
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!productId) return;

        // Reset tracking khi productId thay đổi
        startTime.current = Date.now();
        hasTracked.current = false;

        // Track khi user rời trang (cleanup function)
        return () => {
            if (!hasTracked.current && productId) {
                // Tính thời gian xem (giây)
                const duration = Math.round((Date.now() - startTime.current) / 1000);
                trackView(productId, source, duration);
                hasTracked.current = true;
            }
        };
    }, [productId, source]);
};

/**
 * Hook theo dõi TÌM KIẾM với debounce
 * 
 * Tại sao cần debounce?
 * - Tránh gửi quá nhiều request khi user đang gõ
 * - Chỉ track khi user ngừng gõ trong 500ms
 * - Chỉ track từ khóa >= 2 ký tự
 * 
 * @param {number} delay - Thời gian debounce (ms), mặc định 500ms
 * @returns {Function} Hàm trackSearch đã được debounce
 * 
 * @example
 * // Trong SearchComponent.jsx
 * function SearchComponent() {
 *     const trackSearchDebounced = useTrackSearch(300);
 *     
 *     const handleSearch = (e) => {
 *         const keyword = e.target.value;
 *         setKeyword(keyword);
 *         trackSearchDebounced(keyword, results.length);
 *     };
 * }
 */
export const useTrackSearch = (delay = 500) => {
    const timeoutRef = useRef(null);

    const debouncedTrack = useCallback((keyword, resultCount = 0) => {
        // Xóa timeout cũ nếu có (user vẫn đang gõ)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Đặt timeout mới
        timeoutRef.current = setTimeout(() => {
            // Chỉ track từ khóa có >= 2 ký tự
            if (keyword && keyword.trim().length >= 2) {
                trackSearch(keyword.trim(), resultCount);
            }
        }, delay);
    }, [delay]);

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedTrack;
};

/**
 * Hook theo dõi THÊM VÀO GIỎ HÀNG
 * 
 * Cách hoạt động:
 * 1. Nhận hàm addToCart gốc
 * 2. Trả về hàm mới: track + gọi hàm gốc
 * 
 * @param {Function} originalAddToCart - Hàm thêm giỏ hàng gốc
 * @returns {Function} Hàm thêm giỏ hàng có tracking
 * 
 * @example
 * // Trong ProductDetail.jsx
 * function ProductDetail({ productId }) {
 *     const addToCartOriginal = async (productId, quantity) => {
 *         // logic gốc
 *     };
 *     
 *     const addToCart = useTrackAddToCart(addToCartOriginal);
 *     
 *     return <button onClick={() => addToCart(productId, 1)}>Thêm vào giỏ</button>;
 * }
 */
export const useTrackAddToCart = (originalAddToCart) => {
    return useCallback(async (productId, quantity = 1, ...args) => {
        // Track hành động thêm giỏ hàng
        trackCart(productId, quantity);

        // Thực thi hàm gốc
        if (originalAddToCart) {
            return originalAddToCart(productId, quantity, ...args);
        }
    }, [originalAddToCart]);
};

/**
 * Hàm helper để track xem sản phẩm ngay lập tức (không dùng hook)
 * Dùng trong event handlers hoặc bên ngoài React components
 * 
 * @param {string} productId - ID sản phẩm
 * @param {string} source - Nguồn xem
 * 
 * @example
 * // Trong event handler
 * const handleProductClick = (productId) => {
 *     trackProductView(productId, 'homepage');
 *     navigate(`/product/${productId}`);
 * };
 */
export const trackProductView = (productId, source = 'direct') => {
    if (productId) {
        trackView(productId, source, 0);
    }
};

export default {
    useTrackProductView,
    useTrackSearch,
    useTrackAddToCart,
    trackProductView
};
