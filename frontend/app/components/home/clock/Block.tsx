import React from 'react';
import type { Period } from '~/types/clock';
import { OFFSET } from './testing';

interface Props {
  period: Period;
}

const createStyles = (isCurrent: boolean) => {
  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'calc((100% - 40 * 1vw) / 11)',
    height: '45vh',
    transform: 'rotate(25deg)',
    borderRadius: '0.5vw',
    paddingTop: '1vh',
    paddingBottom: '1vh',
    paddingLeft: '0.2vw',
    paddingRight: '0.2vw',
    backgroundColor: isCurrent ? '#ff1a1a' : '#7a0000',
  };

  const time: React.CSSProperties = {
    fontSize: '0.9vw',
    opacity: 0.8,
    textAlign: 'center',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  };

  const name: React.CSSProperties = {
    fontSize: '1.5vw',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 'auto',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    transform: 'rotate(180deg)',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  };

  return { container, time, name };
};

const Block: React.FC<Props> = ({ period }) => {
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

  const styles = createStyles(isCurrent);

  return (
    <div style={styles.container}>
      <div style={styles.time}>{endTime}</div>
      <div style={styles.name}>{name}</div>
      <div style={styles.time}>{startTime}</div>
    </div>
  );
};

export default Block;
