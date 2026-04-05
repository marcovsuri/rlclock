import { useState, useEffect } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';
const THEME_PREFERENCE_KEY = 'themePreference';
const THEME_CHANGE_EVENT = 'theme-preference-change';

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

const resolveIsDark = (pref: ThemePreference): boolean => {
  if (pref === 'light') return false;
  if (pref === 'dark') return true;
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false; // fallback for SSR
};

const applyThemePreference = (pref: ThemePreference) => {
  const dark = resolveIsDark(pref);
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark-mode', dark);
  }
  return dark;
};

const useTheme = () => {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [isDark, setIsDark] = useState(false);

  // Initialize on client only
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem(THEME_PREFERENCE_KEY);
    const pref = isThemePreference(stored) ? stored : 'system';
    setPreference(pref);
    setIsDark(applyThemePreference(pref));

    // Remove no-transition class after first paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition');
      });
    });
  }, []);

  // Listen for system preference changes when preference is 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || preference !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark-mode', e.matches);
      setIsDark(e.matches);
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [preference]);

  // Listen for storage and custom theme events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncPreference = (pref: ThemePreference) => {
      setPreference(pref);
      setIsDark(applyThemePreference(pref));
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_PREFERENCE_KEY) return;
      syncPreference(
        isThemePreference(event.newValue) ? event.newValue : 'system',
      );
    };

    const handleThemeChange = (event: Event) => {
      const pref = (event as CustomEvent<ThemePreference>).detail;
      if (!isThemePreference(pref)) return;
      syncPreference(pref);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);

  const setThemePreference = (pref: ThemePreference) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_PREFERENCE_KEY, pref);
      window.dispatchEvent(
        new CustomEvent<ThemePreference>(THEME_CHANGE_EVENT, { detail: pref }),
      );
    }
    setPreference(pref);
    setIsDark(applyThemePreference(pref));
  };

  return { isDark, preference, setThemePreference };
};

export default useTheme;
export type { ThemePreference };
