import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';

type Props = {
  onClick: () => void;
  hasUnread?: boolean;
};

const AnnouncementsButton: React.FC<Props> = ({
  onClick,
  hasUnread = false,
}) => {
  const isMobile = useIsMobile();

  return (
    <div style={{ alignSelf: 'flex-start' }}>
      <button
        onClick={onClick}
        style={{
          padding: isMobile ? '0.8vh 4vw' : '0.8vh 1.5vw',
          borderRadius: '12px',
          border: '1px solid rgba(0, 112, 243, 0.2)',
          backgroundColor: 'rgba(0, 112, 243, 0.1)', // soft blue
          color: '#0070f3', // blue text
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0, 112, 243, 0.2)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 112, 243, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 112, 243, 0.2)';
        }}
      >
        📣 Announcements
        {hasUnread && (
          <span
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'red',
              borderRadius: '50%',
              display: 'inline-block',
            }}
          />
        )}
      </button>
    </div>
  );
};

export default AnnouncementsButton;
