import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getShopOwnerInfo } from '../../../api/user';
import { logout } from '../../../api/auth';
import LanguageSwitcher from '../../common/LanguageSwitcher';

const ShopOwnerHeader = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [shopOwnerInfo, setShopOwnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadShopOwnerInfo = async () => {
      try {
        setLoading(true);
        const data = await getShopOwnerInfo();
        setShopOwnerInfo(data);
      } catch (error) {
        console.error('Error loading shop owner info:', error);
      } finally {
        setLoading(false);
      }
    };
    loadShopOwnerInfo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  const displayName = shopOwnerInfo?.shopName || shopOwnerInfo?.ownerName || t('shopOwner.header.sellerCenter');

  // Only construct image URL if imageUrl exists and is valid
  const hasValidImage = shopOwnerInfo?.imageUrl && !imageError;
  const shopImage = hasValidImage ? `/v1/file-storage/get/${shopOwnerInfo.imageUrl}` : null;

  return (
    <header className="shop-owner-header">
      <div className="header-left">
        <button className="header-icon-btn mobile-menu-btn" onClick={onMenuClick} title={t('shopOwner.header.menu')}>
          <i className="fas fa-bars"></i>
        </button>
        <Link to="/shop-owner" className="logo-section">
          <span className="header-title">{t('shopOwner.header.sellerCenter')}</span>
        </Link>
      </div>
      <div className="header-right">
        <Link to="/" className="header-icon-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('shopOwner.header.home')}>
          <i className="fas fa-home"></i>
        </Link>
        <LanguageSwitcher />
        <button className="header-icon-btn" title={t('shopOwner.header.apps')}>
          <i className="fas fa-th"></i>
        </button>
        <button className="header-icon-btn" title={t('shopOwner.header.bookmarks')}>
          <i className="far fa-bookmark"></i>
        </button>
        <div className="user-dropdown" ref={dropdownRef}>
          <button
            className="header-icon-btn user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="header-user-avatar-wrapper">
              {shopImage ? (
                <img
                  src={shopImage}
                  alt="User"
                  className="header-user-avatar"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="header-user-avatar-fallback">
                  {(displayName.charAt(0) || 'U').toUpperCase()}
                </div>
              )}
            </div>
            <span>{loading ? t('shopOwner.header.loading') : displayName}</span>
            <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'} chevron-icon`}></i>
          </button>
          {dropdownOpen && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar-wrapper">
                  {shopImage ? (
                    <img
                      src={shopImage}
                      alt="User"
                      className="dropdown-avatar"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="dropdown-avatar-fallback">
                      {(displayName.charAt(0) || 'U').toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="dropdown-user-info">
                  <div className="dropdown-name">{displayName}</div>
                  {shopOwnerInfo?.email && (
                    <div className="dropdown-email">{shopOwnerInfo.email}</div>
                  )}
                </div>
              </div>
              <div className="dropdown-divider"></div>
              {shopOwnerInfo?.userId && (
                <>
                  <Link
                    to={`/shop/${shopOwnerInfo.userId}`}
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="fas fa-store"></i>
                    <span>{t('shopOwner.header.viewShop')}</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                </>
              )}
              <Link
                to="/shop-owner/settings"
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-cog"></i>
                <span>{t('shopOwner.header.settings')}</span>
              </Link>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>{t('shopOwner.header.logout')}</span>
              </button>
            </div>
          )}
        </div>
        <button className="header-icon-btn" title={t('shopOwner.header.download')}>
          <i className="fas fa-download"></i>
        </button>
        <button className="header-icon-btn" title={t('shopOwner.header.upload')}>
          <i className="fas fa-upload"></i>
        </button>
        <button className="header-icon-btn support-btn" title={t('shopOwner.header.support')}>
          <i className="fas fa-headset"></i>
        </button>
      </div>
    </header>
  );
};

export default ShopOwnerHeader;

