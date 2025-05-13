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
        position: 'fixed',
        top: '2vh',
        right: '2vw',
        zIndex: 1000,
        backgroundColor: isDarkMode ? '#333' : '#eee',
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
