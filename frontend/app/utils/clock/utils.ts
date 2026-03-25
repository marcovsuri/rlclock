import type { Schedule } from '~/types/clock';

const splitSeconds = (totalSeconds: number) => ({
  hoursRemaining: Math.floor(totalSeconds / 3600),
  minutesRemaining: Math.floor((totalSeconds % 3600) / 60),
  secondsRemaining: totalSeconds % 60,
});

type ClockDisplayInfo = {
  currentBlock: string | null;
  hoursRemaining: number | null;
  minutesRemaining: number | null;
  secondsRemaining: number | null;
};

const nullTime = {
  hoursRemaining: null,
  minutesRemaining: null,
  secondsRemaining: null,
};

const getClockDisplayInfo = (
  now: Date,
  schedule: Schedule,
): ClockDisplayInfo => {
  const firstPeriod = schedule.periods[0];
  const lastPeriod = schedule.periods[schedule.periods.length - 1];

  if (firstPeriod && now < firstPeriod.start) {
    const secondsTotal = Math.floor(
      (firstPeriod.start.getTime() - now.getTime()) / 1000,
    );
    return { currentBlock: 'Before School', ...splitSeconds(secondsTotal) };
  }

  if (lastPeriod && now > lastPeriod.end) {
    return { currentBlock: 'After School', ...nullTime };
  }

  const currentPeriod = schedule.periods.find(
    (p) => now >= p.start && now <= p.end,
  );

  const nextPeriod = !currentPeriod
    ? schedule.periods.find((p) => p.start > now)
    : null;

  const targetTime = currentPeriod?.end ?? nextPeriod?.start ?? null;
  if (!targetTime) return { currentBlock: null, ...nullTime };

  const secondsTotal = Math.floor(
    (targetTime.getTime() - now.getTime()) / 1000,
  );
  const currentBlock =
    currentPeriod?.name ?? (nextPeriod ? `PT => ${nextPeriod.name}` : null);

  return { currentBlock, ...splitSeconds(secondsTotal) };
};

const formatCountdown = (
  hours: number | null,
  minutes: number | null,
  seconds: number | null,
): string | null => {
  if (hours === null || minutes === null || seconds === null) return null;

  const ss = String(seconds).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');

  if (hours > 0) return `${hours}:${mm}:${ss}`;
  if (minutes > 0) return `${minutes}:${ss}`;
  return `0:${ss}`;
};

export { getClockDisplayInfo, formatCountdown };
export type { ClockDisplayInfo };
