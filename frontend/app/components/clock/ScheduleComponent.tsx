import type React from 'react';
import type { Schedule } from '~/types/clock';
import Block from './Block';

interface Props {
  schedule: Schedule;
}

const ScheduleComponent: React.FC<Props> = ({ schedule }) => {
  return (
    <>
      <div className="flex gap-[1vw] items-end mb-[3vh] w-full flex-nowrap justify-center">
        {schedule.periods.map((p, i) => (
          <Block key={i} period={p} />
        ))}
      </div>
    </>
  );
};

export default ScheduleComponent;
