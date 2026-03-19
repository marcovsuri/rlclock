import type React from 'react';
import type { Schedule } from '~/types/clock';
import Block from './Block';

interface Props {
  schedule: Schedule;
}

const createStyles = () => {
  const container: React.CSSProperties = {
    display: 'flex',
    gap: '1vw',
    alignItems: 'flex-end',
    marginBottom: '3vh',
    width: '100%',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  };

  return { container };
};

const ScheduleComponent: React.FC<Props> = ({ schedule }) => {
  const styles = createStyles();

  return (
    <>
      <div style={styles.container}>
        {schedule.periods.map((p, i) => (
          <Block key={i} period={p} />
        ))}
      </div>
    </>
  );
};

export default ScheduleComponent;
