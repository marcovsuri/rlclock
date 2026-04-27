import type { CSSProperties } from 'react';
import { Form } from 'react-router';

type Props = {
  sections: { id: string; label: string }[];
  signingOut: boolean;
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
    sidebar: {
      flex: '0 0 280px',
      minWidth: '260px',
      alignSelf: 'stretch',
      position: 'sticky',
      top: '1.5rem',
      height: 'calc(100vh - 3rem)',
    } satisfies CSSProperties,
    sidebarCard: {
      border,
      background: `linear-gradient(180deg, ${surfaceStrong}, ${surface})`,
      backdropFilter: 'blur(16px)',
      boxShadow: shadow,
      height: '100%',
      borderRadius: '28px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    } satisfies CSSProperties,
    sidebarTop: {
      display: 'grid',
      gap: '0.5rem',
    } satisfies CSSProperties,
    eyebrow: {
      margin: 0,
      color: accent,
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    } satisfies CSSProperties,
    sidebarTitle: {
      margin: 0,
      color: text,
      fontSize: '1.9rem',
      fontWeight: 700,
      lineHeight: 1.1,
    } satisfies CSSProperties,
    sidebarText: {
      margin: 0,
      color: textMuted,
      lineHeight: 1.6,
    } satisfies CSSProperties,
    nav: {
      display: 'grid',
      gap: '0.7rem',
    } satisfies CSSProperties,
    navLink: {
      display: 'flex',
      alignItems: 'center',
      minHeight: '48px',
      padding: '0.8rem 1rem',
      borderRadius: '16px',
      border,
      background: surfaceMuted,
      color: text,
      textDecoration: 'none',
      fontWeight: 600,
    } satisfies CSSProperties,
    footer: {
      marginTop: 'auto',
      display: 'grid',
      gap: '0.5rem',
    } satisfies CSSProperties,
    signout: {
      width: '100%',
      border: 0,
      borderRadius: '16px',
      padding: '0.95rem 1rem',
      backgroundColor: accent,
      color: '#FFFFFF',
      font: 'inherit',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: isDark
        ? '0 14px 30px rgba(0, 0, 0, 0.28)'
        : '0 14px 30px rgba(176, 38, 62, 0.2)',
    } satisfies CSSProperties,
    signoutDisabled: {
      opacity: 0.7,
      cursor: 'wait',
    } satisfies CSSProperties,
  };
};

export default function AdminSidebar({ sections, signingOut, isDark }: Props) {
  const styles = createStyles(isDark);

  return (
    <aside style={styles.sidebar} aria-label="Admin navigation">
      <div style={styles.sidebarCard}>
        <div style={styles.sidebarTop}>
          <p style={styles.sidebarTitle}>Control Center</p>
        </div>

        <nav style={styles.nav}>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} style={styles.navLink}>
              {section.label}
            </a>
          ))}
        </nav>

        <footer style={styles.footer}>
          <Form method="post" action="/admin/signout">
            <button
              type="submit"
              style={{
                ...styles.signout,
                ...(signingOut ? styles.signoutDisabled : {}),
              }}
              disabled={signingOut}
            >
              {signingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </Form>
        </footer>
      </div>
    </aside>
  );
}
