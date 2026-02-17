import React, { useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const [showCredits, setShowCredits] = useState(false);
  const isMobile = useIsMobile();

  const currentYear = new Date().getFullYear();
  const secondaryText = isDarkMode ? '#B0B5BA' : '#5F6368';
  const maroon = isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)';

  return (
    <footer
      style={{
        textAlign: 'center',
        padding: isMobile ? '3vh 3vw 2vh' : '1.5vw 1vw 1vw',
        color: secondaryText,
        fontSize: isMobile ? 13 : 14,
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? '0.5vh' : '0.2vw',
      }}
    >
      <div>
        A friendly&nbsp;
        <span
          style={{ cursor: 'pointer', display: 'inline-block' }}
          onClick={() => setShowCredits(!showCredits)}
          role="button"
          aria-label="Toggle credits"
        >
          🦊
        </span>
        &nbsp;re/creation. ©&nbsp;{currentYear}
      </div>
      <div style={{ fontSize: isMobile ? 13 : 14 }}>
        Full credit to the creators of the original RL Clock.
      </div>
      <div
        style={{
          fontSize: isMobile ? 13 : 14,
          maxHeight: showCredits ? '200px' : '0',
          opacity: showCredits ? 1 : 0,
          padding: showCredits ? (isMobile ? '1.5vw 3vw' : '0.3vw 0.8vw') : '0',
          border: showCredits
            ? `1px solid ${isDarkMode ? 'rgba(176, 38, 62, 0.4)' : 'rgba(154, 31, 54, 0.4)'}`
            : '1px solid transparent',
          borderRadius: isMobile ? '2vw' : '0.4vw',
          overflow: 'hidden',
          transition: 'opacity 3s ease, max-height 2s ease, padding 3s ease, border-color 3s ease',
          color: maroon,
          marginTop: isMobile ? '0.5vh' : '0.2vw',
        }}
      >
        <em className={showCredits ? 'shimmer-text' : ''}>
          Recreated by Marco Suri, Dylan Pan, Austin Reid, Avish Kumar, Michael DiLallo, and Mr. Piper
        </em>
      </div>
    </footer>
  );
};

export default Footer;
