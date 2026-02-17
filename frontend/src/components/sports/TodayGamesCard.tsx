import React from 'react';
import { UpcomingEvent } from '../../types/upcomingSports';

interface TodayGamesCardProps {
  todayGames: UpcomingEvent[] | undefined | null;
  isMobile: boolean;
  isDarkMode: boolean;
}

const TodayGamesCard: React.FC<TodayGamesCardProps> = ({
  todayGames,
  isMobile,
  isDarkMode,
}) => {
  // Inline banner when no games — no card wrapper needed
  if (!todayGames || todayGames.length === 0) {
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
        <span>{todayGames === undefined ? 'Loading...' : 'None'}</span>
      </div>
    );
  }

  // Full card only when games exist
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
        borderRadius: isMobile ? '3vw' : '0.8vw',
        boxShadow: isDarkMode
          ? '0 2px 12px rgba(0,0,0,0.5)'
          : '0 2px 12px rgba(0,0,0,0.1)',
        padding: isMobile ? '3vw' : '1.2vw',
        width: '100%',
      }}
    >
      <h3
        style={{
          fontSize: isMobile ? 13 : 14,
          margin: 0,
          marginBottom: isMobile ? '2vw' : '0.6vw',
          color: isDarkMode ? '#B0B5BA' : '#5F6368',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Today's Games
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '1.5vw' : '0.4vw',
        }}
      >
        {todayGames.map((game, index) => {
          const isHome = game.where.toLowerCase().includes('home');
          const isVarsity = game.team.toLowerCase().includes('varsity');

          return (
            <div
              key={index}
              style={{
                padding: isMobile ? '2vw 2.5vw' : '0.5vw 0.8vw',
                borderRadius: isMobile ? '2vw' : '0.5vw',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: isVarsity ? 600 : 500,
                fontSize: 16,
                color: isDarkMode ? '#E8EAED' : '#202124',
                backgroundColor: isVarsity
                  ? isDarkMode
                    ? 'rgba(138, 31, 46, 0.2)'
                    : 'rgba(154, 31, 54, 0.12)'
                  : isDarkMode
                    ? '#2D2E30'
                    : '#F2F2F2',
                opacity: isHome ? 1 : 0.65,
              }}
            >
              <span>
                ({game.where}) {game.team}{' '}
                {game.opponents[0] !== ''
                  ? 'vs. ' + game.opponents.join(', ')
                  : ''}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  marginLeft: isMobile ? '2vw' : '1vw',
                }}
              >
                {game.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayGamesCard;
