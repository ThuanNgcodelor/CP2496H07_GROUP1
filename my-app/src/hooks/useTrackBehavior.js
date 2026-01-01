import { useEffect, useRef, useCallback } from 'react';
import { trackView, trackSearch, trackCart } from '../api/tracking';

/**
 * Hook to track product view with duration
 * Automatically tracks when component unmounts (user leaves page)
 * 
 * @param {string} productId - Product ID to track
 * @param {string} source - Source of the view (homepage, search, category, recommendation)
 * 
 * @example
 * // In ProductDetail.jsx
 * function ProductDetail({ productId }) {
 *     useTrackProductView(productId, 'product_detail');
 *     // ... rest of component
 * }
 */
export const useTrackProductView = (productId, source = 'direct') => {
    const startTime = useRef(Date.now());
    const hasTracked = useRef(false); useEffect(() => {
        if (!productId) return;

        // Reset tracking on productId change
        startTime.current = Date.now();
        hasTracked.current = false;

        // Track when user leaves the page
        return () => {
            if (!hasTracked.current && productId) {
                const duration = Math.round((Date.now() - startTime.current) / 1000);
                trackView(productId, source, duration);
                hasTracked.current = true;
            }
        };
    }, [productId, source]);
};

/**
 * Hook to get debounced track search function
 * Prevents too many tracking calls when user is typing
 * 
 * @param {number} delay - Debounce delay in ms (default 500ms)
 * @returns {Function} Debounced trackSearch function
 * 
 * @example
 * // In SearchComponent.jsx
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
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (keyword && keyword.trim().length >= 2) {
                trackSearch(keyword.trim(), resultCount);
            }
        }, delay);
    }, [delay]);

    // Cleanup on unmount
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
 * Hook to track add to cart with callback
 * Returns a function that tracks and executes original add to cart
 * 
 * @param {Function} originalAddToCart - Original add to cart function
 * @returns {Function} Enhanced add to cart function with tracking
 * 
 * @example
 * // In ProductDetail.jsx
 * function ProductDetail({ productId }) {
 *     const addToCartOriginal = async (productId, quantity) => {
 *         // original logic
 *     };
 *     
 *     const addToCart = useTrackAddToCart(addToCartOriginal);
 *     
 *     return <button onClick={() => addToCart(productId, 1)}>Add to Cart</button>;
 * }
 */
export const useTrackAddToCart = (originalAddToCart) => {
    return useCallback(async (productId, quantity = 1, ...args) => {
        // Track the add to cart action
        trackCart(productId, quantity);

        // Execute original function
        if (originalAddToCart) {
            return originalAddToCart(productId, quantity, ...args);
        }
    }, [originalAddToCart]);
};

/**
 * Simple function to track view immediately (for non-hook usage)
 * Use this in event handlers or outside React components
 * 
 * @param {string} productId - Product ID
 * @param {string} source - Source of the view
 * 
 * @example
 * // In event handler
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
