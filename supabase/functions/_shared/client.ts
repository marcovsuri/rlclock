import {
    createClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.46.1";

export function getSupabaseClient(): SupabaseClient {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_ANON_KEY");

    if (!url || !key) {
        throw new Error(
            "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables",
        );
    }

    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
