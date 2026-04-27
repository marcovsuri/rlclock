import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const cloneDate = (date: Date) => new Date(date.getTime());

function parseStoredSeasonDate(value: string): Date | null {
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

async function getSeasonStartDate(
  supabase: SupabaseClient,
  fallback: Date,
): Promise<Date> {
  const { data, error } = await supabase
    .from("sportsdates")
    .select("start_date")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.warn("Failed to load sports season start date:", error.message);
    return cloneDate(fallback);
  }

  if (!data?.start_date || typeof data.start_date !== "string") {
    return cloneDate(fallback);
  }

  const parsedDate = parseStoredSeasonDate(data.start_date);
  if (!parsedDate) {
    console.warn(
      `Invalid sports season start date in database: ${data.start_date}`,
    );
    return cloneDate(fallback);
  }

  return parsedDate;
}

export { getSeasonStartDate };
