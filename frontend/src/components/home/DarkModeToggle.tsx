import React from 'react';

type Props = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeToggle: React.FC<Props> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      style={{
        // position: 'fixed',
        // top: '2vh',
        // right: '2vw',
        zIndex: 1000,
        backgroundColor: isDarkMode
          ? 'rgba(51, 51, 51, 0.6)'
          : 'rgba(238, 238, 238, 0.6)',
        backdropFilter: 'blur(2px)',
        color: isDarkMode ? 'white' : 'black',
        border: 'none',
        borderRadius: '8px',
        padding: '0.6rem 1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      Dark Mode: {isDarkMode ? 'On' : 'Off'}
    </button>
  );
};

export default DarkModeToggle;
