import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

Deno.serve(async (req) => {
  console.log("Received request:", req.method, req.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Received request for /signIn");
  if (req.method !== "POST") {
    console.warn(`Invalid method ${req.method} for /signIn`);
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  console.log("Parsing request body for code");

  const { code } = await req.json();
  if (!code) {
    console.warn("Missing code in request body");
    return new Response("Missing code", { status: 400, headers: corsHeaders });
  }

  console.log("Received code:", code);

  const CLIENT_ID = Deno.env.get("VITE_BLACKBAUD_CLIENT_ID");
  const CLIENT_SECRET = Deno.env.get("VITE_BLACKBAUD_CLIENT_SECRET");
  const REDIRECT_URI = Deno.env.get("VITE_BLACKBAUD_REDIRECT_URI");

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    console.error("Missing Blackbaud OAuth environment variables");
    return new Response("Server configuration error", {
      status: 500,
      headers: corsHeaders,
    });
  }

  console.log("Exchanging code for token with Blackbaud OAuth");

  const res = await fetch("https://oauth2.sky.blackbaud.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI!,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Failed to exchange code for token:", errText);
    return new Response(errText, { status: 500, headers: corsHeaders });
  }

  const userData = await res.json();
  console.log("Successfully exchanged code for token:", userData);

  if (!userData.user_id) {
    console.error("Missing user_id in token response");
    return new Response("Invalid token response", {
      status: 500,
      headers: corsHeaders,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables",
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase
    .from("users")
    .upsert({
      blackbaud_id: userData.user_id,
      email: userData.email,
      first_name: userData.given_name,
      last_name: userData.family_name,
      access_token: userData.access_token,
      refresh_token: userData.refresh_token,
      access_token_expiration: new Date(Date.now() + userData.expires_in * 1000)
        .toISOString(),
    }, { onConflict: "blackbaud_id", ignoreDuplicates: true });

  if (error) {
    return new Response(`Database error: ${error.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        first_name: userData.given_name,
        last_name: userData.family_name,
        email: userData.email,
        blackbaud_id: userData.user_id,
      },
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
