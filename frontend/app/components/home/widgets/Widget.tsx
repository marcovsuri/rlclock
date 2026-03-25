import React from 'react';
import { useNavigate } from 'react-router';

interface Props {
  title: string;
  to?: string;
  children: React.ReactNode;
  isDark: boolean;
}

const createStyles = (isDark: boolean, redirectable: boolean = false) => {
  const card: React.CSSProperties = {
    backgroundColor: isDark ? '#2D2E30' : '#FFFFFF',
    borderRadius: '18px',
    padding: '1rem 1.1rem',
    boxShadow: isDark
      ? '0 2px 12px rgba(0,0,0,0.5)'
      : '0 2px 12px rgba(0,0,0,0.1)',
    border: isDark
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(32,33,36,0.08)',
    width: '100%',
    boxSizing: 'border-box',
    height: '100%',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
    containerType: 'inline-size',
    cursor: redirectable ? 'pointer' : 'default',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  };

  const title: React.CSSProperties = {
    fontSize: 'clamp(0.8rem, 3.6cqw, 1.05rem)',
    fontWeight: 600,
    color: isDark ? '#B0B5BA' : '#5F6368',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 0.9rem',
    flexShrink: 0,
  };

  const content: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '0.8rem',
  };

  return { card, title, content };
};

const Widget: React.FC<Props> = ({ title, to, children, isDark }) => {
  const navigate = useNavigate();

  const styles = createStyles(isDark, !!to);

  return (
    <div style={styles.card} onClick={() => (to ? navigate(to) : null)}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.content}>{children}</div>
    </div>
  );
};

export default Widget;
