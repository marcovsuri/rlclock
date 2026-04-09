import type { CSSProperties } from 'react';
import type { Period } from '~/types/clock';
import { ETTimeToDate } from '~/utils/global/time';

type Props = {
  period: Period;
  isDark: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isEditing: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleEdit: () => void;
  onRemove: () => void;
  onNameChange: (name: string) => void;
  onStartChange: (nextStart: Date) => void;
  onEndChange: (nextEnd: Date) => void;
};

const formatDisplayTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const twelveHour = hours % 12 || 12;
  return `${twelveHour}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};

const toTimeInputValue = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

const timeInputToDate = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return ETTimeToDate(hours, minutes);
};

const createStyles = (isDark: boolean) => {
  const border = isDark
    ? '1px solid rgba(240, 169, 181, 0.18)'
    : '1px solid rgba(154, 31, 54, 0.16)';
  const surface = isDark
    ? 'rgba(48, 52, 57, 0.9)'
    : 'rgba(248, 249, 250, 0.86)';
  const text = isDark ? '#E8EAED' : '#202124';
  const textMuted = isDark ? '#B8BEC5' : '#5F6368';
  const accent = isDark ? '#D85872' : '#B0263E';

  return {
    row: {
      border,
      background: surface,
      borderRadius: '22px',
      padding: '1rem 1.1rem',
      display: 'grid',
      gap: '0.85rem',
    } satisfies CSSProperties,
    rowTop: {
      display: 'grid',
      gridTemplateColumns: 'auto minmax(0, 1fr) auto auto auto',
      gap: '0.9rem',
      alignItems: 'center',
    } satisfies CSSProperties,
    moveControls: {
      display: 'grid',
      gap: '0.4rem',
    } satisfies CSSProperties,
    arrowButton: {
      width: '2rem',
      height: '2rem',
      borderRadius: '999px',
      border,
      background: 'transparent',
      color: text,
      font: 'inherit',
      fontWeight: 700,
      cursor: 'pointer',
    } satisfies CSSProperties,
    disabledArrow: {
      opacity: 0.45,
      cursor: 'not-allowed',
    } satisfies CSSProperties,
    blockName: {
      margin: 0,
      color: text,
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.3,
    } satisfies CSSProperties,
    blockTime: {
      margin: 0,
      color: textMuted,
      fontWeight: 600,
      whiteSpace: 'nowrap',
    } satisfies CSSProperties,
    editButton: {
      minWidth: '2.5rem',
      height: '2.5rem',
      borderRadius: '999px',
      border,
      background: 'transparent',
      color: accent,
      font: 'inherit',
      fontWeight: 700,
      cursor: 'pointer',
    } satisfies CSSProperties,
    removeButton: {
      minWidth: '2.5rem',
      height: '2.5rem',
      borderRadius: '999px',
      border,
      background: 'transparent',
      color: textMuted,
      font: 'inherit',
      fontWeight: 700,
      cursor: 'pointer',
    } satisfies CSSProperties,
    editFields: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.1fr) repeat(2, minmax(120px, 0.8fr))',
      gap: '0.75rem',
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
      minHeight: '2.6rem',
      padding: '0.7rem 0.85rem',
      borderRadius: '14px',
      border,
      backgroundColor: isDark ? 'rgba(31, 33, 36, 0.92)' : '#FFFFFF',
      color: text,
      font: 'inherit',
    } satisfies CSSProperties,
    timeInput: {
      width: '100%',
      minHeight: '2.6rem',
      padding: '0.7rem 0.85rem',
      borderRadius: '14px',
      border,
      backgroundColor: isDark ? 'rgba(31, 33, 36, 0.92)' : '#FFFFFF',
      color: text,
      font: 'inherit',
      colorScheme: isDark ? 'dark' : 'light',
      caretColor: accent,
    } satisfies CSSProperties,
  };
};

export default function ScheduleBlockRow({
  period,
  isDark,
  canMoveUp,
  canMoveDown,
  isEditing,
  onMoveUp,
  onMoveDown,
  onToggleEdit,
  onRemove,
  onNameChange,
  onStartChange,
  onEndChange,
}: Props) {
  const styles = createStyles(isDark);

  return (
    <article style={styles.row}>
      <div style={styles.rowTop}>
        <div style={styles.moveControls}>
          <button
            type="button"
            style={{
              ...styles.arrowButton,
              ...(canMoveUp ? {} : styles.disabledArrow),
            }}
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label={`Move ${period.name} up`}
          >
            &#8593;
          </button>
          <button
            type="button"
            style={{
              ...styles.arrowButton,
              ...(canMoveDown ? {} : styles.disabledArrow),
            }}
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label={`Move ${period.name} down`}
          >
            &#8595;
          </button>
        </div>

        <p style={styles.blockName}>{period.name}</p>
        <p style={styles.blockTime}>
          {formatDisplayTime(period.start)} - {formatDisplayTime(period.end)}
        </p>
        <button
          type="button"
          style={styles.editButton}
          onClick={onToggleEdit}
          aria-label={`Edit ${period.name}`}
        >
          &#9998;
        </button>
        <button
          type="button"
          style={styles.removeButton}
          onClick={onRemove}
          aria-label={`Remove ${period.name}`}
        >
          &#xD7;
        </button>
      </div>

      {isEditing ? (
        <div style={styles.editFields}>
          <label style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Block</span>
            <input
              type="text"
              value={period.name}
              onChange={(event) => onNameChange(event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Start</span>
            <input
              type="time"
              value={toTimeInputValue(period.start)}
              onChange={(event) =>
                onStartChange(timeInputToDate(event.target.value))
              }
              style={styles.timeInput}
            />
          </label>

          <label style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>End</span>
            <input
              type="time"
              value={toTimeInputValue(period.end)}
              onChange={(event) =>
                onEndChange(timeInputToDate(event.target.value))
              }
              style={styles.timeInput}
            />
          </label>
        </div>
      ) : null}
    </article>
  );
}
