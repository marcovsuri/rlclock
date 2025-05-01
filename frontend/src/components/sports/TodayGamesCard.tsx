import React from "react";

interface Game {
  time: string;
  team: string;
}

interface TodayGamesCardProps {
  todayGames: Game[];
  isMobile: boolean;
  formatTime: (iso: string) => string;
}

const TodayGamesCard: React.FC<TodayGamesCardProps> = ({
  todayGames,
  isMobile,
  formatTime,
}) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: isMobile ? "5vw" : "2vw",
        boxShadow: "0 4px 20px rgba(154, 31, 54, 0.5)",
        padding: isMobile ? "4vw" : "2vw",
        marginBottom: "4vh",
        color: "rgb(154, 31, 54)",
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "5vh" : "2.5vw",
          marginBottom: "1.5vh",
          textAlign: "center",
        }}
      >
        Today's Games
      </h2>

      {todayGames.length === 0 ? (
        <p style={{ textAlign: "center", fontWeight: 500, color: "black" }}>
          No games today
        </p>
      ) : (
        todayGames.map((game, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "rgba(154, 31, 54, 0.1)",
              padding: isMobile ? "2.5vw" : "1vw",
              borderRadius: isMobile ? "3vw" : "1vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 500,
              fontSize: isMobile ? "4vw" : "1.2vw",
              color: "black",
              marginBottom: "1vh",
            }}
          >
            <span>{game.team}</span>
            <span>{formatTime(game.time)}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default TodayGamesCard;
