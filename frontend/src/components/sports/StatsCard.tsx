import React from 'react';

interface Stats {
  totalGames: number;
  wins: number;
  losses: number;
  winPercent: string | number;
}

interface StatsCardProps {
  stats: Stats;
  isMobile: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, isMobile }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: isMobile ? '4vw' : '1.2vw',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    padding: isMobile ? '4vw' : '2vw',
    color: 'rgb(154, 31, 54)',
    width: isMobile ? '100%' : '48%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    marginBottom: '0vh',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: isMobile ? 26 : 32,
    marginBottom: '2vh',
    textAlign: 'center',
  };

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '3vw' : '1vw',
    marginBottom: '1vh',
    backgroundColor: 'rgba(154, 31, 54, 0.05)',
    borderRadius: isMobile ? '4vw' : '1vw',
    fontSize: 16,
    color: '#202124',
    fontWeight: 500,
  };

  const valueBadgeStyle: React.CSSProperties = {
    backgroundColor: 'rgba(154, 31, 54, 0.15)',
    width: '5em',
    display: 'inline-block',
    textAlign: 'center',
    padding: '0.3em 0',
    borderRadius: '999px',
    fontWeight: 600,
    color: 'rgb(154, 31, 54)',
    whiteSpace: 'nowrap',
  };

  const statsToDisplay = [
    { label: 'Total Record', value: `${stats.wins} - ${stats.losses}` },
    { label: 'Win %', value: `${stats.winPercent}%` },
  ];

  return (
    <div style={cardStyle}>
      <h2 style={headerStyle}>All-School Stats</h2>

      <div style={{ width: '100%' }}>
        {statsToDisplay.map((stat, index) => (
          <div key={index} style={statItemStyle}>
            <span style={{ flex: 1, textAlign: 'left' }}>{stat.label}</span>
            <span style={valueBadgeStyle}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
