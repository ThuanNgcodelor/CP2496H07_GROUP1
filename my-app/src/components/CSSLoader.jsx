import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CSSLoader = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Load admin CSS khi vào admin routes
    if (isAdminRoute) {
      const adminCSS = document.createElement('link');
      adminCSS.rel = 'stylesheet';
      adminCSS.href = '/assets/admin/css/admin.css';
      adminCSS.id = 'admin-css';
      document.head.appendChild(adminCSS);
    } else {
      // Remove admin CSS khi rời khỏi admin routes
      const existingAdminCSS = document.getElementById('admin-css');
      if (existingAdminCSS) {
        existingAdminCSS.remove();
      }
    }

    // Cleanup function
    return () => {
      const existingAdminCSS = document.getElementById('admin-css');
      if (existingAdminCSS) {
        existingAdminCSS.remove();
      }
    };
  }, [isAdminRoute]);

  return null;
};

export default CSSLoader;
