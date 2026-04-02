import React from 'react';
import Widget from './Widget';
import type { Match } from '~/types/sports';

interface Props {
  matches: Match[] | null;
  isDark: boolean;
  isMobile: boolean;
}

const createStyles = (isDark: boolean) => {
  const row: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto auto auto auto',
    gap: '0.35em 0',
    alignItems: 'center',
    fontVariantNumeric: 'tabular-nums',
  };

  const teamLabel: React.CSSProperties = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingRight: '0.75em',
    fontSize: '16px',
    color: isDark ? '#E8EAED' : '#202124',
  };

  const opponent: React.CSSProperties = {
    color: isDark ? '#B0B5BA' : '#5F6368',
    fontWeight: 400,
    fontSize: '13px',
  };

  const mutedScore: React.CSSProperties = {
    color: isDark ? '#B0B5BA' : '#5F6368',
    fontSize: '14px',
    textAlign: 'right',
  };

  const strongScore: React.CSSProperties = {
    color: isDark ? '#E8EAED' : '#202124',
    fontSize: '14px',
    fontWeight: 700,
    textAlign: 'right',
  };

  const createOutcomeBadgeStyles = (
    result: 'win' | 'tie' | 'loss',
  ): React.CSSProperties => ({
    fontSize: '12px',
    fontWeight: 600,
    padding: '3px 7px 2px',
    borderRadius: '999px',
    color: result === 'win' ? '#4ADE80' : isDark ? '#B0B5BA' : '#5F6368',
    backgroundColor:
      result === 'win'
        ? 'rgba(74, 222, 128, 0.15)'
        : 'rgba(154, 160, 166, 0.15)',
    minWidth: '1.5em',
    textAlign: 'center',
    justifySelf: 'end',
  });

  const item: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 400,
    color: isDark ? '#E8EAED' : '#202124',
    lineHeight: 1.35,
  };

  const dash: React.CSSProperties = {
    color: isDark ? '#B0B5BA' : '#5F6368',
    fontSize: '14px',
    textAlign: 'center',
    padding: '0 2px',
  };

  return {
    row,
    teamLabel,
    opponent,
    mutedScore,
    strongScore,
    createOutcomeBadgeStyles,
    item,
    dash,
  };
};

const SportsResultsWidget: React.FC<Props> = ({
  matches,
  isDark,
  isMobile,
}) => {
  const styles = createStyles(isDark);

  if (!matches || (matches && matches.length === 0))
    return (
      <Widget
        title="Latest Results"
        to="/sports"
        isDark={isDark}
        isMobile={isMobile}
      >
        <div style={styles.item}>No results</div>
      </Widget>
    );

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
    <Widget
      title="Latest Results"
      to="/sports"
      isDark={isDark}
      isMobile={isMobile}
    >
      {rows.map((row, i) => (
        <div key={i} style={styles.row}>
          <span style={styles.teamLabel}>
            {row.team}
            <span style={styles.opponent}> vs {row.opponent}</span>
          </span>
          <span
            style={
              row.result === 'win' ? styles.strongScore : styles.mutedScore
            }
          >
            {row.score.split(/\s*-\s*/)[0] ?? row.score}
          </span>
          <span style={styles.dash}>-</span>
          <span
            style={
              row.result === 'loss'
                ? {
                    ...styles.strongScore,
                    textAlign: 'left',
                    paddingRight: '0.75em',
                  }
                : {
                    ...styles.mutedScore,
                    textAlign: 'left',
                    paddingRight: '0.75em',
                  }
            }
          >
            {row.score.split(/\s*-\s*/)[1] ?? ''}
          </span>
          <span style={styles.createOutcomeBadgeStyles(row.result)}>
            {row.result.charAt(0).toUpperCase() + row.result.slice(1)}
          </span>
        </div>
      ))}
    </Widget>
  );
};

export default SportsResultsWidget;
