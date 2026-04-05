import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 1024) => {
  // Initialize with false to be safe during SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safeguard

    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint);

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
