import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const accentColor = isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)';

  return (
    <button
      onClick={() => navigate('/')}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        color: accentColor,
        display: 'flex',
        alignItems: 'center',
        gap: '0.15rem',
        fontSize: 13,
        fontWeight: 400,
      }}
    >
      <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7 1L1.5 6.5L7 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Home
    </button>
  );
};

export default BackButton;
