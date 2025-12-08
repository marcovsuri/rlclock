// Setup type definitions for Supabase Edge Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { z } from "zod";

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
 * Parses HTML using HTMLRewriter (Edge-compatible)
 * Safely handles malformed rows and logs skipped rows
 */
async function parseUpcomingEvents(html: string): Promise<UpcomingEvent[]> {
  const events: UpcomingEvent[] = [];
  let currentRow: Record<string, any> = {};
  let cellIndex = 0;
  let rowNumber = 0;

  const rewriter = new HTMLRewriter()
    .on("table.events-table tbody tr", {
      element() {
        // Reset state for each new row
        currentRow = {};
        cellIndex = 0;
        rowNumber++;
      },
    })
    .on("table.events-table tbody tr td", {
      text(text) {
        try {
          const value = text.text.trim();
          if (!value) {
            cellIndex++;
            return;
          }

          switch (cellIndex) {
            case 0:
              currentRow.team = normalizeTeamName(value);
              break;
            case 1:
              currentRow.opponents = value.split(",").map((v) => v.trim());
              break;
            case 2:
              const normalized = normalizeDate(value);
              if (normalized === null) {
                // Mark as invalid date
                currentRow.date = null;
              } else {
                currentRow.date = normalized;
              }
              break;
            case 3:
              currentRow.time = value;
              break;
            case 4:
              currentRow.where = value;
              break;
            default:
              // Ignore extra cells
              break;
          }
        } catch (err) {
          console.warn(`Error processing cell at row ${rowNumber}, cell ${cellIndex}:`, err);
        } finally {
          cellIndex++;
        }
      },
    })
    .on("table.events-table tbody tr", {
      end() {
        try {
          // Check all required fields are present and valid
          if (
            typeof currentRow.team === "string" &&
            Array.isArray(currentRow.opponents) &&
            currentRow.opponents.length > 0 &&
            typeof currentRow.date === "string" &&
            currentRow.date !== null &&
            typeof currentRow.time === "string" &&
            typeof currentRow.where === "string"
          ) {
            const parsed = UpcomingEventSchema.safeParse(currentRow);
            if (parsed.success) {
              events.push(parsed.data);
            } else {
              console.warn(`Row ${rowNumber} failed schema validation:`, parsed.error.errors);
            }
          } else {
            console.warn(`Row ${rowNumber} skipped due to missing or invalid fields:`, currentRow);
          }
        } catch (err) {
          console.warn(`Error finalizing row ${rowNumber}:`, err);
        }
      },
    });

  try {
    await rewriter.transform(
      new Response(html, {
        headers: { "Content-Type": "text/html" },
      }),
    ).text();
  } catch (err) {
    console.warn("Error during HTMLRewriter transform:", err);
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
