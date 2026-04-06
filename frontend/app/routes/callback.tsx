import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { handleOAuthCallback } from '~/core/AuthHandler';
import useTheme from '~/hooks/useTheme';
import useIsMobile from '~/hooks/useIsMobile';

export default function Callback() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function processCode() {
      try {
        await handleOAuthCallback();
        // window.location.href = '/';
      } catch (err) {
        console.error('OAuth callback failed:', err);
        window.location.href = '/';
      }
    }

    processCode();
  }, []);

  const styles = createStyles(isMobile, isDark);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <main style={styles.inner}>
        <div style={styles.content}>
          <h1 style={styles.title}>Signing you in…</h1>
          <motion.div
            style={styles.spinner}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
        </div>
      </main>
    </motion.div>
  );
}

const createStyles = (isMobile: boolean, isDark: boolean) => {
  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    alignItems: 'center',
    backgroundColor: isDark ? '#0D0D0D' : '#F8F9FA',
    color: isDark ? '#E8EAED' : '#202124',
  };

  const inner: React.CSSProperties = {
    flexGrow: 1,
    padding: isMobile ? '2rem 1rem' : '2rem 3rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };

  const content: React.CSSProperties = {
    width: isMobile ? '100%' : '60vw',
    maxWidth: '600px',
    margin: '0 auto',
    boxSizing: 'border-box',
    textAlign: 'center',
  };

  const title: React.CSSProperties = {
    fontSize: isMobile ? 26 : 32,
    color: isDark ? '#B0263E' : 'rgb(154, 31, 54)',
    marginBottom: '2rem',
  };

  const spinner: React.CSSProperties = {
    width: '60px',
    height: '60px',
    border: `6px solid ${isDark ? '#555' : '#ccc'}`,
    borderTop: `6px solid ${isDark ? '#B0263E' : 'rgb(154, 31, 54)'}`,
    borderRadius: '50%',
    margin: '0 auto',
  };

  return { container, inner, content, title, spinner };
};
