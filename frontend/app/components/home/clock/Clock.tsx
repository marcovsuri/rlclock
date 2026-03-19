import type React from 'react';
import type { Schedule } from '~/types/clock';
import ScheduleComponent from './ScheduleComponent';
import { useEffect, useState } from 'react';
import { OFFSET } from './testing';
import { getClockDisplayInfo } from '~/utils/clock/utils';

interface Props {
  schedule: Schedule;
}

const createStyles = () => {
  const container: React.CSSProperties = {
    fontFamily: 'sans-serif',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '2vh',
    paddingBottom: '2vh',
    paddingLeft: '2vw',
    paddingRight: '2vw',
  };

  const currentBlock: React.CSSProperties = {
    fontSize: '5vw',
    fontWeight: 'bold',
    letterSpacing: '0.3vw',
    textAlign: 'center',
    lineHeight: 1,
  };

  const remaining: React.CSSProperties = {
    fontSize: '1.8vw',
    fontWeight: 'normal',
    letterSpacing: '0.15vw',
    textAlign: 'center',
    opacity: 0.7,
    marginTop: '0.5vh',
    marginBottom: '3vh',
  };

  return { container, currentBlock, remaining };
};

const Clock: React.FC<Props> = ({ schedule }) => {
  // Todo: remove offset
  const [now, setNow] = useState(new Date(Date.now() - OFFSET));

  useEffect(() => {
    // Todo: remove offset
    const interval = setInterval(
      () => setNow(new Date(Date.now() - OFFSET)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  const { currentBlock, minutesRemaining, secondsRemaining } =
    getClockDisplayInfo(now, schedule);

  const styles = createStyles();

  return (
    <div style={styles.container}>
      <ScheduleComponent schedule={schedule} />
      <div style={styles.currentBlock}>{currentBlock}</div>
      <div style={styles.remaining}>
        {String(minutesRemaining).padStart(2, '0')}:
        {String(secondsRemaining).padStart(2, '0')} remaining
      </div>
    </div>
  );
};

export default Clock;
