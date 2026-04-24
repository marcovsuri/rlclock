import {
  NewAPI_Schedule,
  NewAPI_scheduleSchema,
  Period,
  Schedule,
} from "./types.ts";
import { TIMEZONE } from "../_shared/global.ts";

// const DUMMY_SCHEDULE: API_Schedule = {
//   name: "A-20 (ES)",
//   periods: [
//     { period: 0, name: "Homeroom", start: "8:20", end: "8:25" },
//     { period: 1, name: "Hall Block", start: "8:30", end: "8:50" },
//     { period: 2, name: "A Block", start: "8:55", end: "9:40" },
//     { period: 3, name: "B Block", start: "9:45", end: "10:30" },
//     { period: 4, name: "C Block", start: "10:35", end: "11:20" },
//     { period: 5, name: "D Block - First Lunch", start: "11:25", end: "11:50" },
//     {
//       period: 6,
//       name: "D Block - Between Lunches",
//       start: "11:55",
//       end: "12:10",
//     },
//     { period: 7, name: "D Block - Second Lunch", start: "12:15", end: "12:40" },
//     { period: 8, name: "E Block", start: "12:45", end: "13:30" },
//     { period: 9, name: "F Block", start: "13:35", end: "14:20" },
//     { period: 10, name: "G Block", start: "14:25", end: "15:10" },
//   ],
// };

export async function fetchApiSchedule(): Promise<NewAPI_Schedule> {
  const today = new Date().toLocaleDateString("en-US", { timeZone: TIMEZONE });
  // const today = "4/14/2026";
  const url =
    `https://rl-mod-clock-api.azurewebsites.net/sky/masterSchedule?start_date=${today}&end_date=${today}`;
  // console.log(url);
  const response = await fetch(url);
  const parsed = NewAPI_scheduleSchema.parse(await response.json());
  // console.log(parsed);
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

export function transformSchedule(schedule: NewAPI_Schedule): Schedule {
  if (!schedule.value.length) {
    return { name: "No Schedule", periods: [] };
  }

  const day = schedule.value[0];
  const allBlocks = day.schedule_sets.flatMap((set) => set.blocks);

  // Step 1: Remove exact duplicates (same block_id + start_time)
  const seen = new Set<string>();
  const uniqueBlocks = allBlocks.filter((b) => {
    const key = `${b.block_id}-${b.start_time}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Step 2: Drop placeholder blocks — a block_id that appears at a start_time
  // where another block_id also appears, AND that block_id appears again later
  const finalBlocks = uniqueBlocks.filter((b, _, arr) => {
    const sameSlot = arr.filter((x) => x.start_time === b.start_time);
    if (sameSlot.length === 1) return true;

    const appearsLater = arr.some(
      (x) => x.block_id === b.block_id && x.start_time > b.start_time,
    );
    return !appearsLater;
  });

  // Step 3: Merge consecutive entries of the same block_id (double-blocks),
  // but only if no other block occupies the second slot.
  const mergedBlocks = finalBlocks.reduce((acc, b) => {
    const prev = acc[acc.length - 1];
    if (prev && prev.block_id === b.block_id) {
      // Only merge if nothing else shares this start_time
      const conflict = finalBlocks.some(
        (x) => x.start_time === b.start_time && x.block_id !== b.block_id,
      );
      if (!conflict) {
        acc[acc.length - 1] = { ...prev, end_time: b.end_time };
        return acc;
      }
      // If there's a conflict, drop this duplicate entry (the other block wins)
      return acc;
    }
    acc.push(b);
    return acc;
  }, [] as typeof finalBlocks);

  // Step 4: Build periods
  const basePeriods: Period[] = mergedBlocks
    .filter((b) => b.start_time && b.end_time && !b.is_canceled)
    .map((b, i) => {
      const startStr = b.start_time.split("T")[1].substring(0, 5);
      const endStr = b.end_time.split("T")[1].substring(0, 5);
      return {
        index: i,
        name: /^[A-Z]$/.test(b.block) ? `${b.block} Block` : b.block,
        start: timeStringToDate(startStr),
        end: timeStringToDate(endStr),
      };
    });

  // Step 5: Expand 75-minute lunch blocks into 3 sub-periods
  const min = 60 * 1000;
  const expandedPeriods: Period[] = [];
  for (const period of basePeriods) {
    const duration = period.end.getTime() - period.start.getTime();
    if (duration === 75 * min) {
      const t = period.start.getTime();
      expandedPeriods.push(
        {
          index: 0,
          name: `${period.name} (First Lunch)`,
          start: new Date(t),
          end: new Date(t + 25 * min),
        },
        {
          index: 0,
          name: `${period.name} (Between Lunches)`,
          start: new Date(t + 30 * min),
          end: new Date(t + 45 * min),
        },
        {
          index: 0,
          name: `${period.name} (Second Lunch)`,
          start: new Date(t + 50 * min),
          end: new Date(t + 75 * min),
        },
      );
    } else {
      expandedPeriods.push(period);
    }
  }

  // Step 6: Insert Hall block if there's a gap after Homeroom
  const homeroom = expandedPeriods[0];
  const nextPeriod = expandedPeriods[1];
  if (homeroom && nextPeriod) {
    const gap = nextPeriod.start.getTime() - homeroom.end.getTime() -
      (5 * 60 * 1000);
    if (gap > 0) {
      expandedPeriods.splice(1, 0, {
        index: 1,
        name: "Hall",
        start: new Date(homeroom.end.getTime() + 5 * min),
        end: new Date(nextPeriod.start.getTime() - 5 * min),
      });
    }
  }

  // Step 7: Re-index
  expandedPeriods.forEach((p, i) => p.index = i);

  // console.log(expandedPeriods);

  return {
    name: day.schedule_sets.find((s) => s.holiday_label)?.holiday_label ??
      "Schedule",
    periods: expandedPeriods,
  };
}
