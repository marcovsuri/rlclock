import React, { useState } from 'react';
import type { Match } from '~/types/sports';
import ResultsRow from './ResultsRow';
import {
  flattenMatches,
  groupByDate,
  sliceGroups,
  buildDateYearMap,
  formatDate,
} from '~/utils/sports/results';

interface Props {
  results: Match[];
  isMobile: boolean;
  isDark: boolean;
}

const MOBILE_COLLAPSED_COUNT = 3;

const createStyles = (isMobile: boolean, isDark: boolean) => {
  const card: React.CSSProperties = {
    backgroundColor: isDark ? '#2D2E30' : '#FFFFFF',
    borderRadius: isMobile ? '3vw' : '0.8vw',
    boxShadow: isDark
      ? '0 2px 12px rgba(0,0,0,0.5)'
      : '0 2px 12px rgba(0,0,0,0.1)',
    padding: isMobile ? '3vw' : '1.2vw',
    width: '100%',
  };
  const header: React.CSSProperties = {
    fontSize: isMobile ? 13 : 14,
    margin: 0,
    marginBottom: isMobile ? '2vw' : '0.8vw',
    color: isDark ? '#B0B5BA' : '#5F6368',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };
  const groupList: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '3vw' : '0.8vw',
  };
  const dateHeader: React.CSSProperties = {
    fontSize: isMobile ? 13 : 14,
    fontWeight: 600,
    color: isDark ? '#B0263E' : 'rgb(154, 31, 54)',
    marginBottom: isMobile ? '1vw' : '0.3vw',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  };
  const rowList: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '1vw' : '0.25vw',
  };
  const showMoreButton: React.CSSProperties = {
    display: 'block',
    margin: '0 auto',
    marginTop: isMobile ? '2vw' : '0.6vw',
    padding: isMobile ? '1.5vw 4vw' : '0.3vw 1vw',
    fontSize: isMobile ? 13 : 14,
    fontWeight: 500,
    color: isDark ? '#B0263E' : 'rgb(154, 31, 54)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };
  return { card, header, groupList, dateHeader, rowList, showMoreButton };
};

const ResultsCard: React.FC<Props> = ({ results, isMobile, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const styles = createStyles(isMobile, isDark);

  const rows = flattenMatches(results);
  const groups = groupByDate(rows);
  const yearMap = buildDateYearMap(groups);
  const visibleGroups =
    isMobile && !expanded
      ? sliceGroups(groups, MOBILE_COLLAPSED_COUNT)
      : groups;
  const hasMore = isMobile && rows.length > MOBILE_COLLAPSED_COUNT;

  return (
    <div style={styles.card}>
      <h3 style={styles.header}>Past Results</h3>
      <div style={styles.groupList}>
        {visibleGroups.length > 0
          ? visibleGroups.map((group) => (
              <div key={group.date}>
                <div style={styles.dateHeader}>
                  {formatDate(group.date, yearMap)}
                </div>
                <div style={styles.rowList}>
                  {group.rows.map((row, i) => (
                    <ResultsRow
                      key={i}
                      row={row}
                      isMobile={isMobile}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>
            ))
          : 'No results'}
      </div>
      {hasMore && (
        <button
          style={styles.showMoreButton}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : `Show all (${rows.length})`}
        </button>
      )}
    </div>
  );
};

export default ResultsCard;
