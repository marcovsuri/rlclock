import { signIn, signOut, isSignedIn } from '~/core/AuthHandler';
import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isDark: boolean;
  isMobile?: boolean;
}

const AuthButton: React.FC<Props> = ({ isDark, isMobile }) => {
  const [signedIn, setSignedIn] = useState(isSignedIn());

  const handleClick = () => {
    if (signedIn) {
      signOut();
      setSignedIn(false);
    } else {
      signIn();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        backgroundColor: isDark ? '#222' : '#eee',
        color: isDark ? '#eee' : '#222',
        border: `1px solid ${isDark ? '#444' : '#ccc'}`,
        padding: isMobile ? '8px 12px' : '10px 16px',
        fontSize: isMobile ? '0.9rem' : '1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, border-color 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? '#333' : '#ddd';
        e.currentTarget.style.borderColor = isDark ? '#666' : '#bbb';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? '#222' : '#eee';
        e.currentTarget.style.borderColor = isDark ? '#444' : '#ccc';
      }}
    >
      {signedIn ? 'Sign Out' : 'Sign In'}
    </motion.button>
  );
};

export default AuthButton;
