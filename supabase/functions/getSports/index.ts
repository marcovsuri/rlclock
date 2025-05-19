// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { load } from "cheerio";
import { z } from "zod";

// Define Zod schema
const TeamEventSchema = z.object({
  team: z.string(),
  opponents: z.array(z.string()),
  // season: z.string(),
  date: z.string(),
  wins: z.array(z.boolean()),
  scores: z.array(z.string()),
});

type TeamEvent = z.infer<typeof TeamEventSchema>;

function parseTeamEvents(html: string): TeamEvent[] {
  const $ = load(html);
  const events: TeamEvent[] = [];

  $(".events-table tr").each((_, row) => {
    const $row = $(row);

    const team = $row.find("td").eq(0).text().trim();
    const opponentsRaw = $row.find("td").eq(1).html() || "";
    const date = $row.find("td").eq(2).text().trim();
    const resultRaw = $row.find("td").eq(5).html() || "";
    const scoresRaw = $row.find("td").eq(6).html() || "";

    const opponents = opponentsRaw.split(/<br\s*\/?>/).map((s) => s.trim());
    const results = resultRaw.split(/<br\s*\/?>/).map((r) => r.trim()).filter(
      Boolean,
    );
    const scores = scoresRaw.split(/<br\s*\/?>/).map((s) => s.trim()).filter(
      Boolean,
    );

    const formattedTeam = team
      .replace(/[-–]/g, "-")
      .split("-")
      .map((s) => s.trim())
      .reverse()
      .join(" ");

    let cleanedOpponents = opponents.filter((s) => s.length > 0);
    let wins: boolean[] = [];

    // Case 1: Explicit results listed
    if (results.length > 0) {
      wins = results.map((r) => r.toLowerCase() === "win");
    } // Case 2: Track-style scores with 1 home team score (first OR second)
    else if (scores.length === cleanedOpponents.length + 1) {
      let homeScoreIndex = 0;
      // Check if second opponent is empty string: implies home score is second
      if (opponents[1]?.trim() === "") {
        homeScoreIndex = 1;
      }

      const homeScore = parseInt(scores[homeScoreIndex], 10);
      wins = scores.map((scoreStr, i) => {
        if (i === homeScoreIndex) return false; // Skip own score
        const oppScore = parseInt(scoreStr, 10);
        return homeScore > oppScore;
      }).filter((_, i) => i !== homeScoreIndex); // Remove home result from win list
    } else {
      console.warn(`Unexpected format for team ${formattedTeam} on ${date}`);
      return;
    }

    const event: TeamEvent = {
      team: formattedTeam,
      opponents: cleanedOpponents,
      date,
      wins,
      scores,
    };

    const parsed = TeamEventSchema.safeParse(event);
    if (parsed.success) {
      events.push(parsed.data);
    } else {
      console.warn("Invalid row skipped:", parsed.error.format());
    }
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
    const response = await fetch(
      "https://www.roxburylatin.org/athletics/recent/",
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const html = await response.text();

    const events = parseTeamEvents(html);

    events.splice(0, 1); // Remove the first event => Generally, it is empty. Figure out why??

    return new Response(
      JSON.stringify(events),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching or parsing data in lunch: ", error);
    return new Response(
      JSON.stringify({ error: "Error fetching or parsing data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/getSports' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json'

*/
