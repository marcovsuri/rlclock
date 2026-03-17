import type React from 'react';
import type { Schedule } from '~/types/clock';
import ScheduleComponent from './ScheduleComponent';
import { useEffect, useState } from 'react';
import { OFFSET } from './testing';

interface Props {
  schedule: Schedule;
}

const createStyles = () => {
  const container: React.CSSProperties = {
    fontFamily: 'sans-serif',
    backgroundColor: 'black',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
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

const getClockDisplayInfo = (
  now: Date,
  schedule: Schedule,
): {
  currentBlock: string;
  minutesRemaining: number;
  secondsRemaining: number;
} => {
  const currentPeriod = schedule.periods.find(
    (p) => now >= p.start && now <= p.end,
  );

  const nextPeriod = !currentPeriod
    ? schedule.periods.find((p) => p.start > now)
    : null;

  const secondsTotal = currentPeriod
    ? Math.floor((currentPeriod.end.getTime() - now.getTime()) / 1000)
    : nextPeriod
      ? Math.floor((nextPeriod.start.getTime() - now.getTime()) / 1000)
      : 0;

  const minutesRemaining = Math.floor(secondsTotal / 60);
  const secondsRemaining = secondsTotal % 60;
  const currentBlock =
    currentPeriod?.name ??
    (nextPeriod ? `PT => ${nextPeriod.name}` : 'No school!');

  return { currentBlock, minutesRemaining, secondsRemaining };
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
