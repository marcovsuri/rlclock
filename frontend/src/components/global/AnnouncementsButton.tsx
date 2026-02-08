import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';

type Props = {
  onClick: () => void;
  isDarkMode?: boolean;
  hasUnread?: boolean;
};

const AnnouncementsButton: React.FC<Props> = ({
  onClick,
  isDarkMode = false,
  hasUnread = false,
}) => {
  const isMobile = useIsMobile();

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: isMobile ? '0.8rem 1.1rem' : '0.45vw 1vw',
        borderLeft: '3px solid transparent',
        border: 'none',
        backgroundColor: 'transparent',
        color: isDarkMode ? '#9AA0A6' : '#5F6368',
        fontSize: 16,
        fontWeight: 450,
        letterSpacing: '0.01em',
        cursor: 'pointer',
        transition: 'color 3s ease',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = isDarkMode
          ? '#E8EAED' : '#202124';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = isDarkMode
          ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)';
      }}
    >
      <span>Announcements</span>
      {hasUnread && (
        <span
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: isDarkMode ? '#C43C5A' : 'rgb(154, 31, 54)',
            borderRadius: '50%',
            flexShrink: 0,
          }}
        />
      )}
    </button>
  );
};

export default AnnouncementsButton;
