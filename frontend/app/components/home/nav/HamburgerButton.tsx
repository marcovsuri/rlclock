import React from 'react';

interface Props {
  isDarkMode: boolean;
  onClick: () => void;
}

const createStyles = (isDarkMode: boolean) => {
  const button: React.CSSProperties = {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    zIndex: 110,
    background: isDarkMode ? 'rgba(45,46,48,0.82)' : 'rgba(255,255,255,0.88)',
    border: isDarkMode
      ? '1px solid rgba(255,255,255,0.12)'
      : '1px solid rgba(32,33,36,0.08)',
    borderRadius: '12px',
    padding: '10px',
    cursor: 'pointer',
    color: isDarkMode ? '#E8EAED' : '#202124',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    backdropFilter: 'blur(8px)',
    boxShadow: isDarkMode
      ? '0 12px 24px rgba(0,0,0,0.35)'
      : '0 12px 24px rgba(0,0,0,0.12)',
  };

  const bar: React.CSSProperties = {
    display: 'block',
    width: '20px',
    height: '2px',
    background: 'currentColor',
    borderRadius: '2px',
  };

  return { button, bar };
};

const HamburgerButton: React.FC<Props> = ({ isDarkMode, onClick }) => {
  const styles = createStyles(isDarkMode);

  return (
    <button
      onClick={onClick}
      aria-label="Open navigation"
      style={styles.button}
    >
      <span style={styles.bar} />
      <span style={styles.bar} />
      <span style={styles.bar} />
    </button>
  );
};

export default HamburgerButton;
