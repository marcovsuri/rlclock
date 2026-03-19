// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { jsonResponse, optionsResponse } from "../_shared/cors.ts";
import {
  fetchCalendarHTML,
  filterUpcomingMatchesBySeason,
  parseUpcomingMatches,
} from "./parse.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const html = await fetchCalendarHTML();
    const matches = parseUpcomingMatches(html);
    const seasonMatches = filterUpcomingMatchesBySeason(matches);

    return jsonResponse(seasonMatches);
  } catch (error) {
    console.error("Failed to get upcoming matches:", error);
    return jsonResponse({ error: "Failed to get upcoming matches" }, 500);
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/getUpcomingMatches' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
