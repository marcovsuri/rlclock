import type React from 'react';
import type { Schedule } from '~/types/clock';
import ScheduleComponent from './ScheduleComponent';
import { useEffect, useState } from 'react';
import { OFFSET } from './testing';

interface Props {
  schedule: Schedule;
}

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
