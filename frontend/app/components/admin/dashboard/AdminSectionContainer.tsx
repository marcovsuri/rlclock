import type { CSSProperties, ReactNode } from 'react';

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  badge?: string;
  headerAction?: ReactNode;
  isDark: boolean;
  children: ReactNode;
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
  const text = isDark ? '#E8EAED' : '#202124';
  const textMuted = isDark ? '#B8BEC5' : '#5F6368';
  const accent = isDark ? '#D85872' : '#B0263E';
  const shadow = isDark
    ? '0 24px 70px rgba(0, 0, 0, 0.35)'
    : '0 20px 60px rgba(32, 33, 36, 0.1)';

  return {
    panel: {
      border,
      background: `linear-gradient(180deg, ${surfaceStrong}, ${surface})`,
      backdropFilter: 'blur(16px)',
      boxShadow: shadow,
      borderRadius: '30px',
      padding: '1.75rem',
    } satisfies CSSProperties,
    panelHeader: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '1rem',
      marginBottom: '0.85rem',
    } satisfies CSSProperties,
    panelTitleGroup: {
      display: 'grid',
      gap: '0.35rem',
    } satisfies CSSProperties,
    eyebrow: {
      margin: 0,
      color: accent,
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    } satisfies CSSProperties,
    panelTitle: {
      margin: 0,
      color: text,
      fontSize: '1.45rem',
      lineHeight: 1.2,
    } satisfies CSSProperties,
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.45rem 0.8rem',
      borderRadius: '999px',
      background: 'rgba(26, 127, 55, 0.14)',
      color: '#1A7F37',
      fontSize: '0.85rem',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    } satisfies CSSProperties,
    panelText: {
      margin: 0,
      color: textMuted,
      lineHeight: 1.6,
    } satisfies CSSProperties,
    panelContent: {
      marginTop: '1.25rem',
      display: 'grid',
      gap: '1rem',
    } satisfies CSSProperties,
  };
};

export default function AdminSectionContainer({
  id,
  eyebrow,
  title,
  description,
  badge,
  headerAction,
  isDark,
  children,
}: Props) {
  const styles = createStyles(isDark);

  return (
    <section id={id} style={styles.panel}>
      {eyebrow || title || headerAction || badge ? (
        <div style={styles.panelHeader}>
          <div style={styles.panelTitleGroup}>
            {eyebrow ? <p style={styles.eyebrow}>{eyebrow}</p> : null}
            {title ? <h2 style={styles.panelTitle}>{title}</h2> : null}
          </div>
          {headerAction ??
            (badge ? <span style={styles.badge}>{badge}</span> : null)}
        </div>
      ) : null}
      {description ? <p style={styles.panelText}>{description}</p> : null}
      <div style={styles.panelContent}>{children}</div>
    </section>
  );
}
