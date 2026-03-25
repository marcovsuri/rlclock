import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Lunch', href: '/lunch' },
  { label: 'Sports', href: '/sports' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const createStyles = (isActive: boolean) => {
  const backdrop: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 100,
  };

  const drawer: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '260px',
    backgroundColor: 'var(--nav-bg, #111)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    zIndex: 101,
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1.5rem',
    gap: '0.5rem',
  };

  const header: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  };

  const title: React.CSSProperties = {
    fontWeight: 700,
    fontSize: '1.1rem',
    letterSpacing: '0.05em',
    opacity: 0.9,
  };

  const closeButton: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'inherit',
    padding: '4px',
    display: 'flex',
    opacity: 0.7,
  };

  const navLink: React.CSSProperties = {
    display: 'block',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'inherit',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'background 0.15s, opacity 0.15s',
    background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
    opacity: isActive ? 1 : 0.6,
  };

  return { backdrop, drawer, header, title, closeButton, navLink };
};

const Nav = ({ isOpen, onClose }: Props) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
            style={createStyles(false).backdrop}
          />

          <motion.nav
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={createStyles(false).drawer}
          >
            <div style={createStyles(false).header}>
              <span style={createStyles(false).title}>RL Clock</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={createStyles(false).closeButton}
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

            {NAV_LINKS.map(({ label, href }, i) => {
              const isActive = pathname === href;
              const styles = createStyles(isActive);

              return (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    to={href}
                    onClick={onClose}
                    style={styles.navLink}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        'rgba(255,255,255,0.07)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = isActive
                        ? 'rgba(255,255,255,0.07)'
                        : 'transparent')
                    }
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default Nav;
