import {
  data,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router';
import { useState, type CSSProperties } from 'react';
import { createServerSupabaseClient } from '~/lib/supabase';
import type { Route } from './+types/signin';
import { safeAdminRedirect } from '~/lib/admin/redirects';
import useTheme from '~/hooks/useTheme';
import HamburgerButton from '~/components/global/nav/HamburgerButton';
import Nav from '~/components/global/nav/Nav';

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
    return data(
      { error: error.message, redirectTo, email },
      { headers, status: 400 },
    );
  }

  throw redirect(redirectTo, { headers });
}

const createStyles = (isDark: boolean) => {
  const border = isDark
    ? '1px solid rgba(240, 169, 181, 0.18)'
    : '1px solid rgba(154, 31, 54, 0.16)';

  const surface = isDark
    ? 'rgba(35, 37, 41, 0.84)'
    : 'rgba(255, 255, 255, 0.82)';

  const surfaceStrong = isDark
    ? 'rgba(31, 33, 36, 0.92)'
    : 'rgba(255, 255, 255, 0.94)';

  const surfaceMuted = isDark
    ? 'rgba(48, 52, 57, 0.9)'
    : 'rgba(248, 249, 250, 0.9)';

  const text = isDark ? '#E8EAED' : '#202124';
  const textMuted = isDark ? '#B8BEC5' : '#5F6368';

  const accent = isDark ? '#D85872' : '#B0263E';
  const accentSoft = isDark
    ? 'rgba(216, 88, 114, 0.14)'
    : 'rgba(176, 38, 62, 0.1)';

  const shadow = isDark
    ? '0 24px 70px rgba(0, 0, 0, 0.35)'
    : '0 20px 60px rgba(32, 33, 36, 0.1)';

  const page: CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1.25rem, 3vw, 2.5rem)',
  };

  const card: CSSProperties = {
    flex: '1 1 420px',
    maxWidth: '520px',
    border,
    borderRadius: '30px',
    padding: 'clamp(1.5rem, 3vw, 2rem)',
    background: `linear-gradient(180deg, ${surfaceStrong}, ${surface})`,
    backdropFilter: 'blur(16px)',
    boxShadow: shadow,
    display: 'grid',
    gap: '1.25rem',
    alignSelf: 'center',
  };

  const cardHeader: CSSProperties = {
    display: 'grid',
    gap: '0.65rem',
  };

  const eyebrow: CSSProperties = {
    margin: 0,
    color: accent,
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  };

  const cardTitle: CSSProperties = {
    margin: 0,
    color: text,
    fontSize: 'clamp(1.9rem, 4vw, 2.5rem)',
    lineHeight: 1.05,
  };

  const cardText: CSSProperties = {
    margin: 0,
    color: textMuted,
    lineHeight: 1.6,
  };

  const form: CSSProperties = {
    display: 'grid',
    gap: '1rem',
  };

  const field: CSSProperties = {
    display: 'grid',
    gap: '0.45rem',
  };

  const label: CSSProperties = {
    color: text,
    fontSize: '0.95rem',
    fontWeight: 600,
  };

  const input: CSSProperties = {
    width: '100%',
    padding: '0.95rem 1rem',
    borderRadius: '16px',
    border,
    background: surfaceMuted,
    color: text,
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  const buttonRow: CSSProperties = {
    display: 'grid',
    gap: '0.8rem',
    marginTop: '0.25rem',
  };

  const button: CSSProperties = {
    border: 0,
    borderRadius: '16px',
    padding: '0.95rem 1rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#FFFFFF',
    background: `linear-gradient(135deg, ${accent}, ${isDark ? '#B0263E' : '#8E1C31'})`,
    cursor: 'pointer',
    boxShadow: isDark
      ? '0 16px 34px rgba(0, 0, 0, 0.28)'
      : '0 16px 34px rgba(176, 38, 62, 0.24)',
  };

  const finePrint: CSSProperties = {
    margin: 0,
    color: textMuted,
    fontSize: '0.95rem',
    lineHeight: 1.6,
  };

  const error: CSSProperties = {
    margin: 0,
    padding: '0.85rem 1rem',
    borderRadius: '16px',
    background: isDark ? 'rgba(255, 98, 124, 0.14)' : 'rgba(176, 0, 32, 0.08)',
    border: isDark
      ? '1px solid rgba(255, 98, 124, 0.26)'
      : '1px solid rgba(176, 0, 32, 0.16)',
    color: isDark ? '#FFB3C1' : '#B00020',
    fontSize: '0.95rem',
  };

  const redirectNote: CSSProperties = {
    margin: 0,
    padding: '0.8rem 1rem',
    borderRadius: '16px',
    background: accentSoft,
    color: text,
    fontSize: '0.95rem',
    lineHeight: 1.6,
  };

  return {
    page,
    card,
    cardHeader,
    eyebrow,
    cardTitle,
    cardText,
    form,
    field,
    label,
    input,
    buttonRow,
    button,
    finePrint,
    error,
    redirectNote,
  };
};

export default function SignInPage({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const redirectTo = loaderData.redirectTo ?? null;
  const loading = navigation.state === 'submitting';
  const emailValue = (
    navigation.formData?.get('email')?.toString() ??
    actionData?.email ??
    ''
  ).trim();

  const [navOpen, setNavOpen] = useState<boolean>(false);
  const styles = createStyles(isDark);

  return (
    <>
      <HamburgerButton
        isDark={isDark}
        onClick={() => setNavOpen((current) => !current)}
      />
      <Nav
        isMobile={false}
        isDark={isDark}
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <main style={styles.page}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.eyebrow}>Sign In</p>
            <h2 style={styles.cardTitle}>Admin Access</h2>
            <p style={styles.cardText}>
              Enter your admin credentials to continue.
            </p>
          </div>

          <p style={styles.redirectNote}>
            Successful sign-in will continue to {redirectTo}.
          </p>

          <Form method="post" style={styles.form}>
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <label htmlFor="admin-email" style={styles.field}>
              <span style={styles.label}>Email</span>
              <input
                id="admin-email"
                name="email"
                style={styles.input}
                type="email"
                placeholder="admin@rlclock.com"
                autoComplete="email"
                defaultValue={emailValue}
                required
              />
            </label>

            <label htmlFor="admin-password" style={styles.field}>
              <span style={styles.label}>Password</span>
              <input
                id="admin-password"
                name="password"
                style={styles.input}
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </label>

            {actionData?.error ? (
              <p style={styles.error}>{actionData.error}</p>
            ) : null}

            <div style={styles.buttonRow}>
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <p style={styles.finePrint}>
                This area is restricted to authorized admins only.
              </p>
            </div>
          </Form>
        </section>
      </main>
    </>
  );
}
