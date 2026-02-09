import React from 'react';

interface HeaderOverlayProps {
  isDarkMode: boolean;
  isMobile: boolean;
  children?: React.ReactNode;
}

const HeaderOverlay: React.FC<HeaderOverlayProps> = ({
  isDarkMode,
  isMobile,
  children,
}) => {
  // Container style that will hold both gradient overlays and content
  const containerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    textAlign: 'center',
    zIndex: 2,
    padding: isMobile ? '4vw' : '2vw',
    paddingBottom: isMobile ? '0' : '1vh',
    margin: 0,
    borderRadius: isMobile ? '3vw' : '1vw',
  };

  // Common styles for gradient overlays
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(2px)',
    transition: 'opacity 3s ease',
    zIndex: -1,
    borderRadius: isMobile ? '3vw' : '1vw',
  };

  // Light mode gradient
  const lightOverlayStyle: React.CSSProperties = {
    ...overlayStyle,
    background: 'linear-gradient(to bottom, white, rgba(255, 255, 255, 0))',
    opacity: isDarkMode ? 0 : 1,
  };

  // Dark mode gradient
  const darkOverlayStyle: React.CSSProperties = {
    ...overlayStyle,
    background: 'linear-gradient(to bottom, black, rgba(0, 0, 0, 0))',
    opacity: isDarkMode ? 1 : 0,
  };

  return (
    <header style={containerStyle}>
      <div style={lightOverlayStyle} />
      <div style={darkOverlayStyle} />
      {children}
    </header>
  );
};

export default HeaderOverlay;
