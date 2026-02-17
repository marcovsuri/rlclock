import React, { useState } from 'react';
import { TeamEvent } from '../../types/sports';

interface ResultsCardProps {
  results: TeamEvent[] | undefined | null;
  isMobile: boolean;
  isDarkMode: boolean;
}

/** Decode HTML entities like &amp; → & */
const decodeEntities = (text: string): string => {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
};

type FlatRow = {
  date: string;
  team: string;
  opponent: string;
  score: string;
  outcome: 'Win' | 'Loss' | 'Tie' | '';
};

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
          color: isDarkMode ? '#B0B5BA' : '#5F6368',
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
          color: isDarkMode ? '#B0B5BA' : '#5F6368',
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

  // Mobile collapse logic
  const visibleGroups =
    isMobile && !expanded
      ? (() => {
          let count = 0;
          const result: typeof grouped = [];
          for (const group of grouped) {
            if (count >= MOBILE_COLLAPSED_COUNT) break;
            const remaining = MOBILE_COLLAPSED_COUNT - count;
            if (group.rows.length <= remaining) {
              result.push(group);
              count += group.rows.length;
            } else {
              result.push({
                date: group.date,
                rows: group.rows.slice(0, remaining),
              });
              count += remaining;
            }
          }
          return result;
        })()
      : grouped;

  const totalRows = rows.length;
  const visibleRowCount = visibleGroups.reduce(
    (sum, g) => sum + g.rows.length,
    0,
  );
  const hasMore = isMobile && totalRows > MOBILE_COLLAPSED_COUNT;

  const outcomeColor = (outcome: FlatRow['outcome']): string => {
    if (outcome === 'Win') return isDarkMode ? '#4ade80' : '#16a34a';
    if (outcome === 'Loss') return isDarkMode ? '#B0B5BA' : '#5F6368';
    return isDarkMode ? '#B0B5BA' : '#5F6368';
  };

  const dateYearMap = new Map<string, number>();
  {
    const now = new Date();
    let effectiveYear = now.getFullYear();
    let prevMonth = now.getMonth() + 1;
    for (const group of grouped) {
      const [m] = group.date.split('/').map(Number);
      if (m && m > prevMonth) effectiveYear--;
      if (m) prevMonth = m;
      dateYearMap.set(group.date, effectiveYear);
    }
  }

  const formatDate = (md: string): string => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const [month, day] = md.split('/').map(Number);
    if (!month || !day) return md;
    const year = dateYearMap.get(md) ?? new Date().getFullYear();
    return `${months[month - 1]} ${day}, ${year}`;
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
          color: isDarkMode ? '#B0B5BA' : '#5F6368',
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
        ))}
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
            color: isDarkMode ? '#B0B5BA' : '#5F6368',
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
