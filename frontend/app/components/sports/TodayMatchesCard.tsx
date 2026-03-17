import React from 'react';

interface Props {
  todayMatches: never[];
  isMobile: boolean;
  isDarkMode: boolean;
}

// TODO: Update component
const TodayMatchesCard: React.FC<Props> = ({
  todayMatches,
  isMobile,
  isDarkMode,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '2vw' : '0.6vw',
        padding: isMobile ? '2vw 3vw' : '0.5vw 1vw',
        fontSize: 16,
        color: isDarkMode ? '#B0B5BA' : '#5F6368',
        fontWeight: 500,
      }}
    >
      <span
        style={{
          color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
          fontWeight: 600,
        }}
      >
        Today's Games:
      </span>
      <span>{todayMatches === undefined ? 'Loading...' : 'None'}</span>
    </div>
  );
};

export default TodayMatchesCard;
