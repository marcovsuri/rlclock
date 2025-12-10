// Setup type definitions for Supabase Edge Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { z } from "zod";
import { parseHTML } from "npm:linkedom"; // ← Replaces HTMLRewriter

// Schema for a single event
const UpcomingEventSchema = z.object({
  team: z.string(),
  opponents: z.array(z.string()),
  date: z.string(), // MM/DD/YYYY
  time: z.string(),
  where: z.string(),
});

type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;

/**
 * Converts "Mar 26, 2025" -> "3/26/2025"
 * Returns null if date is invalid
 */
function normalizeDate(dateStr: string): string | null {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return null;
  }
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

/**
 * Cleans team names (e.g., "Lacrosse - Varsity" -> "Varsity Lacrosse")
 */
function normalizeTeamName(name: string): string {
  const parts = name.split(" - ").map((p) => p.trim());
  return parts.length === 2 ? `${parts[1]} ${parts[0]}` : name;
}

/**
 * Parses the RL athletics events table using linkedom (DOM parser)
 */
async function parseUpcomingEvents(html: string): Promise<UpcomingEvent[]> {
  const events: UpcomingEvent[] = [];

  const { document } = parseHTML(html);

  const rows = document.querySelectorAll("table.events-table tbody tr");
  let rowNumber = 0;

  for (const row of rows) {
    rowNumber++;

    const cells = row.querySelectorAll("td");
    if (cells.length < 5) {
      console.warn(`Row ${rowNumber} skipped: not enough cells`);
      continue;
    }

    const team = normalizeTeamName(cells[0].textContent.trim());
    const opponents = cells[1].textContent.split(",").map((v) => v.trim());
    const rawDate = cells[2].textContent.trim();

    const date = normalizeDate(rawDate);
    const time = cells[3].textContent.trim();
    const where = cells[4].textContent.trim();

    if (!date) {
      console.warn(`Row ${rowNumber} invalid date`);
      continue;
    }

    const rowObj = { team, opponents, date, time, where };

    const parsed = UpcomingEventSchema.safeParse(rowObj);
    if (parsed.success) {
      events.push(parsed.data);
    } else {
      console.warn(`Row ${rowNumber} schema failure:`, parsed.error.errors);
    }
  }

  return events;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

Deno.serve(async (req) => {
  // Must run before anything else
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const response = await fetch("https://www.roxburylatin.org/athletics/calendar/");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const html = await response.text();
    const events = await parseUpcomingEvents(html);

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return empty array on error to avoid 500 due to parsing
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});

/* To invoke locally:

  1. Run `supabase functions serve`
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/getUpcomingSports' \
    --header 'Authorization: Bearer <anon-key>' \
    --header 'Content-Type: application/json'

*/