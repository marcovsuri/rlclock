const TIMEZONE = "America/New_York";

/** Returns today's date as "YYYY-MM-DD" in Eastern time, matching the Supabase `date` column */
const getToday = (): string =>
    new Date()
        .toLocaleString("en-CA", { timeZone: TIMEZONE })
        .split(",")[0];

export { getToday, TIMEZONE };
