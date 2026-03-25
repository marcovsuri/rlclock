import React from 'react';
import type { Period } from '~/types/clock';
import { OFFSET } from './testing';

interface Props {
  period: Period;
  isMobile: boolean;
  isDarkMode: boolean;
}

const createStyles = (
  isCurrent: boolean,
  isMobile: boolean,
  isDarkMode: boolean,
) => {
  const backgroundColor = isCurrent
    ? isDarkMode
      ? '#ff1a1a'
      : '#7a0000'
    : isDarkMode
      ? '#7a0000'
      : '#ff9e9e';

  const color = isDarkMode ? '#FFF' : isCurrent ? '#FFF' : '#000';

  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: isMobile ? '100%' : 'calc((100% - 40 * 1vw) / 11)',
    minHeight: isMobile ? 'unset' : '45vh',
    transform: isMobile ? 'none' : 'rotate(25deg)',
    borderRadius: isMobile ? '18px' : '0.5vw',
    paddingTop: isMobile ? '0.9rem' : '1vh',
    paddingBottom: isMobile ? '0.9rem' : '1vh',
    paddingLeft: isMobile ? '1rem' : '0.2vw',
    paddingRight: isMobile ? '1rem' : '0.2vw',
    backgroundColor,
    color,
    border: isDarkMode
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(32,33,36,0.08)',
    boxShadow: isDarkMode
      ? '0 12px 28px rgba(0,0,0,0.25)'
      : '0 10px 24px rgba(0,0,0,0.08)',
    gap: isMobile ? '0.75rem' : 0,
  };

  const time: React.CSSProperties = {
    fontSize: isMobile ? '0.85rem' : '0.9vw',
    opacity: isCurrent ? 0.92 : 0.75,
    textAlign: 'center',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    minWidth: isMobile ? '4.5rem' : undefined,
  };

  const name: React.CSSProperties = {
    fontSize: isMobile ? '1.1rem' : '1.5vw',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 'auto',
    writingMode: isMobile ? 'horizontal-tb' : 'vertical-rl',
    textOrientation: isMobile ? 'mixed' : 'mixed',
    transform: isMobile ? 'none' : 'rotate(180deg)',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    flex: isMobile ? 1 : undefined,
  };

  return { container, time, name };
};

const Block: React.FC<Props> = ({ period, isMobile, isDarkMode }) => {
  const { name, start, end } = period;

  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  // Todo: remove offset
  const now = new Date(Date.now() - OFFSET);
  const isCurrent = now >= start && now <= end;

  const styles = createStyles(isCurrent, isMobile, isDarkMode);

  return (
    <div style={styles.container}>
      <div style={styles.time}>{isMobile ? startTime : endTime}</div>
      <div style={styles.name}>{name}</div>
      <div style={styles.time}>{isMobile ? endTime : startTime}</div>
    </div>
  );
};

export default Block;
