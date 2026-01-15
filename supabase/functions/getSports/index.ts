import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { z } from "zod";

// Define Zod schema
const TeamEventSchema = z.object({
  team: z.string(),
  opponents: z.array(z.string()),
  date: z.string(),
  wins: z.array(z.boolean()),
  scores: z.array(z.string()),
});

type TeamEvent = z.infer<typeof TeamEventSchema>;

function parseTeamEvents(html: string): TeamEvent[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];

  const rows = doc.querySelectorAll(".events-table tr");
  const events: TeamEvent[] = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 6) return; // Skip header/invalid rows

    const team = cells[0]?.textContent.trim() || "";
    const opponentsRaw = cells[1]?.innerHTML || "";
    const date = cells[2]?.textContent.trim() || "";
    const resultRaw = cells[cells.length - 2]?.innerHTML || "";
    const scoresRaw = cells[cells.length - 1]?.innerHTML || "";

    const opponents = opponentsRaw.split(/<br\s*\/?>/).map((s) => s.trim()).filter(Boolean);
    const results = resultRaw.split(/<br\s*\/?>/).map((r) => r.trim()).filter(Boolean);
    let scores = scoresRaw
      .split(/<br\s*\/?>/)
      .map((s) => s.trim())
      .filter(Boolean);

    // Ensure scores[0] is never undefined for consumers
    if (scores.length === 0) {
      scores = [];
    }

    const formattedTeam = team
      .replace(/[-–]/g, "-")
      .split("-")
      .map((s) => s.trim())
      .reverse()
      .join(" ");

    let cleanedOpponents = opponents.filter(Boolean);
    let wins: boolean[] = [];

    if (results.length > 0) {
      wins = results.map((r) => r.toLowerCase() === "win");
    } else if (scores.length === cleanedOpponents.length + 1) {
      let homeScoreIndex = 0;
      if (opponents[1]?.trim() === "") homeScoreIndex = 1;
      const homeScore = parseInt(scores[homeScoreIndex], 10);
      wins = scores.map((scoreStr, i) => {
        if (i === homeScoreIndex) return false;
        const oppScore = parseInt(scoreStr, 10);
        return homeScore > oppScore;
      }).filter((_, i) => i !== homeScoreIndex);
    } else {
      console.warn(`Unexpected format for team ${formattedTeam} on ${date}`);
      return;
    }

    scores = scores.map((s) => String(s));

    const event: TeamEvent = {
      team: formattedTeam,
      opponents: cleanedOpponents,
      date,
      wins,
      scores,
    };

    const parsed = TeamEventSchema.safeParse(event);
    if (parsed.success) events.push(parsed.data);
    else console.warn("Invalid row skipped:", parsed.error.format());
  });

  return events;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  try {
    const response = await fetch("https://www.roxburylatin.org/athletics/recent/");
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const html = await response.text();

    const events = parseTeamEvents(html);

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching or parsing data: ", error);
    return new Response(JSON.stringify({ error: "Error fetching or parsing data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});