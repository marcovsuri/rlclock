import { scheduleSchema, type Period, type Schedule } from '~/types/clock';

// TODO: Remove duplicate code (all of this is trusted from the edge function, all any types should be removed for safety)

async function fetchApiSchedule(): Promise<any> {
  const url = 'https://rl-mod-clock-api.azurewebsites.net/todays_schedule.json';
  const response = await fetch(url);
  return response.json();
}

const timeStringToDate = (timeStr: string): Date => {
  // Get offset hours from GMT (changes with DST)
  const now = new Date();
  const today = now.toLocaleDateString('en-CA', {
    timeZone: 'America/New_York',
  });
  const rawOffset = now
    .toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'shortOffset',
    })
    .split('GMT')[1]; // "-5" or "-4"

  // Format offset for ISO string
  const [sign, hours] = [rawOffset[0], rawOffset.slice(1)];
  const offset = `${sign}${hours.padStart(2, '0')}:00`; // "-04:00" or "-05:00"

  // Format time for ISO string
  const [h, m] = timeStr.split(':');
  const time = `${h.padStart(2, '0')}:${m}:00`;

  // Create date in correct time zone
  return new Date(`${today}T${time}${offset}`);
};

const getLunchStatus = (name: string): string | null => {
  if (/first lunch/i.test(name)) return 'First Lunch';
  if (/second lunch/i.test(name)) return 'Second Lunch';
  if (/in between|between lunches/i.test(name)) return 'Between Lunches';
  return null;
};

// ! Unsafe with `any` type
const buildPeriodName = (p: any['periods'][number]): string => {
  if (!p.block) {
    // No block field — keep cleaned name (e.g. "Homeroom")
    return p.name.replace(/ Block/g, '').replace(/\bIn Between\b/gi, 'Between');
  }

  const lunch = getLunchStatus(p.name);
  if (lunch) {
    // Has block + lunch context (e.g. "A - First Lunch")
    return `${p.block} - ${lunch}`;
  }

  // Normal block (e.g. "F Block")
  return `${p.block} Block`;
};

// ! Unsafe with `any` type
function transformSchedule(schedule: any): Schedule {
  const periods: Period[] = schedule.periods
    .filter((p: any) => p.start && p.end)
    .map((p: any, i: any) => ({
      index: i,
      name: buildPeriodName(p),
      start: timeStringToDate(p.start),
      end: timeStringToDate(p.end),
    }));

  // ! Only safe place here
  return scheduleSchema.parse({ name: schedule.name, periods });
}

export async function fetchSchedule() {
  return transformSchedule(await fetchApiSchedule());
}
