import {
  data,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router';
import { createServerSupabaseClient } from '~/lib/supabase';
import type { Route } from './+types/signin';
import { safeAdminRedirect } from '~/lib/admin/redirects';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RL Clock | Admin Sign In' },
    { name: 'description', content: 'Admin sign-in for RL Clock' },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { headers, supabase } = createServerSupabaseClient(request);
  const url = new URL(request.url);
  const redirectTo = safeAdminRedirect(url.searchParams.get('redirectTo'));
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) throw redirect(redirectTo, { headers });

  return data({ redirectTo }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  const { headers, supabase } = createServerSupabaseClient(request);
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectTo = safeAdminRedirect(formData.get('redirectTo')?.toString());

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return data({ error: error.message, redirectTo }, { headers, status: 400 });
  }

  throw redirect(redirectTo, { headers });
}

const createStyles = () => {
  const page: React.CSSProperties = {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '1.5rem',
    background:
      'linear-gradient(160deg, rgba(176,38,62,0.12), rgba(255,255,255,0.92))',
    fontFamily: 'Roboto, sans-serif',
  };

  const card: React.CSSProperties = {
    width: 'min(100%, 420px)',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 24px 60px rgba(32, 33, 36, 0.12)',
    border: '1px solid rgba(176, 38, 62, 0.12)',
  };

  const title: React.CSSProperties = {
    margin: 0,
    color: '#202124',
    fontSize: '1.9rem',
  };

  const subtitle: React.CSSProperties = {
    margin: '0.75rem 0 0',
    color: '#5F6368',
    lineHeight: 1.5,
  };

  const form: React.CSSProperties = {
    display: 'grid',
    gap: '0.9rem',
    marginTop: '1.5rem',
  };

  const input: React.CSSProperties = {
    width: '100%',
    padding: '0.9rem 1rem',
    borderRadius: '12px',
    border: '1px solid #DADCE0',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  const button: React.CSSProperties = {
    border: 0,
    borderRadius: '12px',
    padding: '0.95rem 1rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#FFFFFF',
    backgroundColor: '#B0263E',
    cursor: 'pointer',
  };

  const helper: React.CSSProperties = {
    marginTop: '1rem',
    fontSize: '0.95rem',
    color: '#5F6368',
  };

  const error: React.CSSProperties = {
    margin: 0,
    color: '#B00020',
    fontSize: '0.95rem',
  };

  return { page, card, title, subtitle, form, input, button, helper, error };
};

export default function SignInPage({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const redirectTo = actionData?.redirectTo ?? loaderData.redirectTo;
  const loading = navigation.state === 'submitting';

  const styles = createStyles();

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Admin Sign In</h1>
        <p style={styles.subtitle}>
          Sign in with your Supabase admin credentials to access the dashboard.
        </p>
        <Form method="post" style={styles.form}>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input
            name="email"
            style={styles.input}
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="password"
            style={styles.input}
            type="password"
            placeholder="Password"
            required
          />
          {actionData?.error && <p style={styles.error}>{actionData.error}</p>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </Form>
        <p style={styles.helper}>
          You will be redirected after a successful login.
        </p>
      </section>
    </main>
  );
}
