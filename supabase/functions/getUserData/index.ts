import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed` }),
      {
        status: 405,
        headers: corsHeaders,
      },
    );
  }

  try {
    const body = await req.json();
    const { blackbaud_id } = body;

    if (!blackbaud_id) {
      return new Response(JSON.stringify({ error: "Missing blackbaud_id" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from("users")
      .select("access_token, refresh_token, access_token_expiration")
      .eq("blackbaud_id", blackbaud_id)
      .single();

    if (error) {
      console.error("Supabase error fetching user:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user tokens" }),
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    let access_token = data.access_token;
    let refresh_token = data.refresh_token;
    let token_expiration = new Date(data.access_token_expiration);

    console.log(`Access token expires at: ${token_expiration.toISOString()}`);

    // Refresh token if expired
    if (token_expiration < new Date()) {
      console.log("Access token expired, refreshing...");

      const BB_APP_ID = Deno.env.get("VITE_BLACKBAUD_CLIENT_ID");
      const BB_APP_SECRET = Deno.env.get("VITE_BLACKBAUD_CLIENT_SECRET");

      if (!BB_APP_ID || !BB_APP_SECRET) {
        console.error("Missing Blackbaud app credentials");
        return new Response(
          JSON.stringify({ error: "Server configuration error" }),
          {
            status: 500,
            headers: corsHeaders,
          },
        );
      }

      const credentials = btoa(`${BB_APP_ID}:${BB_APP_SECRET}`);
      const tokenRes = await fetch("https://oauth2.sky.blackbaud.com/token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token,
        }),
      });

      if (!tokenRes.ok) {
        const text = await tokenRes.text();
        throw new Error(`Failed to refresh access token: ${text}`);
      }

      const tokenData = await tokenRes.json();
      access_token = tokenData.access_token;
      refresh_token = tokenData.refresh_token;
      token_expiration = new Date(Date.now() + tokenData.expires_in * 1000);

      const { error: updateError } = await supabase
        .from("users")
        .update({
          access_token,
          refresh_token,
          access_token_expiration: token_expiration.toISOString(),
        })
        .eq("blackbaud_id", blackbaud_id);

      if (updateError) {
        console.error(
          "Failed to update token in Supabase:",
          updateError.message,
        );
      }

      console.log("Successfully refreshed access token");
    }

    const BB_KEY = Deno.env.get("BLACKBAUD_SUBSCRIPTION_KEY");
    if (!BB_KEY) {
      console.error("Missing BLACKBAUD_SUBSCRIPTION_KEY environment variable");
      return new Response(
        JSON.stringify({ error: "Missing BLACKBAUD_SUBSCRIPTION_KEY" }),
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    let userData;
    console.log("about to make api call");
    try {
      const apiRes = await fetch(
        `https://api.sky.blackbaud.com/school/v1/users/${blackbaud_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Bb-Api-Subscription-Key": BB_KEY,
            "Cache-Control": "no-cache",
          },
        },
      );

      if (!apiRes.ok) {
        const text = await apiRes.text();
        console.error("Blackbaud API error:", apiRes.status, text);
        return new Response(
          JSON.stringify({
            error: "Failed to fetch user",
            details: text,
            status: apiRes.status,
          }),
          {
            status: 502,
            headers: corsHeaders,
          },
        );
      }

      userData = await apiRes.json();
      console.log("Fetched user data from Blackbaud:", userData);
    } catch (networkErr) {
      console.error("Network error fetching user:", networkErr);
      return new Response(
        JSON.stringify({
          error: "Network error fetching user",
          details: String(networkErr),
        }),
        {
          status: 502,
          headers: corsHeaders,
        },
      );
    }

    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: message }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
});
