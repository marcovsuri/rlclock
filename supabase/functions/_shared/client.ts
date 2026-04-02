import {
    createClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.46.1";

// Admin client (service role)
const getAdminClient = (): SupabaseClient => {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !key) {
        throw new Error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");
    }

    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
};

// User client (respects RLS)
const getUserClient = (req: Request): SupabaseClient => {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_ANON_KEY");

    if (!url || !key) {
        throw new Error("Missing SUPABASE_URL or ANON_KEY");
    }

    return createClient(url, key, {
        global: {
            headers: {
                Authorization: req.headers.get("Authorization")!,
            },
        },
        auth: { persistSession: false, autoRefreshToken: false },
    });
};

export { getAdminClient, getUserClient };
