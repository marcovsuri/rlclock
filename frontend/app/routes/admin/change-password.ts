import { data } from 'react-router';
import { createServerSupabaseClient } from '~/lib/supabase';
import type { Route } from './+types/change-password';

const MIN_PASSWORD_LENGTH = 6;

export async function action({ request }: Route.ActionArgs) {
  const { headers, supabase } = createServerSupabaseClient(request);
  const formData = await request.formData();
  const password = String(formData.get('password') ?? '').trim();
  const confirmPassword = String(formData.get('confirmPassword') ?? '').trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return data(
      { ok: false, error: 'Your session has expired. Sign in again to change the password.' },
      { headers, status: 401 },
    );
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return data(
      {
        ok: false,
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      },
      { headers, status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return data(
      { ok: false, error: 'New password and confirmation must match.' },
      { headers, status: 400 },
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return data(
      { ok: false, error: error.message },
      { headers, status: 400 },
    );
  }

  return data(
    { ok: true, message: 'Password updated successfully.' },
    { headers },
  );
}
