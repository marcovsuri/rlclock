import React from 'react';
import type { Period } from '~/types/clock';

type BlockState = 'current' | 'past' | 'future';

interface Props {
  period: Period;
  state: BlockState;
  isMobile: boolean;
  isDark: boolean;
}

const createStyles = (
  state: BlockState,
  isMobile: boolean,
  isDark: boolean,
) => {
  const isCurrent = state === 'current';
  const isPast = state === 'past';
  const isFuture = state === 'future';
  const primaryText = isDark ? '#E8EAED' : '#202124';
  const secondaryText = isDark ? '#B0B5BA' : '#5F6368';
  const accent = '#B0263E';

  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: isMobile ? '0.95rem' : '0.5vw',
    padding: isCurrent
      ? isMobile
        ? 'calc(0.75rem - 1.5px) calc(0.8rem - 1.5px)'
        : 'calc(0.5vw - 1.5px) calc(0.8vw - 1.5px)'
      : isMobile
        ? '0.75rem 0.8rem'
        : '0.5vw 0.8vw',
    backgroundColor: isCurrent
      ? isDark
        ? 'rgba(138, 31, 46, 0.15)'
        : 'rgba(154, 31, 54, 0.08)'
      : isFuture
        ? isDark
          ? '#4A4B4D'
          : '#F2F2F2'
        : 'transparent',
    border: isCurrent ? `1.5px solid ${accent}` : 'none',
    gap: '0.9rem',
    color: isCurrent ? accent : isPast ? secondaryText : primaryText,
  };

  const time: React.CSSProperties = {
    fontSize: isMobile ? '13px' : '14px',
    color: isCurrent ? accent : isPast ? secondaryText : primaryText,
    textAlign: 'right',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  const name: React.CSSProperties = {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: isCurrent ? 600 : 400,
    textAlign: 'left',
    userSelect: 'none',
    flex: 1,
    color: isCurrent ? accent : isPast ? secondaryText : primaryText,
  };

  return { container, time, name };
};

const Block: React.FC<Props> = ({ period, state, isMobile, isDark }) => {
  const { name, start, end } = period;

  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const styles = createStyles(state, isMobile, isDark);

  return (
    <div style={styles.container}>
      <div style={styles.name}>{name}</div>
      <div style={styles.time}>
        {startTime} - {endTime}
      </div>
    </div>
  );
};

export default Block;
