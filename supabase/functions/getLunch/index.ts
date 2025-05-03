import { menuSchema } from "./schema.ts";
// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// console.info("server started");

Deno.serve(async (req: Request) => {
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

  const s1 = new Date();

  const urlStart =
    "https://www.sagedining.com/microsites/getMenuItems?menuId=127574&date=";
  const date = s1.getMonth() + "/" + s1.getDate() + "/" + s1.getFullYear();
  const urlEnd = "&meal=Lunch&mode=";

  const url = urlStart + date + urlEnd;

  console.log("Lunch URL", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    const parsedData = menuSchema.parse(json);

    console.log("Parsed data correctly");

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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/getLunch' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \

*/
