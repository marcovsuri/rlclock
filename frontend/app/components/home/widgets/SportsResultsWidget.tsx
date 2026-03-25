import React from 'react';
import Widget from './Widget';
import type { Match } from '~/types/sports';

interface Props {
  matches: Match[];
  isDark: boolean;
}

const createStyles = (isDark: boolean) => {
  const row: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    alignItems: 'center',
    gap: '0.6rem',
  };

  const teamOpponent: React.CSSProperties = {
    fontSize: 'clamp(1rem, 4cqw, 1.2rem)',
    fontWeight: 500,
    color: isDark ? '#E8EAED' : '#202124',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: '0.3em',
  };

  const opponent: React.CSSProperties = {
    fontSize: 'clamp(0.9rem, 3.2cqw, 1rem)',
    fontWeight: 400,
    color: isDark ? '#B0B5BA' : '#5F6368',
  };

  const score: React.CSSProperties = {
    fontSize: 'clamp(1rem, 4cqw, 1.1rem)',
    fontWeight: 500,
    color: isDark ? '#E8EAED' : '#202124',
    whiteSpace: 'nowrap',
    textAlign: 'right',
  };

  const createOutcomeBadgeStyles = (
    result: 'win' | 'tie' | 'loss',
  ): React.CSSProperties => ({
    fontSize: 'clamp(0.85rem, 3.3cqw, 0.95rem)',
    fontWeight: 600,
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    color: result === 'win' ? '#fff' : isDark ? '#E8EAED' : '#202124',
    backgroundColor:
      result === 'win'
        ? isDark
          ? '#16a34a'
          : '#15803d'
        : isDark
          ? '#3A3B3D'
          : '#E8EAED',
    whiteSpace: 'nowrap',
  });

  return { row, teamOpponent, opponent, score, createOutcomeBadgeStyles };
};

const SportsResultsWidget: React.FC<Props> = ({ matches, isDark }) => {
  const styles = createStyles(isDark);

  // Flatten to individual match-opponent rows, take the 4 most recent
  const rows = matches
    .flatMap((match) =>
      match.opponents.map((opponent, i) => ({
        team: match.team,
        opponent,
        score: match.scores[i]?.replace(/-+/, ' - ') ?? '',
        result: match.results[i],
      })),
    )
    .slice(0, 4);

  return (
    <Widget title="Latest Results" to="/sports" isDark={isDark}>
      {rows.map((row, i) => (
        <div key={i} style={styles.row}>
          <span style={styles.teamOpponent}>
            <strong style={{ whiteSpace: 'nowrap' }}>{row.team}</strong>{' '}
            <span style={{ ...styles.opponent, whiteSpace: 'nowrap' }}>
              vs {row.opponent}
            </span>
          </span>
          <span style={styles.score}>{row.score}</span>
          <span style={styles.createOutcomeBadgeStyles(row.result)}>
            {row.result.charAt(0).toUpperCase() + row.result.slice(1)}
          </span>
        </div>
      ))}
    </Widget>
  );
};

export default SportsResultsWidget;
