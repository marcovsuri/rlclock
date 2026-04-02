import { useEffect, useState } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';
const THEME_PREFERENCE_KEY = 'themePreference';
const THEME_CHANGE_EVENT = 'theme-preference-change';

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

const resolveIsDark = (pref: ThemePreference): boolean => {
  if (pref === 'light') return false;
  if (pref === 'dark') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches; // pref === "system"
};

const getStoredPreference = (): ThemePreference =>
  isThemePreference(localStorage.getItem(THEME_PREFERENCE_KEY))
    ? (localStorage.getItem(THEME_PREFERENCE_KEY) as ThemePreference)
    : 'system';

const applyThemePreference = (pref: ThemePreference) => {
  const dark = resolveIsDark(pref);
  document.documentElement.classList.toggle('dark-mode', dark);
  return dark;
};

const useTheme = () => {
  const [preference, setPreference] =
    useState<ThemePreference>(getStoredPreference);
  const [isDark, setIsDark] = useState(() => {
    return applyThemePreference(getStoredPreference());
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

  useEffect(() => {
    const syncPreference = (pref: ThemePreference) => {
      setPreference(pref);
      setIsDark(applyThemePreference(pref));
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_PREFERENCE_KEY) return;
      syncPreference(isThemePreference(event.newValue) ? event.newValue : 'system');
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
    localStorage.setItem(THEME_PREFERENCE_KEY, pref);
    setPreference(pref);
    setIsDark(applyThemePreference(pref));
    window.dispatchEvent(
      new CustomEvent<ThemePreference>(THEME_CHANGE_EVENT, { detail: pref }),
    );
  };

  return { isDark, preference, setThemePreference };
};

export default useTheme;
export type { ThemePreference };
