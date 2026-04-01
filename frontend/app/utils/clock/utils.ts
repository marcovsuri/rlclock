import type { Schedule } from '~/types/clock';

const splitSeconds = (totalSeconds: number) => ({
  hoursRemaining: Math.floor(totalSeconds / 3600),
  minutesRemaining: Math.floor((totalSeconds % 3600) / 60),
  secondsRemaining: totalSeconds % 60,
});

type ClockPhase =
  | 'before_school'
  | 'current_period'
  | 'passing_time'
  | 'after_school'
  | 'no_periods';

type ClockDisplayInfo = {
  phase: ClockPhase;
  currentBlock: string | null;
  hoursRemaining: number | null;
  minutesRemaining: number | null;
  secondsRemaining: number | null;
  currentPeriodIndex: number | null;
  nextPeriodIndex: number | null;
  progressPercent: number | null;
};

type ClockStampInfo = {
  dateLabel: string;
  hour: string;
  minute: string;
  dayPeriod: string;
  blinkOpacity: number;
};

type ClockStatusInfo = {
  clockDisplayInfo: ClockDisplayInfo | null;
  clockStatus: string;
  countdown: string | null;
  progressWidth: string | null;
  showProgress: boolean;
};

const nullTime = {
  hoursRemaining: null,
  minutesRemaining: null,
  secondsRemaining: null,
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const createCountdownInfo = (
  totalSeconds: number,
  durationSeconds: number | null,
) => ({
  ...splitSeconds(totalSeconds),
  progressPercent:
    durationSeconds && durationSeconds > 0
      ? clampPercent(((durationSeconds - totalSeconds) / durationSeconds) * 100)
      : null,
});

const getClockDisplayInfo = (
  now: Date,
  schedule: Schedule,
): ClockDisplayInfo => {
  const firstPeriod = schedule.periods[0];
  const lastPeriod = schedule.periods[schedule.periods.length - 1];

  if (!firstPeriod || !lastPeriod) {
    return {
      phase: 'no_periods',
      currentBlock: null,
      currentPeriodIndex: null,
      nextPeriodIndex: null,
      progressPercent: null,
      ...nullTime,
    };
  }

  if (firstPeriod && now < firstPeriod.start) {
    const secondsTotal = Math.floor(
      (firstPeriod.start.getTime() - now.getTime()) / 1000,
    );
    return {
      phase: 'before_school',
      currentBlock: 'Before School',
      currentPeriodIndex: null,
      nextPeriodIndex: 0,
      progressPercent: 100,
      ...splitSeconds(secondsTotal),
    };
  }

  if (lastPeriod && now > lastPeriod.end) {
    return {
      phase: 'after_school',
      currentBlock: 'After School',
      currentPeriodIndex: null,
      nextPeriodIndex: null,
      progressPercent: null,
      ...nullTime,
    };
  }

  const currentPeriodIndex = schedule.periods.findIndex(
    (period) => now >= period.start && now <= period.end,
  );

  if (currentPeriodIndex !== -1) {
    const currentPeriod = schedule.periods[currentPeriodIndex];
    const secondsTotal = Math.floor(
      (currentPeriod.end.getTime() - now.getTime()) / 1000,
    );
    const durationSeconds = Math.floor(
      (currentPeriod.end.getTime() - currentPeriod.start.getTime()) / 1000,
    );

    return {
      phase: 'current_period',
      currentBlock: currentPeriod.name,
      currentPeriodIndex,
      nextPeriodIndex:
        currentPeriodIndex < schedule.periods.length - 1
          ? currentPeriodIndex + 1
          : null,
      ...createCountdownInfo(secondsTotal, durationSeconds),
    };
  }

  const nextPeriodIndex = schedule.periods.findIndex(
    (period) => period.start > now,
  );
  const nextPeriod =
    nextPeriodIndex !== -1 ? schedule.periods[nextPeriodIndex] : null;
  const previousPeriod =
    nextPeriodIndex > 0 ? schedule.periods[nextPeriodIndex - 1] : null;

  if (!nextPeriod) {
    return {
      phase: 'after_school',
      currentBlock: 'After School',
      currentPeriodIndex: null,
      nextPeriodIndex: null,
      progressPercent: null,
      ...nullTime,
    };
  }

  const secondsTotal = Math.floor(
    (nextPeriod.start.getTime() - now.getTime()) / 1000,
  );
  const durationSeconds = previousPeriod
    ? Math.floor(
        (nextPeriod.start.getTime() - previousPeriod.end.getTime()) / 1000,
      )
    : null;

  return {
    phase: 'passing_time',
    currentBlock: `PT => ${nextPeriod.name}`,
    currentPeriodIndex: null,
    nextPeriodIndex,
    ...createCountdownInfo(secondsTotal, durationSeconds),
  };
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

const getClockStampInfo = (now: Date): ClockStampInfo => {
  const dateLabel = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const timeParts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(now);

  return {
    dateLabel,
    hour: timeParts.find((part) => part.type === 'hour')?.value ?? '',
    minute: timeParts.find((part) => part.type === 'minute')?.value ?? '',
    dayPeriod: timeParts.find((part) => part.type === 'dayPeriod')?.value ?? '',
    blinkOpacity: now.getSeconds() % 2 === 0 ? 1 : 0.35,
  };
};

const getClockStatusInfo = (
  now: Date,
  schedule: Schedule | null,
): ClockStatusInfo => {
  const clockDisplayInfo = schedule ? getClockDisplayInfo(now, schedule) : null;
  const countdown = formatCountdown(
    clockDisplayInfo?.hoursRemaining ?? null,
    clockDisplayInfo?.minutesRemaining ?? null,
    clockDisplayInfo?.secondsRemaining ?? null,
  );
  const progressWidth =
    clockDisplayInfo?.phase === 'before_school'
      ? '100%'
      : clockDisplayInfo?.progressPercent !== null &&
          clockDisplayInfo?.progressPercent !== undefined
        ? `${clockDisplayInfo.progressPercent}%`
        : null;

  return {
    clockDisplayInfo,
    clockStatus: clockDisplayInfo?.currentBlock ?? 'No school',
    countdown,
    progressWidth,
    showProgress: progressWidth !== null,
  };
};

export {
  getClockDisplayInfo,
  formatCountdown,
  getClockStampInfo,
  getClockStatusInfo,
};
export type { ClockDisplayInfo, ClockPhase, ClockStampInfo, ClockStatusInfo };
