// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { load } from "cheerio";
import { z } from "zod";

// Define the schema for a single event
const UpcomingEventSchema = z.object({
  team: z.string(),
  opponents: z.array(z.string()),
  date: z.string(), // Formatted as MM/DD/YYYY
  time: z.string(),
  where: z.string(),
});

// Type derived from schema
type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;

/**
 * Converts "Mar 26, 2025" -> "3/26/2025"
 */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

/**
 * Cleans and normalizes team names (e.g., "Lacrosse - Varsity" -> "Varsity Lacrosse")
 */
function normalizeTeamName(name: string): string {
  const parts = name.split(" - ").map((p) => p.trim());
  return parts.length === 2 ? `${parts[1]} ${parts[0]}` : name;
}

/**
 * Parses the given HTML and returns an array of validated events
 */
export function parseUpcomingEvents(html: string): UpcomingEvent[] {
  const $ = load(html);
  const rows = $("table.events-table tbody tr");
  const events: UpcomingEvent[] = [];

  rows.each((_: any, row: any) => {
    const cells = $(row).find("td");

    // Skip canceled rows (they have fewer cells and usually start with "CANCELED")
    const firstCellText = $(cells[0]).text().trim().toUpperCase();
    if (firstCellText.startsWith("CANCELED")) {
      return; // Skip this row
    }

    if (cells.length < 5) {
      // Unexpected format — skip just in case
      console.warn("Skipping malformed row:", $(row).html());
      return;
    }

    const teamRaw = $(cells[0]).text().trim();
    const opponentsRaw = $(cells[1]).text().trim();
    const dateRaw = $(cells[2]).text().trim();
    const time = $(cells[3]).text().trim();
    const where = $(cells[4]).text().trim();

    const team = normalizeTeamName(teamRaw);
    const opponents = opponentsRaw.split(",").map((o: string) => o.trim());
    const date = normalizeDate(dateRaw);

    const event = {
      team,
      opponents,
      date,
      time,
      where,
    };

    const parsed = UpcomingEventSchema.safeParse(event);
    if (parsed.success) {
      events.push(parsed.data);
    } else {
      console.warn("Invalid row skipped:", parsed.error);
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
      "https://www.roxburylatin.org/athletics/calendar/",
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const html = await response.text();

    const events = parseUpcomingEvents(html);

    // events.splice(0, 1); // Remove the first event => Generally, it is empty. Figure out why??

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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/getUpcomingSports' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
