import { redirect } from 'react-router';
import { createServerSupabaseClient } from '~/lib/supabase';
import type { Route } from './+types/signout';

export async function action({ request }: Route.ActionArgs) {
  const { headers, supabase } = createServerSupabaseClient(request);
  await supabase.auth.signOut();
  throw redirect('/admin/signin', { headers });
}
