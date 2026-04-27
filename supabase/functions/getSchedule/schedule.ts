import { getToday } from "../_shared/global.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";
import { Schedule, scheduleQuerySchema } from "./types.ts";
import { fetchApiSchedule, transformSchedule } from "./refresh.ts";

async function getSchedule(
  supabase: SupabaseClient,
  save: boolean,
  reset: boolean,
): Promise<Schedule> {
  const today = getToday();

  if (!reset) {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("day", today);

    if (error) throw new Error(`Supabase error: ${error.message}`);

    const rows = scheduleQuerySchema.parse(data);

    if (rows.length > 0) {
      return rows[rows.length - 1].schedule;
    }
  }

  // Nothing cached for today — fetch, store, and return

  const schedule = transformSchedule(await fetchApiSchedule());

  if (save) {
    const { error: insertError } = await supabase
      .from("schedules")
      .insert({ day: today, schedule });

    if (insertError) {
      console.warn("Failed to cache schedule:", insertError.message);
    }
  }

  return schedule;
}

export { getSchedule };
