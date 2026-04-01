import { API_Schedule, API_scheduleSchema, Period, Schedule } from "./types.ts";
import { TIMEZONE } from "../_shared/global.ts";

const DUMMY_SCHEDULE: API_Schedule = {
  name: "A-20 (ES)",
  periods: [
    { period: 0, name: "Homeroom", start: "8:20", end: "8:25" },
    { period: 1, name: "Hall Block", start: "8:30", end: "8:50" },
    { period: 2, name: "A Block", start: "8:55", end: "9:40" },
    { period: 3, name: "B Block", start: "9:45", end: "10:30" },
    { period: 4, name: "C Block", start: "10:35", end: "11:20" },
    { period: 5, name: "D Block - First Lunch", start: "11:25", end: "11:50" },
    {
      period: 6,
      name: "D Block - Between Lunches",
      start: "11:55",
      end: "12:10",
    },
    { period: 7, name: "D Block - Second Lunch", start: "12:15", end: "12:40" },
    { period: 8, name: "E Block", start: "12:45", end: "13:30" },
    { period: 9, name: "F Block", start: "13:35", end: "14:20" },
    { period: 10, name: "G Block", start: "14:25", end: "15:10" },
  ],
};

export async function fetchApiSchedule(): Promise<API_Schedule> {
  const url = "https://rl-mod-clock-api.azurewebsites.net/todays_schedule.json";
  const response = await fetch(url);
  const parsed = API_scheduleSchema.parse(await response.json());
  console.log(parsed);
  return parsed;
  // return DUMMY_SCHEDULE;
}

const timeStringToDate = (timeStr: string): Date => {
  // Get offset hours from GMT (changes with DST)
  const now = new Date();
  const today = now.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
  const rawOffset = now.toLocaleDateString("en-US", {
    timeZone: TIMEZONE,
    timeZoneName: "shortOffset",
  })
    .split("GMT")[1]; // "-5" or "-4"

  // Format offset for ISO string
  const [sign, hours] = [rawOffset[0], rawOffset.slice(1)];
  const offset = `${sign}${hours.padStart(2, "0")}:00`; // "-04:00" or "-05:00"

  // Format time for ISO string
  const [h, m] = timeStr.split(":");
  const time = `${h.padStart(2, "0")}:${m}:00`;

  // Create date in correct time zone
  return new Date(`${today}T${time}${offset}`);
};

const getLunchStatus = (name: string): string | null => {
  if (/first lunch/i.test(name)) return "First Lunch";
  if (/second lunch/i.test(name)) return "Second Lunch";
  if (/in between|between lunches/i.test(name)) return "Between Lunches";
  return null;
};

const buildPeriodName = (p: API_Schedule["periods"][number]): string => {
  if (!p.block) {
    // No block field — keep cleaned name (e.g. "Homeroom")
    return p.name.replace(/ Block/g, "").replace(/\bIn Between\b/gi, "Between");
  }

  const lunch = getLunchStatus(p.name);
  if (lunch) {
    // Has block + lunch context (e.g. "A - First Lunch")
    return `${p.block} - ${lunch}`;
  }

  // Normal block (e.g. "F Block")
  return `${p.block} Block`;
};

export function transformSchedule(schedule: API_Schedule): Schedule {
  const periods: Period[] = schedule.periods
    .filter((p) => p.start && p.end)
    .map((p, i) => ({
      index: i,
      name: buildPeriodName(p),
      start: timeStringToDate(p.start),
      end: timeStringToDate(p.end),
    }));

  return { name: schedule.name, periods };
}
