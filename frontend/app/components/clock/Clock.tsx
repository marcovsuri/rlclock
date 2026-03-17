import type React from 'react';
import type { Schedule } from '~/types/clock';
import ScheduleComponent from './ScheduleComponent';
import { useEffect, useState } from 'react';

interface Props {
  schedule: Schedule;
}

const Clock: React.FC<Props> = ({ schedule }) => {
  // Todo: remove offset
  const OFFSET = -1 * 8 * 60 * 60 * 1000; // 10 hours in ms
  const [now, setNow] = useState(new Date(Date.now() - OFFSET));

  useEffect(() => {
    // Todo: remove offset
    const interval = setInterval(
      () => setNow(new Date(Date.now() - OFFSET)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  const currentPeriod = schedule.periods.find(
    (p) => now >= p.start && now <= p.end,
  );

  const secondsTotal = currentPeriod
    ? Math.floor((currentPeriod.end.getTime() - now.getTime()) / 1000)
    : 0;

  const minutesRemaining = Math.floor(secondsTotal / 60);
  const secondsRemaining = secondsTotal % 60;
  const currentBlock = currentPeriod?.name ?? 'No current block';

  return (
    <>
      <div className="font-sans bg-black text-white flex flex-col items-center justify-center min-h-screen py-[2vh] px-[2vw]">
        <ScheduleComponent schedule={schedule} />
        <div className="text-[5vw] font-bold tracking-[0.3vw] text-center leading-none">
          {currentBlock}
        </div>
        <div className="text-[1.8vw] font-normal tracking-[0.15vw] text-center opacity-70 mt-[0.5vh] mb-[3vh]">
          {String(minutesRemaining).padStart(2, '0')}:
          {String(secondsRemaining).padStart(2, '0')} remaining
        </div>
      </div>
    </>
  );
};

export default Clock;
