import React from 'react';
import type { TeamRecord, MatchRecord } from '~/types/sports';
import type { TeamRecordEntry } from '~/utils/sports/records';

interface Props {
  records: TeamRecordEntry[];
  isMobile: boolean;
  isDarkMode: boolean;
}

const createStyles = (isMobile: boolean, isDarkMode: boolean) => {
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
    marginBottom: isMobile ? '2vw' : '0.8vw',
    color: isDarkMode ? '#B0B5BA' : '#5F6368',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto auto',
    gap: isMobile ? '2vw' : '0.6vw',
    alignItems: 'center',
  };
  const columnHeaders: React.CSSProperties = {
    ...grid,
    padding: isMobile ? '0 2vw 1vw' : '0 0.6vw 0.3vw',
    fontSize: isMobile ? 13 : 14,
    fontWeight: 600,
    color: isDarkMode ? '#B0B5BA' : '#5F6368',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };
  const rowList: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '1vw' : '0.25vw',
  };
  const row: React.CSSProperties = {
    ...grid,
    padding: isMobile ? '1.5vw 2vw' : '0.35vw 0.6vw',
    fontSize: 16,
    fontWeight: 500,
    color: isDarkMode ? '#E8EAED' : '#202124',
  };
  const varsityRow: React.CSSProperties = {
    ...row,
    backgroundColor: isDarkMode
      ? 'rgba(138, 31, 46, 0.2)'
      : 'rgba(154, 31, 54, 0.12)',
    borderRadius: isMobile ? '2vw' : '0.4vw',
  };
  const totalRow: React.CSSProperties = {
    ...row,
    fontWeight: 700,
    marginTop: isMobile ? '1vw' : '0.25vw',
    borderTop: isDarkMode
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(0,0,0,0.06)',
    paddingTop: isMobile ? '2vw' : '0.5vw',
  };
  const statCell: React.CSSProperties = {
    textAlign: 'center',
    minWidth: isMobile ? '8vw' : '2.5vw',
  };
  const winColor = isDarkMode ? '#4ade80' : '#16a34a';
  const neutralColor = isDarkMode ? '#B0B5BA' : '#5F6368';

  return {
    card,
    header,
    columnHeaders,
    rowList,
    row,
    varsityRow,
    totalRow,
    statCell,
    winColor,
    neutralColor,
  };
};

const sumRecord = (
  records: TeamRecordEntry[],
  key: keyof MatchRecord,
): number =>
  records.reduce((sum, { record: { record } }) => sum + record[key], 0);

const RecordsCard: React.FC<Props> = ({ records, isMobile, isDarkMode }) => {
  const styles = createStyles(isMobile, isDarkMode);

  return (
    <div style={styles.card}>
      <h3 style={styles.header}>Team Records</h3>
      <div style={styles.columnHeaders}>
        <span />
        <span style={styles.statCell}>W</span>
        <span style={styles.statCell}>L</span>
        <span style={styles.statCell}>T</span>
      </div>
      <div style={styles.rowList}>
        {records.map(({ record: { team, record }, isVarsity }) => (
          <div key={team} style={isVarsity ? styles.varsityRow : styles.row}>
            <span>{team}</span>
            <span style={{ ...styles.statCell, color: styles.winColor }}>
              {record.wins}
            </span>
            <span style={{ ...styles.statCell, color: styles.neutralColor }}>
              {record.losses}
            </span>
            <span style={{ ...styles.statCell, color: styles.neutralColor }}>
              {record.ties}
            </span>
          </div>
        ))}
        {/* Total row */}
        <div style={styles.totalRow}>
          <span>Total</span>
          <span style={{ ...styles.statCell, color: styles.winColor }}>
            {sumRecord(records, 'wins')}
          </span>
          <span style={{ ...styles.statCell, color: styles.neutralColor }}>
            {sumRecord(records, 'losses')}
          </span>
          <span style={{ ...styles.statCell, color: styles.neutralColor }}>
            {sumRecord(records, 'ties')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecordsCard;
