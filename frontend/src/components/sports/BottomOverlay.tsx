import React from 'react';

interface BottomOverlayProps {
  isDarkMode: boolean;
  isMobile: boolean;
}

const BottomOverlay: React.FC<BottomOverlayProps> = ({
  isDarkMode,
  isMobile,
}) => {
  const baseOverlayStyle: React.CSSProperties = {
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3vh',
    pointerEvents: 'none',
    backdropFilter: 'blur(2px)',
    zIndex: 3,
    transition: 'opacity 3s ease',
    borderRadius: isMobile ? '3vw' : '1vw',
  };

  // Create two overlays - one for light mode and one for dark mode
  const lightOverlayStyle: React.CSSProperties = {
    ...baseOverlayStyle,
    background: 'linear-gradient(to top, white, rgba(255, 255, 255, 0))',
    opacity: isDarkMode ? 0 : 1,
  };

  const darkOverlayStyle: React.CSSProperties = {
    ...baseOverlayStyle,
    background: 'linear-gradient(to top, black, rgba(0, 0, 0, 0))',
    opacity: isDarkMode ? 1 : 0,
  };

  return (
    <>
      <div style={lightOverlayStyle} />
      <div style={darkOverlayStyle} />
    </>
  );
};

export default BottomOverlay;
