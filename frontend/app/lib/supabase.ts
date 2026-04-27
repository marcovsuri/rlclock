import {
  createBrowserClient,
  createServerClient,
  serializeCookieHeader,
} from '@supabase/ssr';
import type { Database } from '~/types/database.types';

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
}

export function createServerSupabaseClient(request: Request) {
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return (
            request.headers
              .get('cookie')
              ?.split(';')
              .map((c) => {
                const [name, ...rest] = c.trim().split('=');
                return { name: name.trim(), value: rest.join('=').trim() };
              }) ?? []
          );
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options),
            );
          }
        },
      },
    },
  );

  return { supabase, headers };
}
