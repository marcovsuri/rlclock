import React from 'react';
import { TeamEvent } from '../../types/sports';
import BottomOverlay from './BottomOverlay';
import HeaderOverlay from './HeaderOverlay';

interface ResultsCardProps {
  results: TeamEvent[] | undefined | null;
  isMobile: boolean;
  isDarkMode: boolean;
}

const ResultsCard: React.FC<ResultsCardProps> = ({
  results,
  isMobile,
  isDarkMode,
}) => {
  const MOBILE_COLLAPSED_COUNT = 3;
  const [expanded, setExpanded] = useState(false);

  if (results === undefined) {
    return (
      <p
        style={{
          textAlign: 'center',
          fontSize: 16,
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
        }}
      >
        Loading results...
      </p>
    );
  }

  if (results === null || results.length === 0) {
    return (
      <p
        style={{
          textAlign: 'center',
          fontSize: 16,
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
        }}
      >
        No results available.
      </p>
    );
  }

  // Flatten results into individual rows
  const rows: FlatRow[] = [];
  for (const result of results) {
    for (let i = 0; i < result.opponents.length; i++) {
      const rawScore = result.scores?.[i];
      const raw = rawScore ? String(rawScore) : '';
      const [a, b] = raw.split(/-+/).map(Number);

      let outcome: FlatRow['outcome'] = '';
      if (Number.isFinite(a) && Number.isFinite(b)) {
        outcome = a === b ? 'Tie' : result.wins[i] ? 'Win' : 'Loss';
      }

      rows.push({
        date: result.date,
        team: decodeEntities(result.team),
        opponent: decodeEntities(result.opponents[i]),
        score: raw ? raw.replace(/-+/g, ' – ') : '',
        outcome,
      });
    }
  }

  // Group by date
  const grouped: { date: string; rows: FlatRow[] }[] = [];
  for (const row of rows) {
    const last = grouped[grouped.length - 1];
    if (last && last.date === row.date) {
      last.rows.push(row);
    } else {
      grouped.push({ date: row.date, rows: [row] });
    }
  }

  const scrollAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    scrollbarWidth: 'none',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '5vh' : '2.5vw',
    margin: 0,
    color: 'rgb(154, 31, 54)',
    paddingTop: isMobile ? '4vh' : '1vw',
  };

  const resultsWrapperStyle: React.CSSProperties = {
    position: 'relative',
    paddingTop: '1vh',
  };

  const resultItemStyle: React.CSSProperties = {
    backgroundColor: isDarkMode
      ? 'rgba(154, 31, 54, 0.2)'
      : 'rgba(154, 31, 54, 0.05)',
    padding: isMobile ? '2.5vw' : '1vw',
    borderRadius: isMobile ? '3vw' : '1vw',
    fontWeight: 500,
    fontSize: isMobile ? '4vw' : '1.2vw',
    color: isDarkMode ? 'white' : 'black',
    margin: '1vh 2vw',
  };

  const errorStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: isMobile ? '4vh' : '1vw',
    color: 'black',
    justifyContent: 'center',
    marginTop: '2vh',
  };

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
      {/* Header — small label, not giant */}
      <h3
        style={{
          fontSize: isMobile ? 13 : 14,
          margin: 0,
          marginBottom: isMobile ? '2vw' : '0.8vw',
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Past Results
      </h3>

      {/* Grouped results */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '3vw' : '0.8vw',
        }}
      >
        {visibleGroups.map((group) => (
          <div key={group.date}>
            {/* Date header */}
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                fontWeight: 600,
                color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
                marginBottom: isMobile ? '1vw' : '0.3vw',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              {formatDate(group.date)}
            </div>

            {/* Rows for this date */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '1vw' : '0.25vw',
              }}
            >
              {group.rows.map((row, i) => (
                <ResultRow
                  key={i}
                  row={row}
                  isMobile={isMobile}
                  isDarkMode={isDarkMode}
                  outcomeColor={outcomeColor}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'block',
            margin: '0 auto',
            marginTop: isMobile ? '2vw' : '0.6vw',
            padding: isMobile ? '1.5vw 4vw' : '0.3vw 1vw',
            fontSize: isMobile ? 13 : 14,
            fontWeight: 500,
            color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {expanded ? 'Show less' : `Show all (${totalRows})`}
        </button>
      )}
    </div>
  );
};

/** Individual result row with hover state */
const ResultRow: React.FC<{
  row: FlatRow;
  isMobile: boolean;
  isDarkMode: boolean;
  outcomeColor: (outcome: FlatRow['outcome']) => string;
}> = ({ row, isMobile, isDarkMode, outcomeColor }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto auto',
        gap: isMobile ? '1vw' : '0.8vw',
        alignItems: 'center',
        padding: isMobile ? '1.5vw 2vw' : '0.35vw 0.6vw',
        borderRadius: isMobile ? '2vw' : '0.4vw',
        fontSize: 16,
        fontWeight: 500,
        color: isDarkMode ? '#E8EAED' : '#202124',
        backgroundColor: hovered
          ? isDarkMode
            ? '#2D2E30'
            : '#F2F2F2'
          : 'transparent',
        transition: 'background-color 0.15s ease',
        cursor: 'default',
      }}
    >
      {/* Team vs Opponent */}
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {row.team} vs. {row.opponent}
      </span>

      {/* Score — hidden on mobile, shown inline with outcome */}
      {!isMobile && (
        <span
          style={{
            color: isDarkMode ? '#9AA0A6' : '#5F6368',
            textAlign: 'right',
            whiteSpace: 'nowrap',
          }}
        >
          {row.score || '—'}
        </span>
      )}

      {/* Outcome badge */}
      <span
        style={{
          fontWeight: 600,
          color: outcomeColor(row.outcome),
          textAlign: 'right',
          whiteSpace: 'nowrap',
          minWidth: isMobile ? '8vw' : '2.5vw',
        }}
      >
        {row.outcome || '—'}
        {isMobile && row.score ? ` ${row.score}` : ''}
      </span>
    </div>
  );
};

export default ResultsCard;
