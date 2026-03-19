import React from 'react';
import type { UpcomingMatch } from '~/types/sports';

interface Props {
  todayMatches: UpcomingMatch[];
  isMobile: boolean;
  isDarkMode: boolean;
}

const createStyles = (isMobile: boolean, isDarkMode: boolean) => {
  const emptyBanner: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '2vw' : '0.6vw',
    padding: isMobile ? '2vw 3vw' : '0.5vw 1vw',
    fontSize: 16,
    color: isDarkMode ? '#B0B5BA' : '#5F6368',
    fontWeight: 500,
  };

  const emptyLabel: React.CSSProperties = {
    color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
    fontWeight: 600,
  };

  const card: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
    borderRadius: isMobile ? '3vw' : '0.8vw',
    boxShadow: isDarkMode
      ? '0 2px 12px rgba(0,0,0,0.5)'
      : '0 2px 12px rgba(0,0,0,0.1)',
    padding: isMobile ? '3vw' : '1.2vw',
    width: '100%',
  };

  const header: React.CSSProperties = {
    fontSize: isMobile ? 13 : 14,
    margin: 0,
    marginBottom: isMobile ? '2vw' : '0.6vw',
    color: isDarkMode ? '#B0B5BA' : '#5F6368',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const matchList: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '1.5vw' : '0.4vw',
  };

  const time: React.CSSProperties = {
    flexShrink: 0,
    marginLeft: isMobile ? '2vw' : '1vw',
  };

  const createMatchRowStyle = (
    isVarsity: boolean,
    isHome: boolean,
  ): React.CSSProperties => ({
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
  });

  return {
    emptyBanner,
    emptyLabel,
    card,
    header,
    matchList,
    time,
    createMatchRowStyle,
  };
};

const TodayMatchesCard: React.FC<Props> = ({
  todayMatches,
  isMobile,
  isDarkMode,
}) => {
  const styles = createStyles(isMobile, isDarkMode);

  if (todayMatches.length === 0) {
    return (
      <div style={styles.emptyBanner}>
        <span style={styles.emptyLabel}>Today's Games:</span>
        <span>None</span>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.header}>Today's Games</h3>
      <div style={styles.matchList}>
        {todayMatches.map((match, i) => {
          const isHome = match.location.toLowerCase().includes('home');
          const isVarsity = match.team.toLowerCase().includes('varsity');
          const opponents = match.opponents.filter(Boolean).join(', ');
          return (
            <div key={i} style={styles.createMatchRowStyle(isVarsity, isHome)}>
              <span>
                ({match.location}) {match.team}
                {opponents ? ` vs. ${opponents}` : ''}
              </span>
              <span style={styles.time}>{match.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayMatchesCard;
