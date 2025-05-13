import React, { useState } from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const [showCredits, setShowCredits] = useState(false);

  const currentYear = new Date().getFullYear();

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1vh 0',
    marginTop: '3vh',
    marginBottom: '2vh',
    color: isDarkMode ? '#f8f9fa' : '#6c757d',
    fontSize: '0.9rem',
    backgroundColor: isDarkMode ? 'black' : 'white',
    transition: 'all 3s ease',
    userSelect: 'none',
  };

  const footerSubtextStyle: React.CSSProperties = {
    fontSize: '0.8rem',
  };

  const foxStyle: React.CSSProperties = {
    cursor: 'pointer',
    display: 'inline-block',
  };

  const hiddenCreditsStyle: React.CSSProperties = {
    marginTop: '1vh',
    fontSize: '0.75rem',
    maxHeight: showCredits ? '200px' : '0',
    opacity: showCredits ? 1 : 0,
    padding: showCredits ? '0.5rem' : '0',
    border: '1px solid rgba(154, 31, 54, 0.4)',
    borderRadius: '12px',
    width: 'fit-content',
    marginLeft: 'auto',
    marginRight: 'auto',
    overflow: 'hidden',
    transition: 'opacity 3s ease, max-height 2s ease, padding 3s ease',
    color: 'rgba(154, 31, 54)',
  };

  return (
    <footer style={footerStyle}>
      <div style={{ marginBottom: '0.5vh' }}>
        <span className="text-muted">
          A friendly&nbsp;
          <span
            style={foxStyle}
            onClick={() => setShowCredits(!showCredits)}
            role="button"
            aria-label="Toggle credits"
          >
            🦊
          </span>
          &nbsp;re/creation. ©&nbsp;{currentYear}
        </span>
      </div>
      <div>
        <span className="text-muted" style={footerSubtextStyle}>
          Full credit to the creators of the original RL Clock. ✌️
        </span>
      </div>
      <div style={hiddenCreditsStyle}>
        <em className={showCredits ? 'shimmer-text' : ''}>
          Recreated by Marco Suri, Dylan Pan, Austin Reid, Michael DiLallo,
          Avish Kumar, and Mr. Piper
        </em>
      </div>
    </footer>
  );
};

export default Footer;
