import { DOMParser } from "deno-dom";
import type { UpcomingMatch } from "./types.ts";
import { upcomingMatchSchema } from "./types.ts";

const ATHLETICS_URL = "https://www.roxburylatin.org/athletics/calendar/";

/** Fetches the raw HTML from the athletics calendar page */
async function fetchCalendarHTML(): Promise<string> {
  const response = await fetch(ATHLETICS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch calendar: ${response.status}`);
  }
  return response.text();
}

/** Converts "Sport - Team" format to "Team Sport" e.g. "Lacrosse - Varsity" → "Varsity Lacrosse" */
function formatTeamName(raw: string): string {
  const parts = raw.split(" - ").map((p) => p.trim());
  return parts.length === 2 ? `${parts[1]} ${parts[0]}` : raw;
}

/** Converts "Mar 26, 2025" to "3/26/2025" — returns null if the date is unparseable */
function formatDate(raw: string): string | null {
  const date = new Date(raw);
  if (isNaN(date.getTime())) return null;
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

/** Parses the upcoming matches table from the athletics calendar HTML */
function parseUpcomingMatches(html: string): UpcomingMatch[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];
  const rows = doc.querySelectorAll("table.events-table tbody tr");
  const matches: UpcomingMatch[] = [];

  rows.forEach((row, i: number) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 5) {
      console.warn(`Row ${i + 1} skipped: not enough cells`);
      return;
    }

    const team = formatTeamName(cells[0].textContent.trim());
    const opponents = cells[1].textContent.split(",").map((v: string) =>
      v.trim()
    );
    const date = formatDate(cells[2].textContent.trim());
    const time = cells[3].textContent.trim();
    const location = cells[4].textContent.trim();

    if (!date) {
      console.warn(
        `Row ${i + 1} skipped: invalid date "${cells[2].textContent.trim()}"`,
      );
      return;
    }

    const parsed = upcomingMatchSchema.safeParse({
      team,
      opponents,
      date,
      time,
      location,
    });
    if (parsed.success) matches.push(parsed.data);
    else console.warn(`Row ${i + 1} skipped:`, parsed.error);
  });

  return matches;
}

/** The start date of the current season — update each season */
const SEASON_START = new Date("3/14/2026"); // Todo: turn this dynamic

/**
 * Filters upcoming matches to only include those from the current season.
 * Unlike past matches, upcoming match dates include the year ("M/D/YYYY"),
 * so no year-inference is needed — we can parse and compare directly.
 */
function filterUpcomingMatchesBySeason(
  matches: UpcomingMatch[],
): UpcomingMatch[] {
  return matches.filter((match) => {
    const date = new Date(match.date);
    return date.getTime() && date >= SEASON_START;
  });
}

export {
  fetchCalendarHTML,
  filterUpcomingMatchesBySeason,
  parseUpcomingMatches,
};
