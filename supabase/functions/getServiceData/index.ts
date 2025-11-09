import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { z } from "zod";

export const serviceDataSchema = z.object({
  id: z.string().uuid(),
  last_updated: z.string(),
  numDonations: z.number().int(),
  donationGoal: z.number().int()
});

// Centralized CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {});

    const { data, error } = await supabase
      .from("serviceData")
      .select("*")
      .maybeSingle();

    if (error) throw new Error(`Supabase error: ${error.message}`);
    if (!data) {
      return new Response(JSON.stringify({ error: "No service data found" }), {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    console.log("SUPABASE_URL:", supabaseUrl);
    console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "exists" : "missing");
    console.log("Raw data from Supabase:", data);

    const parsedData = serviceDataSchema.parse(data);

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    console.error("Error fetching or parsing data in serviceData:", err);

    return new Response(JSON.stringify({ error: err.message || "Error fetching or parsing data" }), {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
        "Connection": "keep-alive",
      },
    });
  }
});