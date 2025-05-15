// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

import { z } from "zod";

export const announcementSchema = z.object({
  id: z.string().uuid(), // UUID string
  title: z.string().min(1), // non-empty string
  content: z.string().min(1), // non-empty string
  created_at: z.string(),
  author: z.string().min(1), // non-empty string
  is_active: z.boolean(), // boolean, defaults to true
});

const announcementsSchema = z.array(announcementSchema);

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables",
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {});
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    const parsedData = announcementsSchema.parse(data);

    return new Response(
      JSON.stringify(parsedData),
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
    console.error("Error fetching or parsing data in announcements: ", error);
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/getAnnouncements' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json'

*/
