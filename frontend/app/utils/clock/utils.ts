import type { Schedule } from '~/types/clock';

const getClockDisplayInfo = (
  now: Date,
  schedule: Schedule,
): {
  currentBlock: string | null;
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
    currentPeriod?.name ?? (nextPeriod ? `PT => ${nextPeriod.name}` : null);

  return { currentBlock, minutesRemaining, secondsRemaining };
};

export { getClockDisplayInfo };
