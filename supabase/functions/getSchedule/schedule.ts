import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";
import { Schedule, scheduleQuerySchema } from "./types.ts";
import { fetchApiSchedule, transformSchedule } from "./refresh.ts";

/** Returns today's date as "YYYY-MM-DD" in Eastern time, matching the Supabase `date` column */
const getToday = (): string =>
  new Date()
    .toLocaleString("en-CA", { timeZone: "America/New_York" })
    .split(",")[0];

export async function getScheduleForToday(
  supabase: SupabaseClient,
): Promise<Schedule> {
  // Todo: manual reset check

  const today = getToday();

  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("day", today);

  if (error) throw new Error(`Supabase error: ${error.message}`);

  const rows = scheduleQuerySchema.parse(data);

  if (rows.length > 0) {
    return rows[rows.length - 1].schedule;
  }

  // Nothing cached for today — fetch, store, and return
  const schedule = transformSchedule(await fetchApiSchedule());

  const { error: insertError } = await supabase
    .from("schedules")
    .insert({ day: today, schedule });

  if (insertError) {
    console.warn("Failed to cache schedule:", insertError.message);
  }

  return schedule;
}
