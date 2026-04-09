import type { CSSProperties } from 'react';
import { useState } from 'react';
import AdminSectionContainer from '~/components/admin/dashboard/AdminSectionContainer';
import ScheduleBlockRow from '~/components/admin/dashboard/schedule/ScheduleBlockRow';
import { useScheduleEditor } from '~/hooks/admin/dashboard/schedule/useScheduleEditor';
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
    headerActionContainer: {
      display: 'flex',
      gap: '1rem',
    } satisfies CSSProperties,
  };
};

export default function ScheduleEditSection({ isDark }: Props) {
  const accent = isDark ? '#D85872' : '#B0263E';
  const button = makeButton(accent);
  const styles = createStyles(isDark);
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const {
    schedule,
    editingIndex,
    updateScheduleName,
    updatePeriod,
    movePeriod,
    toggleEdit,
    fetchScheduleFromAPI,
    fetchScheduleFromSupabase,
    addBlock,
    removeBlock,
    sendSchedule,
  } = useScheduleEditor(supabase);

  return (
    <AdminSectionContainer
      id="schedule-editor"
      eyebrow="Schedule"
      title="Edit Schedule"
      description="Edit and reorder blocks for the schedule. Fetch the schedule from the RL Clock API. Send the schedule to the supabase server."
      headerAction={
        <>
          <div style={styles.headerActionContainer}>
            <button
              type="button"
              style={button}
              onClick={fetchScheduleFromSupabase}
            >
              Fetch from Database
            </button>
            <button type="button" style={button} onClick={fetchScheduleFromAPI}>
              Fetch from API
            </button>
          </div>
        </>
      }
      isDark={isDark}
    >
      <div style={{ display: 'grid', gap: '0.9rem' }}>
        <label style={styles.fieldGroup}>
          <span style={styles.fieldLabel}>Schedule Name</span>
          <input
            type="text"
            value={schedule.name}
            onChange={(event) => updateScheduleName(event.target.value)}
            placeholder="Enter a schedule name"
            style={styles.input}
          />
        </label>

        {schedule.periods.length === 0 ? (
          <p
            style={{
              margin: 0,
              color: isDark ? '#E8EAED' : '#202124',
              fontWeight: 600,
            }}
          >
            No blocks available.
          </p>
        ) : (
          schedule.periods.map((period, index) => (
            <ScheduleBlockRow
              key={`schedule-period-${index}`}
              period={period}
              isDark={isDark}
              canMoveUp={index > 0}
              canMoveDown={index < schedule.periods.length - 1}
              isEditing={editingIndex === index}
              onMoveUp={() => movePeriod(index, index - 1)}
              onMoveDown={() => movePeriod(index, index + 1)}
              onToggleEdit={() => toggleEdit(index)}
              onRemove={() => removeBlock(index)}
              onNameChange={(name) =>
                updatePeriod(index, (p) => ({ ...p, name }))
              }
              onStartChange={(start) =>
                updatePeriod(index, (p) => ({ ...p, start }))
              }
              onEndChange={(end) => updatePeriod(index, (p) => ({ ...p, end }))}
            />
          ))
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '0.25rem',
          }}
        >
          <button type="button" style={button} onClick={addBlock}>
            Add Block
          </button>
          <button type="button" style={button} onClick={sendSchedule}>
            Send to Database
          </button>
        </div>
      </div>
    </AdminSectionContainer>
  );
}
