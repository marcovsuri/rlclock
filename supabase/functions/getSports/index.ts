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
    // const season = $row.attr("data-season") || "";
    // const rawTeam = $row.attr("data-team") || "";

    const opponents = opponentsRaw.split(/<br\s*\/?>/).map((s) => s.trim())
      .filter(Boolean);
    const wins = resultRaw.split(/<br\s*\/?>/).map((r) =>
      r.trim().toLowerCase() === "win"
    );
    const scores = scoresRaw
      .split(/<br\s*\/?>/)
      .map((s) => s.trim().replace(/\s+/g, "-"))
      .filter(Boolean);

    // Normalize team name capitalization and formatting
    const formattedTeam = team
      .replace(/[-–]/g, "-") // normalize dashes
      .split("-")
      .map((s) => s.trim())
      .reverse()
      .join(" "); // e.g., "Track & Field - Varsity" => "Varsity Track & Field"

    const event: TeamEvent = {
      team: formattedTeam,
      opponents,
      // season,
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
  } catch {
    console.error("Error fetching or parsing data in lunch");
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
