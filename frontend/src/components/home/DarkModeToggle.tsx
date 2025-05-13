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
        backgroundColor: isDarkMode
          ? 'rgba(31, 31, 31, 0.6)'
          : 'rgba(240, 240, 240, 0.6)',
        opacity: 0.9,
        color: isDarkMode ? '#f5f5f5' : '#1a1a1a',
        border: '1px solid rgba(154, 31, 54, 0.2)',
        borderRadius: '12px',
        padding: '0.6rem 1.2rem',
        cursor: 'pointer',
        fontWeight: 600,
        boxShadow: '0 2px 6px rgba(154, 31, 54, 0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', // for Safari
        transition:
          'background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span>{isDarkMode ? '🌙' : '☀️'}</span>
      <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
};

export default DarkModeToggle;
