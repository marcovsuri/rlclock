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
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
          fontWeight: 500,
        }}
      >
        <span style={{ color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)', fontWeight: 600 }}>
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
        backgroundColor: isDarkMode ? 'black' : 'white',
        borderRadius: isMobile ? '5vw' : '2vw',
        boxShadow: '0 4px 20px 4px rgba(154, 31, 54, 0.5)',
        padding: isMobile ? '4vw' : '2vw',
        paddingTop: isMobile ? '1vh' : '1vh',
        marginBottom: isMobile ? '0vh' : '2vh',
        color: 'rgb(154, 31, 54)',
        width: isMobile ? '100%' : '80%',
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? 13 : 14,
          margin: 0,
          marginBottom: isMobile ? '2vw' : '0.6vw',
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Today's Games
      </h2>

      {!todayGames || todayGames.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            fontWeight: 500,
            color: isDarkMode ? 'white' : 'black',
          }}
        >
          {todayGames === undefined ? 'Loading...' : 'No games today.'}
        </p>
      ) : (
        todayGames.map((game, index) => {
          const isHome = game.where.toLowerCase().includes('home');
          const isVarsity = game.team.toLowerCase().includes('varsity');
          const isAway = !isHome;

          const baseStyle = {
            padding: isMobile ? '2.5vw' : '1vw',
            borderRadius: isMobile ? '3vw' : '1vw',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 500,
            fontSize: isMobile ? '4vw' : '1.2vw',
            color: isDarkMode ? 'white' : 'black',
            marginBottom: '1vh',
            backgroundColor: 'rgba(154, 31, 54, 0.3)',
            opacity: 1,
            border: 'none',
            boxShadow: 'none',
          };

          if (isVarsity) {
            baseStyle.border = `2px solid rgba(154, 31, 54, 0.7)`;
            baseStyle.boxShadow = '0 0 15px 2px rgba(154, 31, 54, 0.7)';
          }

          if (isAway) {
            baseStyle.opacity = 0.6;
          }

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
                  ? isDarkMode ? 'rgba(138, 31, 46, 0.2)' : 'rgba(154, 31, 54, 0.12)'
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
              <span>{game.time}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TodayGamesCard;
