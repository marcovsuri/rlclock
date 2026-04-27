import type { CSSProperties } from 'react';
import { useState } from 'react';
import AdminSectionContainer from '~/components/admin/dashboard/AdminSectionContainer';
import { useSportsSeasonEditor } from '~/hooks/admin/dashboard/sports/useSportsSeasonEditor';
import { createBrowserSupabaseClient } from '~/lib/supabase';

type Props = {
  isDark: boolean;
};

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
  const accent = isDark ? '#D85872' : '#B0263E';

  return {
    controlRow: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'end',
      gap: '1rem',
    } satisfies CSSProperties,
    fieldGroup: {
      display: 'grid',
      gap: '0.35rem',
      flex: '1 1 260px',
      minWidth: 'min(100%, 260px)',
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
    actionRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      marginLeft: 'auto',
    } satisfies CSSProperties,
  };
};

export default function SportsSeasonEditSection({ isDark }: Props) {
  const accent = isDark ? '#D85872' : '#B0263E';
  const button = makeButton(accent);
  const styles = createStyles(isDark);
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const {
    seasonStartDate,
    updateSeasonStartDate,
    fetchSeasonStartDateFromSupabase,
    sendSeasonStartDate,
  } = useSportsSeasonEditor(supabase);

  return (
    <AdminSectionContainer
      id="sports-season-editor"
      eyebrow="Sports"
      title="Edit Sports Season Start"
      description="Choose the start date for the current sports season. The sports match endpoints will use the latest saved date to decide which results and upcoming games belong to the current season."
      isDark={isDark}
    >
      <div style={styles.controlRow}>
        <label style={styles.fieldGroup}>
          <span style={styles.fieldLabel}>Season Start Date</span>
          <input
            type="date"
            value={seasonStartDate}
            onChange={(event) => updateSeasonStartDate(event.target.value)}
            style={styles.input}
          />
        </label>

        <div style={styles.actionRow}>
          <button
            type="button"
            style={button}
            onClick={fetchSeasonStartDateFromSupabase}
          >
            Load Latest Date
          </button>
          <button type="button" style={button} onClick={sendSeasonStartDate}>
            Send to Database
          </button>
        </div>
      </div>
    </AdminSectionContainer>
  );
}
