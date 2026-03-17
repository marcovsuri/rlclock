const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

const optionsResponse = (): Response =>
    new Response(null, { status: 204, headers: CORS_HEADERS });

const jsonResponse = (data: unknown, status = 200): Response =>
    new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });

export { CORS_HEADERS, jsonResponse, optionsResponse };
