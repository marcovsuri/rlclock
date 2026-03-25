import React, { useState } from 'react';
import { type FlatRow, outcomeColor } from '~/utils/sports/results';

interface Props {
  row: FlatRow;
  isMobile: boolean;
  isDark: boolean;
}

const createStyles = (isMobile: boolean, isDark: boolean, hovered: boolean) => {
  const container: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto auto',
    gap: isMobile ? '1vw' : '0.8vw',
    alignItems: 'center',
    padding: isMobile ? '1.5vw 2vw' : '0.35vw 0.6vw',
    borderRadius: isMobile ? '2vw' : '0.4vw',
    fontSize: 16,
    fontWeight: 500,
    color: isDark ? '#E8EAED' : '#202124',
    backgroundColor: hovered ? (isDark ? '#3A3B3D' : '#F2F2F2') : 'transparent',
    transition: 'background-color 0.15s ease',
    cursor: 'default',
  };
  const teamOpponent: React.CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  const score: React.CSSProperties = {
    color: isDark ? '#B0B5BA' : '#5F6368',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  };
  const outcome: React.CSSProperties = {
    fontWeight: 600,
    textAlign: 'right',
    whiteSpace: 'nowrap',
    minWidth: isMobile ? '8vw' : '2.5vw',
  };
  return { container, teamOpponent, score, outcome };
};

const ResultsRow: React.FC<Props> = ({ row, isMobile, isDark }) => {
  const [hovered, setHovered] = useState(false);
  const styles = createStyles(isMobile, isDark, hovered);

  return (
    <div
      style={styles.container}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.teamOpponent}>
        {row.team} vs. {row.opponent}
      </span>
      {!isMobile && <span style={styles.score}>{row.score || '—'}</span>}
      <span
        style={{
          ...styles.outcome,
          color: outcomeColor(row.outcome, isDark),
        }}
      >
        {row.outcome || '—'}
        {isMobile && row.score ? ` ${row.score}` : ''}
      </span>
    </div>
  );
};

export default ResultsRow;
