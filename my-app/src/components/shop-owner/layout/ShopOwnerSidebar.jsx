import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const ShopOwnerSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    orders: false,
    products: false
  });

  // Auto-expand section if current route belongs to it (but not the main route)
  useEffect(() => {
    const path = location.pathname;
    
    // Check if current route is in orders section (only for sub-routes, not main /shop-owner)
    if (path.startsWith('/shop-owner/orders/')) {
      setExpandedSections(prev => ({
        ...prev,
        orders: true
      }));
    }
    
    // Check if current route is in products section
    if (path.startsWith('/shop-owner/products')) {
      setExpandedSections(prev => ({
        ...prev,
        products: true
      }));
    }
  }, [location.pathname]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => {
    const currentPath = location.pathname;
    
    // Exact match (including trailing slash)
    if (currentPath === path || currentPath === path + '/') {
      return true;
    }
    
    // For main dashboard (/shop-owner), only match exact (not sub-routes)
    if (path === '/shop-owner') {
      return currentPath === '/shop-owner' || currentPath === '/shop-owner/';
    }
    
    // For /shop-owner/products, only match exact (not sub-routes like /add or /edit/:id)
    if (path === '/shop-owner/products') {
      return currentPath === '/shop-owner/products' || currentPath === '/shop-owner/products/';
    }
    
    // For sub-routes (e.g., /shop-owner/orders/bulk-shipping), match exact
    // This ensures /shop-owner/orders/bulk-shipping doesn't match /shop-owner
    if (currentPath.startsWith(path)) {
      const nextChar = currentPath[path.length];
      // Match if path ends exactly here, or is followed by / or ?
      return !nextChar || nextChar === '/' || nextChar === '?';
    }
    
    return false;
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <nav className={`col-md-2 sidebar ${isOpen ? 'active' : ''}`}>
      {isOpen && (
        <button className="sidebar-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      )}
      <div className="sidebar-brand">
        <Link to="/shop-owner" onClick={onClose}>
          <span className="sidebar-title">Seller Center</span>
        </Link>
      </div>

      <div className="sidebar-menu">
        {/* Orders Management Section */}
        <div className="sidebar-section">
          <div 
            className="sidebar-section-header" 
            onClick={() => toggleSection('orders')}
          >
            <span>Order Management</span>
            <i className={`fas fa-chevron-${expandedSections.orders ? 'up' : 'down'}`}></i>
          </div>
          {expandedSections.orders && (
            <div className="sidebar-menu-items">
              <Link 
                className={`sidebar-item ${isActive('/shop-owner') ? 'active' : ''}`}
                to="/shop-owner"
                onClick={handleLinkClick}
              >
                <i className="fas fa-list"></i>
                <span>All Orders</span>
              </Link>
              <Link 
                className={`sidebar-item ${isActive('/shop-owner/orders/bulk-shipping') ? 'active' : ''}`}
                to="/shop-owner/orders/bulk-shipping"
                onClick={handleLinkClick}
              >
                <i className="fas fa-truck"></i>
                <span>Bulk Shipping</span>
              </Link>
              <Link 
                className={`sidebar-item ${isActive('/shop-owner/orders/returns') ? 'active' : ''}`}
                to="/shop-owner/orders/returns"
                onClick={handleLinkClick}
              >
                <i className="fas fa-undo-alt"></i>
                <span>Returns & Refunds</span>
              </Link>
              <Link 
                className={`sidebar-item ${isActive('/shop-owner/orders/shipping-settings') ? 'active' : ''}`}
                to="/shop-owner/orders/shipping-settings"
                onClick={handleLinkClick}
              >
                <i className="fas fa-cog"></i>
                <span>Shipping Settings</span>
              </Link>
            </div>
          )}
        </div>

        {/* Product Management Section */}
        <div className="sidebar-section">
          <div 
            className="sidebar-section-header" 
            onClick={() => toggleSection('products')}
          >
            <span>Product Management</span>
            <i className={`fas fa-chevron-${expandedSections.products ? 'up' : 'down'}`}></i>
          </div>
          {expandedSections.products && (
            <div className="sidebar-menu-items">
              <Link 
                className={`sidebar-item ${isActive('/shop-owner/products') ? 'active' : ''}`}
                to="/shop-owner/products"
                onClick={handleLinkClick}
              >
                <i className="fas fa-box"></i>
                <span>All Products</span>
              </Link>
              <Link 
                className={`sidebar-item ${isActive('/shop-owner/products/add') ? 'active' : ''}`}
                to="/shop-owner/products/add"
                onClick={handleLinkClick}
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add Product</span>
              </Link>
            </div>
          )}
        </div>

        {/* Analytics Section */}
        <div className="sidebar-section">
          <Link 
            className={`sidebar-item ${isActive('/shop-owner/analytics') ? 'active' : ''}`}
            to="/shop-owner/analytics"
            onClick={handleLinkClick}
          >
            <i className="fas fa-chart-line"></i>
            <span>Sales Analytics</span>
          </Link>
        </div>

        {/* Chat */}
        <div className="sidebar-section">
          <Link 
            className={`sidebar-item ${isActive('/shop-owner/chat') ? 'active' : ''}`}
            to="/shop-owner/chat"
            onClick={handleLinkClick}
          >
            <i className="fas fa-comments"></i>
            <span>Customer Messages</span>
          </Link>
        </div>

        {/* Notifications */}
        <div className="sidebar-section">
          <Link 
            className={`sidebar-item ${isActive('/shop-owner/notifications') ? 'active' : ''}`}
            to="/shop-owner/notifications"
            onClick={handleLinkClick}
          >
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </Link>
        </div>

        {/* Settings */}
        <div className="sidebar-section">
          <Link 
            className={`sidebar-item ${isActive('/shop-owner/settings') ? 'active' : ''}`}
            to="/shop-owner/settings"
            onClick={handleLinkClick}
          >
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default ShopOwnerSidebar;

