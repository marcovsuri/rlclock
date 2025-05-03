import React from "react";

interface Stats {
  totalGames: number;
  wins: number;
  losses: number;
  winPercent: number;
}

interface StatsCardProps {
  stats: Stats;
  isMobile: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, isMobile }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: isMobile ? "5vw" : "2vw",
        boxShadow: "0 4px 20px rgba(154, 31, 54, 0.5)",
        padding: isMobile ? "4vw" : "2vw",
        color: "rgb(154, 31, 54)",
        width: isMobile ? "100%" : "48%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "5vh" : "2.5vw",
          marginBottom: "2vh",
          textAlign: "center",
        }}
      >
        All-School Stats
      </h2>

      <div style={{ width: "100%" }}>
        {[
          { label: "Total Games", value: stats.totalGames },
          { label: "Wins", value: stats.wins },
          { label: "Losses", value: stats.losses },
          { label: "Win %", value: `${stats.winPercent}%` },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: isMobile ? "3vw" : "1vw",
              marginBottom: "1vh",
              backgroundColor: "rgba(154, 31, 54, 0.05)",
              borderRadius: isMobile ? "4vw" : "1vw",
              fontSize: isMobile ? "4vw" : "1.2vw",
              color: "black",
              fontWeight: 500,
            }}
          >
            <span style={{ flex: 1, textAlign: "left" }}>{stat.label}</span>
            <span
              style={{
                backgroundColor: "rgba(154, 31, 54, 0.15)",
                width: "5em", // Fixed width
                display: "inline-block",
                textAlign: "center",
                padding: "0.3em 0", // No horizontal padding needed now
                borderRadius: "999px",
                fontWeight: 600,
                color: "rgb(154, 31, 54)",
                whiteSpace: "nowrap",
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
