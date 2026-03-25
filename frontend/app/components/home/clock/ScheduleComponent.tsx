import type React from 'react';
import type { Schedule } from '~/types/clock';
import Block from './Block';

interface Props {
  schedule: Schedule;
  isMobile: boolean;
  isDark: boolean;
}

const createStyles = (isMobile: boolean) => {
  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '0.75rem' : '1vw',
    alignItems: isMobile ? 'stretch' : 'flex-end',
    marginBottom: isMobile ? 0 : '1rem',
    width: '100%',
    maxWidth: isMobile ? '520px' : '100%',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  };

  return { container };
};

const ScheduleComponent: React.FC<Props> = ({ schedule, isMobile, isDark }) => {
  const styles = createStyles(isMobile);

  return (
    <>
      <div style={styles.container}>
        {schedule.periods.map((p, i) => (
          <Block key={i} period={p} isMobile={isMobile} isDark={isDark} />
        ))}
      </div>
    </>
  );
};

export default ScheduleComponent;
