import type { CSSProperties } from 'react';

type Props = {
  email: string | null;
  userId: string;
  isDark: boolean;
};

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
    : 'rgba(248, 249, 250, 0.86)';
  const text = isDark ? '#E8EAED' : '#202124';
  const textMuted = isDark ? '#B8BEC5' : '#5F6368';
  const accent = isDark ? '#D85872' : '#B0263E';
  const shadow = isDark
    ? '0 24px 70px rgba(0, 0, 0, 0.35)'
    : '0 20px 60px rgba(32, 33, 36, 0.1)';

  return {
    header: {
      border,
      background: `linear-gradient(180deg, ${surfaceStrong}, ${surface})`,
      backdropFilter: 'blur(16px)',
      boxShadow: shadow,
      borderRadius: '30px',
      padding: '1.75rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      alignItems: 'center',
    } satisfies CSSProperties,
    headerCopy: {
      flex: '1 1 420px',
      display: 'grid',
      gap: '0.65rem',
    } satisfies CSSProperties,
    title: {
      margin: 0,
      color: text,
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      lineHeight: 1.05,
    } satisfies CSSProperties,
    identityCard: {
      flex: '0 1 280px',
      alignSelf: 'stretch',
      padding: '1.25rem',
      borderRadius: '22px',
      background: surfaceMuted,
      border,
      display: 'grid',
      gap: '0.45rem',
    } satisfies CSSProperties,
    metaLabel: {
      margin: 0,
      color: accent,
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    } satisfies CSSProperties,
    metaValue: {
      margin: 0,
      color: text,
      fontSize: '1.2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    } satisfies CSSProperties,
    metaDetail: {
      margin: 0,
      color: textMuted,
      lineHeight: 1.6,
    } satisfies CSSProperties,
  };
};

export default function AdminDashboardHeader({ email, userId, isDark }: Props) {
  const styles = createStyles(isDark);

  return (
    <header id="dashboard-header" style={styles.header}>
      <div style={styles.headerCopy}>
        <h1 style={styles.title}>RL Clock Admin Dashboard</h1>
      </div>

      <div style={styles.identityCard}>
        <p style={styles.metaLabel}>Signed in as</p>
        <p style={styles.metaValue}>{email ?? 'No email provided'}</p>
        <p style={styles.metaDetail}>User ID: {userId}</p>
      </div>
    </header>
  );
}
