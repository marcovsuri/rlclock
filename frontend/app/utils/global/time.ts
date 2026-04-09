/**
 * Returns a Date representing the given clock time (hours:minutes) in Eastern Time,
 * on today's Eastern Time date.
 */
const ETTimeToDate = (hours: number, minutes: number): Date => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const p = Object.fromEntries(
    parts
      .filter((x) => x.type !== 'literal')
      .map(({ type, value }) => [type, Number(value)]),
  );
  // Compute the ET → UTC offset: ms to add to a "naive ET" timestamp to get real UTC
  const offsetMs =
    now.getTime() -
    Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return new Date(
    Date.UTC(p.year, p.month - 1, p.day, hours, minutes) + offsetMs,
  );
};

export { ETTimeToDate };
