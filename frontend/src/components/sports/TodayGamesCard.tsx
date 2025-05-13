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
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? 'black' : 'white',
        borderRadius: isMobile ? '5vw' : '2vw',
        boxShadow: '0 4px 20px rgba(154, 31, 54, 0.5)',
        padding: isMobile ? '4vw' : '2vw',
        paddingTop: isMobile ? '1vh' : '1vh',
        marginBottom: isMobile ? '0vh' : '2vh',
        color: 'rgb(154, 31, 54)',
        width: isMobile ? '100%' : '80%',
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? '5vh' : '2.5vw',
          marginBottom: '1.5vh',
          textAlign: 'center',
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
          {todayGames === undefined ? 'Loading' : 'No games today.'}
        </p>
      ) : (
        todayGames.map((game, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'rgba(154, 31, 54, 0.3)',
              padding: isMobile ? '2.5vw' : '1vw',
              borderRadius: isMobile ? '3vw' : '1vw',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 500,
              fontSize: isMobile ? '4vw' : '1.2vw',
              color: isDarkMode ? 'white' : 'black',
              marginBottom: '1vh',
            }}
          >
            <span>
              ({game.where}) {game.team} vs. {game.opponents}
            </span>
            <span>{game.time}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default TodayGamesCard;
