import { useEffect, useState } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';

const resolveIsDark = (pref: ThemePreference): boolean => {
  if (pref === 'light') return false;
  if (pref === 'dark') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getStoredPreference = (): ThemePreference =>
  (localStorage.getItem('themePreference') as ThemePreference) ?? 'system';

const useTheme = () => {
  const [preference, setPreference] =
    useState<ThemePreference>(getStoredPreference);
  const [isDark, setIsDark] = useState(() => {
    const dark = resolveIsDark(getStoredPreference());
    document.documentElement.classList.toggle('dark-mode', dark);
    return dark;
  });

  // Remove no-transition class after first paint
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition');
      });
    });
  }, []);

  // Listen for system preference changes, but only when preference is 'system'
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (preference !== 'system') return;
      document.documentElement.classList.toggle('dark-mode', e.matches);
      setIsDark(e.matches);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [preference]);

  const setThemePreference = (pref: ThemePreference) => {
    localStorage.setItem('themePreference', pref);
    setPreference(pref);
    const dark = resolveIsDark(pref);
    document.documentElement.classList.toggle('dark-mode', dark);
    setIsDark(dark);
  };

  return { isDarkMode: isDark, preference, setThemePreference };
};

export default useTheme;
export type { ThemePreference };
