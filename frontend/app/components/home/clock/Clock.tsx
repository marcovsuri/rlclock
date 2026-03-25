import React, { useEffect, useState } from 'react';
import type { Schedule } from '~/types/clock';
import ScheduleComponent from './ScheduleComponent';
import { OFFSET } from './testing';
import { formatCountdown, getClockDisplayInfo } from '~/utils/clock/utils';
import useIsMobile from '~/hooks/useIsMobile';

interface Props {
  schedule: Schedule;
  isDark: boolean;
}

const createStyles = (isMobile: boolean, isDark: boolean) => {
  const container: React.CSSProperties = {
    fontFamily: 'sans-serif',
    color: isDark ? '#FFFFFF' : '#202124',
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '1.25rem' : '1rem',
    paddingTop: isMobile ? '0.5rem' : '1rem',
    paddingBottom: isMobile ? '1rem' : '1.5rem',
    paddingLeft: isMobile ? '1rem' : '2vw',
    paddingRight: isMobile ? '1rem' : '2vw',
  };

  const currentBlock: React.CSSProperties = {
    fontSize: isMobile
      ? 'clamp(2rem, 10vw, 3rem)'
      : 'clamp(2.75rem, 5vw, 4.5rem)',
    fontWeight: 'bold',
    letterSpacing: isMobile ? '0.04em' : '0.08em',
    textAlign: 'center',
    lineHeight: 1,
  };

  const remaining: React.CSSProperties = {
    fontSize: isMobile
      ? 'clamp(1rem, 4.5vw, 1.1rem)'
      : 'clamp(1rem, 1.8vw, 1.5rem)',
    fontWeight: 'normal',
    letterSpacing: '0.04em',
    textAlign: 'center',
    opacity: 0.78,
  };

  return { container, currentBlock, remaining };
};

const Clock: React.FC<Props> = ({ schedule, isDark }) => {
  const isMobile = useIsMobile();

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

  const { currentBlock, hoursRemaining, minutesRemaining, secondsRemaining } =
    getClockDisplayInfo(now, schedule);

  const countdown = formatCountdown(
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
  );

  const styles = createStyles(isMobile, isDark);

  return (
    <div style={styles.container}>
      <ScheduleComponent
        schedule={schedule}
        isMobile={isMobile}
        isDark={isDark}
      />
      <div>
        <div style={styles.currentBlock}>{currentBlock ?? 'No school!'}</div>
        {countdown && <div style={styles.remaining}>{countdown} remaining</div>}
      </div>
    </div>
  );
};

export default Clock;
