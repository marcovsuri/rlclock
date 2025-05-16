import React from 'react';

type Props = {
  onClick: () => void;
  hasUnread?: boolean;
};

const AnnouncementsButton: React.FC<Props> = ({
  onClick,
  hasUnread = false,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        // position: 'fixed',
        // top: '2vh',
        // right: '12vw', // Pushes it to the left of the Dark Mode button (which is at 2vw)
        zIndex: 1000,
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.6rem 1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
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
  );
};

export default AnnouncementsButton;
