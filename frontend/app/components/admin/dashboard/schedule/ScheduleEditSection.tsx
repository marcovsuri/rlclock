import type { CSSProperties } from 'react';
import AdminSectionContainer from '~/components/admin/dashboard/AdminSectionContainer';
import ScheduleBlockRow from '~/components/admin/dashboard/schedule/ScheduleBlockRow';
import { useScheduleEditor } from '~/hooks/admin/dashboard/schedule/useScheduleEditor';

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

export default function ScheduleEditSection({ isDark }: Props) {
  const accent = isDark ? '#D85872' : '#B0263E';
  const button = makeButton(accent);

  const {
    schedule,
    editingIndex,
    updatePeriod,
    movePeriod,
    toggleEdit,
    fetchSchedule,
    addBlock,
    removeBlock,
    sendSchedule,
  } = useScheduleEditor();

  return (
    <AdminSectionContainer
      id="schedule-editor"
      eyebrow="Schedule"
      title="Edit Schedule"
      description="Edit and reorder blocks for the schedule. Fetch the schedule from the RL Clock API. Send the schedule to the supabase server."
      headerAction={
        <button type="button" style={button} onClick={fetchSchedule}>
          Fetch from API
        </button>
      }
      isDark={isDark}
    >
      <div style={{ display: 'grid', gap: '0.9rem' }}>
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
