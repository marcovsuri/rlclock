import React from 'react';
import { useNavigate } from 'react-router';

interface Props {
  title: string;
  to?: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const createStyles = (isDarkMode: boolean, redirectable: boolean = false) => {
  const card: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    boxShadow: isDarkMode
      ? '0 2px 12px rgba(0,0,0,0.5)'
      : '0 2px 12px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    containerType: 'inline-size',
    cursor: redirectable ? 'pointer' : 'default',
  };

  const title: React.CSSProperties = {
    fontSize: '3cqw',
    fontWeight: 600,
    color: isDarkMode ? '#B0B5BA' : '#5F6368',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 0.75rem',
    flexShrink: 0,
  };

  const content: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  };

  return { card, title, content };
};

const Widget: React.FC<Props> = ({ title, to, children, isDarkMode }) => {
  const navigate = useNavigate();

  const styles = createStyles(isDarkMode, !!to);

  return (
    <div style={styles.card} onClick={() => (to ? navigate(to) : null)}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.content}>{children}</div>
    </div>
  );
};

export default Widget;
