import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    const contentElement = document.querySelector('.ant-layout-content.overflow-y-auto');
    if (contentElement) {
      contentElement.scrollTo(0, 0);
    }
    
    // As a fallback, ensure window also scrolls to top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
