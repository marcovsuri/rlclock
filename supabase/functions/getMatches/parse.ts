import { DOMParser } from "deno-dom";
import { Match, MatchResult, matchSchema } from "./types.ts";

const ATHLETICS_URL = "https://www.roxburylatin.org/athletics/recent/";

/** Fetches the raw HTML from the athletics page */
async function fetchAthleticsHTML(): Promise<string> {
  const response = await fetch(ATHLETICS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch athletics page: ${response.status}`);
  }
  const html = await response.text();
  return html;
}

/** Converts "Sport - Team" format to "Team Sport" */
function formatTeamName(raw: string): string {
  return raw
    .replace(/[-–]/g, "-")
    .split("-")
    .map((s) => s.trim())
    .reverse()
    .join(" ");
}

/** Splits an innerHTML string on <br> tags */
function splitOnBreaks(html: string): string[] {
  return html.split(/<br\s*\/?>/).map((s) => s.trim()).filter(Boolean);
}

/** Derives results from explicit result strings ("Win", "Loss", "Tie") */
function resultsFromStrings(results: string[]): MatchResult[] {
  return results.map((r) => {
    const lower = r.toLowerCase();
    if (lower === "win") return "win";
    if (lower === "loss") return "loss";
    return "tie";
  });
}

/** Derives results by comparing home score against each opponent score */
function resultsFromScores(
  scores: string[],
  opponents: string[],
): MatchResult[] | null {
  if (scores.length !== opponents.length + 1) return null;

  // If opponents[1] is empty, the home score is at index 1
  const homeScoreIndex = opponents[1]?.trim() === "" ? 1 : 0;
  const homeScore = parseInt(scores[homeScoreIndex], 10);

  return scores
    .map((scoreStr, i): MatchResult | null => {
      if (i === homeScoreIndex) return null;
      const oppScore = parseInt(scoreStr, 10);
      if (homeScore > oppScore) return "win";
      if (homeScore < oppScore) return "loss";
      return "tie";
    })
    .filter((r): r is MatchResult => r !== null);
}

function parseMatches(html: string): Match[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];

  const rows = doc.querySelectorAll(".events-table tr");
  const matches: Match[] = [];

  rows.forEach((row: any) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 6) return; // Skip header/invalid rows

    const team = formatTeamName(cells[0]?.textContent.trim() ?? "");
    const date: string = cells[2]?.textContent.trim() ?? "";
    const opponents = splitOnBreaks(cells[1]?.innerHTML ?? "");
    const resultStrings = splitOnBreaks(
      cells[cells.length - 2]?.innerHTML ?? "",
    );
    const scores = splitOnBreaks(cells[cells.length - 1]?.innerHTML ?? "");

    // Prefer explicit result strings; fall back to score comparison
    const results = resultStrings.length > 0
      ? resultsFromStrings(resultStrings)
      : resultsFromScores(scores, opponents);

    if (!results) {
      console.warn(`Could not derive results for ${team} on ${date}`);
      return;
    }

    const parsed = matchSchema.safeParse({
      team,
      opponents,
      date,
      results,
      scores,
    });

    if (parsed.success) matches.push(parsed.data);
    else {
      console.warn(
        `Invalid match skipped (${team} on ${date}):`,
        parsed.error.format(),
      );
    }
  });

  return matches;
}

/** The start date of the current season — update each season */
const SEASON_START = new Date("3/9/2026"); // Todo: turn this dynamic

/**
 * Filters matches to only include those from the current season.
 * Dates in the source data are "M/D" with no year, so we infer the year
 * by walking backwards — if a month is greater than the previous, the year rolled over.
 */
function filterMatchesBySeason(matches: Match[]): Match[] {
  let effectiveYear = new Date().getFullYear();
  let prevMonth = new Date().getMonth() + 1;

  return matches.filter((match) => {
    const [month, day] = match.date.split("/").map(Number);
    if (!month || !day) return false;

    if (month > prevMonth) effectiveYear--;
    prevMonth = month;

    return new Date(effectiveYear, month - 1, day) >= SEASON_START;
  });
}

export { fetchAthleticsHTML, filterMatchesBySeason, parseMatches };
