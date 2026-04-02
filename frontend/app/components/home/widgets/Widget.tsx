import React from 'react';
import { useNavigate } from 'react-router';

interface Props {
  title: string;
  to?: string;
  children: React.ReactNode;
  isDark: boolean;
  isMobile: boolean;
}

const createStyles = (
  isDark: boolean,
  isMobile: boolean,
  redirectable: boolean = false,
) => {
  const baseCard: React.CSSProperties = {
    backgroundColor: isDark ? '#2D2E30' : '#FFFFFF',
    borderRadius: isMobile ? '1.45rem' : '0.8vw',
    padding: isMobile ? '1.15rem 1rem' : '0.8vw 1.2vw',
    boxShadow: isDark
      ? '0 2px 8px rgba(0,0,0,0.4)'
      : '0 2px 8px rgba(0,0,0,0.12)',
    border: 'none',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 'unset',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isMobile ? '0.85rem' : '1vw',
    cursor: redirectable ? 'pointer' : 'default',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
    margin: 0,
    textAlign: 'left',
    color: isDark ? '#E8EAED' : '#202124',
  };

  const title: React.CSSProperties = {
    margin: '0 0 0.2em',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: 500,
    color: isDark ? '#B0B5BA' : '#5F6368',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4em',
  };

  const content: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '0.35rem',
    fontSize: '16px',
    fontWeight: 400,
    color: isDark ? '#E8EAED' : '#202124',
    lineHeight: 1.4,
  };

  const textGroup: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const arrow: React.CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    color: isDark ? '#B0B5BA' : '#5F6368',
    flexShrink: 0,
  };

  const buttonReset: React.CSSProperties = {
    ...baseCard,
    font: 'inherit',
    borderWidth: 0,
    fontFamily: 'inherit',
  };

  return { baseCard, buttonReset, title, content, textGroup, arrow };
};

const Widget: React.FC<Props> = ({ title, to, children, isDark, isMobile }) => {
  const navigate = useNavigate();

  const styles = createStyles(isDark, isMobile, !!to);
  const body = (
    <>
      <div style={styles.textGroup}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.content}>{children}</div>
      </div>
      {to && <span style={styles.arrow}>›</span>}
    </>
  );

  if (to) {
    return (
      <button
        type="button"
        style={styles.buttonReset}
        onClick={() => navigate(to)}
      >
        {body}
      </button>
    );
  }

  return <div style={styles.baseCard}>{body}</div>;
};

export default Widget;
