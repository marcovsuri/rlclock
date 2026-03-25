import { useEffect, useState } from 'react';

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;

  return (
    document.documentElement.classList.contains('dark-mode') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark-mode', event.matches);
      setIsDarkMode(event.matches);
    };

    document.documentElement.classList.toggle('dark-mode', mediaQuery.matches);
    setIsDarkMode(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};

export default useDarkMode;
