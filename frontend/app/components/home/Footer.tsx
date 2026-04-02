import React, { useState } from 'react';

interface Props {
  isMobile: boolean;
  isDark: boolean;
}

const createStyles = (
  showCredits: boolean,
  isDark: boolean,
  isMobile: boolean,
) => {
  const secondaryText = isDark ? '#B0B5BA' : '#5F6368';
  const maroon = isDark ? '#B0263E' : 'rgb(154, 31, 54)';

  const footer: React.CSSProperties = {
    textAlign: 'center',
    padding: isMobile ? '0 1rem 1.5rem' : '1.5vw 1vw 1vw',
    fontSize: isMobile ? 13 : 14,
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: isMobile ? '0.5rem' : '0.2vw',
    color: secondaryText,
  };

  const fox: React.CSSProperties = {
    cursor: 'pointer',
    display: 'inline-block',
  };

  const credits: React.CSSProperties = {
    maxHeight: showCredits ? '200px' : '0',
    opacity: showCredits ? 1 : 0,
    padding: showCredits ? '0.55rem 0.9rem' : '0',
    border: showCredits
      ? `1px solid ${isDark ? 'rgba(176, 38, 62, 0.4)' : 'rgba(154, 31, 54, 0.4)'}`
      : '1px solid transparent',
    borderRadius: isMobile ? '0.95rem' : '0.4vw',
    overflow: 'hidden',
    transition:
      'opacity 0.35s ease, max-height 0.5s ease, padding 0.35s ease, border-color 0.35s ease',
    color: maroon,
    marginTop: isMobile ? '0.2rem' : '0.2vw',
    maxWidth: isMobile ? 'min(92vw, 720px)' : '34vw',
  };

  return { footer, fox, credits };
};

const Footer: React.FC<Props> = ({ isMobile, isDark }) => {
  const [showCredits, setShowCredits] = useState(false);
  const styles = createStyles(showCredits, isDark, isMobile);
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div>
        A friendly&nbsp;
        <span
          style={styles.fox}
          onClick={() => setShowCredits(!showCredits)}
          role="button"
          aria-label="Toggle credits"
        >
          🦊
        </span>
        &nbsp;re/creation. © {currentYear}
      </div>
      <div>Full credit to the creators of the original RL Clock.</div>
      <div style={styles.credits}>
        <em className={showCredits ? 'shimmer-text' : ''}>
          Recreated by Marco Suri, Dylan Pan, Austin Reid, Avish Kumar, Michael
          DiLallo, and Mr. Piper
        </em>
      </div>
    </footer>
  );
};

export default Footer;
