import type { CSSProperties } from 'react';
import type { MenuItem } from '~/types/lunch';

type Props = {
  item: MenuItem;
  isDark: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isEditing: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleEdit: () => void;
  onRemove: () => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
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
    itemTitleGroup: {
      display: 'grid',
      gap: '0.2rem',
      minWidth: 0,
    } satisfies CSSProperties,
    itemName: {
      margin: 0,
      color: text,
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.3,
    } satisfies CSSProperties,
    itemDescription: {
      margin: 0,
      color: textMuted,
      fontWeight: 600,
      lineHeight: 1.4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    } satisfies CSSProperties,
    metaBadge: {
      margin: 0,
      padding: '0.45rem 0.7rem',
      borderRadius: '999px',
      border,
      color: accent,
      background: 'transparent',
      fontWeight: 700,
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
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
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
      boxSizing: 'border-box',
    } satisfies CSSProperties,
    textarea: {
      width: '100%',
      minHeight: '6.5rem',
      padding: '0.7rem 0.85rem',
      borderRadius: '14px',
      border,
      backgroundColor: isDark ? 'rgba(31, 33, 36, 0.92)' : '#FFFFFF',
      color: text,
      font: 'inherit',
      boxSizing: 'border-box',
      resize: 'vertical',
    } satisfies CSSProperties,
  };
};

export default function MenuItemRow({
  item,
  isDark,
  canMoveUp,
  canMoveDown,
  isEditing,
  onMoveUp,
  onMoveDown,
  onToggleEdit,
  onRemove,
  onNameChange,
  onDescriptionChange,
}: Props) {
  const styles = createStyles(isDark);
  const itemName = item.name.trim() || 'Untitled Item';
  const description = item.desc.trim() || 'No description';

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
            aria-label={`Move ${itemName} up`}
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
            aria-label={`Move ${itemName} down`}
          >
            &#8595;
          </button>
        </div>

        <div style={styles.itemTitleGroup}>
          <p style={styles.itemName}>{itemName}</p>
          <p style={styles.itemDescription}>{description}</p>
        </div>

        <button
          type="button"
          style={styles.editButton}
          onClick={onToggleEdit}
          aria-label={`Edit ${itemName}`}
        >
          &#9998;
        </button>
        <button
          type="button"
          style={styles.removeButton}
          onClick={onRemove}
          aria-label={`Remove ${itemName}`}
        >
          &#xD7;
        </button>
      </div>

      {isEditing ? (
        <div style={styles.editFields}>
          <label style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Item Name</span>
            <input
              type="text"
              value={item.name}
              onChange={(event) => onNameChange(event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Description</span>
            <textarea
              value={item.desc}
              onChange={(event) => onDescriptionChange(event.target.value)}
              style={styles.textarea}
            />
          </label>
        </div>
      ) : null}
    </article>
  );
}
