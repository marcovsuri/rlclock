import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import AdminSectionContainer from '~/components/admin/dashboard/AdminSectionContainer';

type Props = {
  isDark: boolean;
};

type ChangePasswordResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

const MIN_PASSWORD_LENGTH = 6;

const makeButton = (accent: string): CSSProperties => ({
  minHeight: '2.9rem',
  padding: '0.8rem 1.4rem',
  borderRadius: '16px',
  border: 0,
  backgroundColor: accent,
  color: '#FFFFFF',
  font: 'inherit',
  fontWeight: 700,
  cursor: 'pointer',
});

const createStyles = (isDark: boolean) => {
  const border = isDark
    ? '1px solid rgba(240, 169, 181, 0.18)'
    : '1px solid rgba(154, 31, 54, 0.16)';
  const text = isDark ? '#E8EAED' : '#202124';
  const textMuted = isDark ? '#B8BEC5' : '#5F6368';
  const accent = isDark ? '#D85872' : '#B0263E';

  return {
    form: {
      display: 'grid',
      gap: '1rem',
    } satisfies CSSProperties,
    row: {
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    } satisfies CSSProperties,
    fieldGroup: {
      display: 'grid',
      gap: '0.35rem',
    } satisfies CSSProperties,
    fieldLabel: {
      margin: 0,
      color: accent,
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    } satisfies CSSProperties,
    input: {
      width: '100%',
      minHeight: '2.9rem',
      padding: '0.8rem 0.9rem',
      borderRadius: '16px',
      border,
      backgroundColor: isDark ? 'rgba(31, 33, 36, 0.92)' : '#FFFFFF',
      color: text,
      font: 'inherit',
      boxSizing: 'border-box',
    } satisfies CSSProperties,
    helperText: {
      margin: 0,
      color: textMuted,
      lineHeight: 1.6,
    } satisfies CSSProperties,
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: '0.25rem',
    } satisfies CSSProperties,
    message: {
      margin: 0,
      padding: '0.85rem 1rem',
      borderRadius: '16px',
      background: isDark ? 'rgba(68, 191, 129, 0.14)' : 'rgba(26, 127, 55, 0.08)',
      border: isDark
        ? '1px solid rgba(68, 191, 129, 0.28)'
        : '1px solid rgba(26, 127, 55, 0.18)',
      color: isDark ? '#A7F3C1' : '#1A7F37',
      lineHeight: 1.5,
    } satisfies CSSProperties,
    error: {
      margin: 0,
      padding: '0.85rem 1rem',
      borderRadius: '16px',
      background: isDark ? 'rgba(255, 98, 124, 0.14)' : 'rgba(176, 0, 32, 0.08)',
      border: isDark
        ? '1px solid rgba(255, 98, 124, 0.26)'
        : '1px solid rgba(176, 0, 32, 0.16)',
      color: isDark ? '#FFB3C1' : '#B00020',
      lineHeight: 1.5,
    } satisfies CSSProperties,
  };
};

export default function PasswordChangeSection({ isDark }: Props) {
  const accent = isDark ? '#D85872' : '#B0263E';
  const button = makeButton(accent);
  const styles = createStyles(isDark);
  const fetcher = useFetcher<ChangePasswordResult>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (fetcher.data?.ok) {
      setPassword('');
      setConfirmPassword('');
    }
  }, [fetcher.data]);

  const submitting = fetcher.state !== 'idle';

  return (
    <AdminSectionContainer
      id="password-change"
      eyebrow="Security"
      title="Change Admin Password"
      description="Update the password for the currently signed-in admin account."
      isDark={isDark}
    >
      <fetcher.Form method="post" action="/admin/change-password" style={styles.form}>
        <div style={styles.row}>
          <label style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>New Password</span>
            <input
              type="password"
              name="password"
              value={password}
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              style={styles.input}
              required
            />
          </label>
        </div>

        <p style={styles.helperText}>
          Passwords must be at least {MIN_PASSWORD_LENGTH} characters long.
        </p>

        {fetcher.data?.ok ? (
          <p style={styles.message}>{fetcher.data.message}</p>
        ) : null}

        {fetcher.data && !fetcher.data.ok ? (
          <p style={styles.error}>{fetcher.data.error}</p>
        ) : null}

        <div style={styles.actions}>
          <button type="submit" style={button} disabled={submitting}>
            {submitting ? 'Updating Password…' : 'Update Password'}
          </button>
        </div>
      </fetcher.Form>
    </AdminSectionContainer>
  );
}
