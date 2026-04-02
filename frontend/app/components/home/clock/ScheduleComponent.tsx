import type React from 'react';
import type { Schedule } from '~/types/clock';
import type { ClockDisplayInfo } from '~/utils/clock/utils';
import Block from './Block';

interface Props {
  clockDisplayInfo: ClockDisplayInfo;
  schedule: Schedule;
  isMobile: boolean;
  isDark: boolean;
}

const createStyles = (isMobile: boolean) => {
  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '0.45rem' : '0.4vw',
    alignItems: 'stretch',
    marginBottom: 0,
    width: '100%',
  };

  return { container };
};

const ScheduleComponent: React.FC<Props> = ({
  clockDisplayInfo,
  schedule,
  isMobile,
  isDark,
}) => {
  const styles = createStyles(isMobile);
  const { currentPeriodIndex, nextPeriodIndex, phase } = clockDisplayInfo;

  return (
    <div style={styles.container}>
      {schedule.periods.map((p, i) => (
        <Block
          key={i}
          period={p}
          state={
            currentPeriodIndex === i
              ? 'current'
              : phase === 'after_school'
                ? 'past'
                : nextPeriodIndex !== null && i < nextPeriodIndex
                  ? 'past'
                  : 'future'
          }
          isMobile={isMobile}
          isDark={isDark}
        />
      ))}
    </div>
  );
};

export default ScheduleComponent;
