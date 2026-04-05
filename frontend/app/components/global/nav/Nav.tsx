import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router';
import AuthButton from './AuthButton';
import useTheme, { type ThemePreference } from '~/hooks/useTheme';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Lunch', href: '/lunch' },
  { label: 'Sports', href: '/sports' },
];

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

interface Props {
  isMobile: boolean;
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const createStyles = (isDark: boolean, isMobile: boolean) => {
  const backdrop: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: isDark
      ? 'rgba(8, 9, 10, 0.7)'
      : 'rgba(248, 245, 246, 0.78)',
    backdropFilter: isMobile ? 'blur(14px)' : 'blur(10px)',
    zIndex: 120,
  };

  const drawer: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: isMobile ? '100vw' : 'clamp(320px, 34vw, 460px)',
    backgroundColor: isDark
      ? 'rgba(20, 21, 23, 0.96)'
      : 'rgba(255, 252, 253, 0.97)',
    zIndex: 121,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: isMobile ? '1.25rem' : '1.5rem',
    color: isDark ? '#FFF' : '#202124',
    borderRight: isMobile
      ? 'none'
      : isDark
        ? '1px solid rgba(255,255,255,0.08)'
        : '1px solid rgba(32,33,36,0.08)',
    borderTopRightRadius: isMobile ? 0 : '28px',
    borderBottomRightRadius: isMobile ? 0 : '28px',
    boxShadow: isDark
      ? '0 20px 48px rgba(0,0,0,0.35)'
      : '0 20px 48px rgba(0,0,0,0.14)',
  };

  const header: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  };

  const title: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 'clamp(1.1rem, 4vw, 1.35rem)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    opacity: 0.9,
  };

  const closeButton: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(32,33,36,0.06)',
    border: isDark
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(32,33,36,0.08)',
    borderRadius: '999px',
    cursor: 'pointer',
    color: 'inherit',
    padding: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const navList: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
    justifyContent: 'start',
    paddingTop: '1rem',
    flex: 1,
  };

  const footer: React.CSSProperties = {
    marginTop: '1rem',
    fontSize: '0.95rem',
    color: isDark ? '#B0B5BA' : '#5F6368',
    letterSpacing: '0.04em',
    textAlign: 'center',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  };

  const controls: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    paddingTop: '1rem',
  };

  const themeLabel: React.CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: isDark ? '#B0B5BA' : '#5F6368',
  };

  const themePicker: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '0.6rem',
  };

  const fox: React.CSSProperties = {
    display: 'inline-block',
  };

  const createLinkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'block',
    padding: '1rem 1.15rem',
    borderRadius: '18px',
    textDecoration: 'none',
    color: 'inherit',
    fontSize: isMobile
      ? 'clamp(1.4rem, 7vw, 2.4rem)'
      : 'clamp(1.15rem, 2.3vw, 1.55rem)',
    fontWeight: 600,
    transition: 'background 0.15s, opacity 0.15s, border-color 0.15s',
    background: isActive
      ? isDark
        ? 'rgba(176, 38, 62, 0.22)'
        : 'rgba(154, 31, 54, 0.1)'
      : 'transparent',
    border: isActive
      ? isDark
        ? '1px solid rgba(176, 38, 62, 0.32)'
        : '1px solid rgba(154, 31, 54, 0.18)'
      : isDark
        ? '1px solid rgba(255,255,255,0.08)'
        : '1px solid rgba(32,33,36,0.08)',
    opacity: isActive ? 1 : 0.88,
  });

  const createThemeButtonStyle = (isActive: boolean): React.CSSProperties => ({
    appearance: 'none',
    border: isActive
      ? isDark
        ? '1px solid rgba(176, 38, 62, 0.34)'
        : '1px solid rgba(154, 31, 54, 0.22)'
      : isDark
        ? '1px solid rgba(255,255,255,0.08)'
        : '1px solid rgba(32,33,36,0.08)',
    background: isActive
      ? isDark
        ? 'rgba(176, 38, 62, 0.18)'
        : 'rgba(154, 31, 54, 0.08)'
      : isDark
        ? 'rgba(255,255,255,0.04)'
        : 'rgba(32,33,36,0.04)',
    color: 'inherit',
    borderRadius: '14px',
    padding: '0.75rem 0.6rem',
    fontSize: '0.95rem',
    fontWeight: isActive ? 700 : 600,
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s, opacity 0.15s',
    opacity: isActive ? 1 : 0.88,
  });

  return {
    backdrop,
    drawer,
    header,
    title,
    closeButton,
    navList,
    controls,
    themeLabel,
    themePicker,
    footer,
    fox,
    createLinkStyle,
    createThemeButtonStyle,
  };
};

const Nav: React.FC<Props> = ({ isMobile, isDark, isOpen, onClose }) => {
  const { pathname } = useLocation();
  const { preference, setThemePreference } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const styles = createStyles(isDark, isMobile);
  const currentYear = new Date().getFullYear();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={styles.backdrop}
          />

          <motion.nav
            key="overlay"
            initial={isMobile ? { opacity: 0, y: -24 } : { opacity: 0, x: -40 }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
            exit={isMobile ? { opacity: 0, y: -24 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            style={styles.drawer}
            aria-modal="true"
            role="dialog"
          >
            <div style={styles.header}>
              <span style={styles.title}>RL Clock</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={styles.closeButton}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={styles.navList}>
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive = pathname === href;
                const linkStyle = styles.createLinkStyle(isActive);

                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                  >
                    <Link to={href} onClick={onClose} style={linkStyle}>
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <AuthButton isDark={isDark} />

            <div style={styles.controls}>
              <div style={styles.themeLabel}>Theme</div>
              <div style={styles.themePicker}>
                {THEME_OPTIONS.map(({ label, value }) => {
                  const isActive = preference === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setThemePreference(value)}
                      aria-pressed={isActive}
                      style={styles.createThemeButtonStyle(isActive)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div style={styles.footer}>
                A friendly&nbsp;
                <span style={styles.fox} aria-label="Toggle credits">
                  🦊
                </span>
                &nbsp;re/creation. © {currentYear}
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default Nav;
