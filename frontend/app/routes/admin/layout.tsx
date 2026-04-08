import { createServerSupabaseClient } from '~/lib/supabase';
import type { Route } from './+types/layout';
import { data, Outlet, redirect } from 'react-router';
import { adminSigninUrl } from '~/lib/admin/redirects';

export type AdminUser = {
  email: string | null;
  id: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  const { headers, supabase } = createServerSupabaseClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL(request.url);
    throw redirect(adminSigninUrl(`${url.pathname}${url.search}`), {
      headers,
    });
  }

  return data(
    {
      user: {
        email: user.email ?? null,
        id: user.id,
      } satisfies AdminUser,
    },
    {
      headers,
    },
  );
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  return <Outlet context={{ user: loaderData.user }} />;
}
