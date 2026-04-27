import type { CSSProperties } from 'react';
import MenuItemRow from '~/components/admin/dashboard/menu/MenuItemRow';
import type { MenuItem, MenuSectionKey } from '~/types/lunch';

type Props = {
  title: string;
  sectionKey: MenuSectionKey;
  items: MenuItem[];
  isDark: boolean;
  editingIndex: number | null;
  onToggleEdit: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
  onNameChange: (index: number, name: string) => void;
  onDescriptionChange: (index: number, description: string) => void;
  onAddItem: () => void;
};

const createStyles = (isDark: boolean) => {
  const border = isDark
    ? '1px solid rgba(240, 169, 181, 0.18)'
    : '1px solid rgba(154, 31, 54, 0.16)';
  const surface = isDark
    ? 'rgba(31, 33, 36, 0.78)'
    : 'rgba(255, 255, 255, 0.66)';
  const text = isDark ? '#E8EAED' : '#202124';
  const textMuted = isDark ? '#B8BEC5' : '#5F6368';
  const accent = isDark ? '#D85872' : '#B0263E';

  return {
    section: {
      display: 'grid',
      gap: '0.9rem',
      padding: '1.1rem',
      border,
      borderRadius: '24px',
      background: surface,
    } satisfies CSSProperties,
    header: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '0.75rem',
    } satisfies CSSProperties,
    titleGroup: {
      display: 'grid',
      gap: '0.2rem',
    } satisfies CSSProperties,
    title: {
      margin: 0,
      color: text,
      fontSize: '1.05rem',
      fontWeight: 700,
    } satisfies CSSProperties,
    subtitle: {
      margin: 0,
      color: textMuted,
      lineHeight: 1.5,
    } satisfies CSSProperties,
    countBadge: {
      margin: 0,
      padding: '0.45rem 0.8rem',
      borderRadius: '999px',
      border,
      color: accent,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    } satisfies CSSProperties,
    itemList: {
      display: 'grid',
      gap: '0.75rem',
    } satisfies CSSProperties,
    emptyState: {
      margin: 0,
      color: textMuted,
      lineHeight: 1.5,
    } satisfies CSSProperties,
    addButton: {
      minHeight: '2.75rem',
      padding: '0.75rem 1.1rem',
      borderRadius: '16px',
      border: 0,
      backgroundColor: accent,
      color: '#FFFFFF',
      font: 'inherit',
      fontWeight: 700,
      cursor: 'pointer',
      justifySelf: 'start',
    } satisfies CSSProperties,
  };
};

export default function MenuSectionEditor({
  title,
  sectionKey,
  items,
  isDark,
  editingIndex,
  onToggleEdit,
  onMoveUp,
  onMoveDown,
  onRemove,
  onNameChange,
  onDescriptionChange,
  onAddItem,
}: Props) {
  const styles = createStyles(isDark);
  const sectionId = `menu-section-${sectionKey
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;

  return (
    <section style={styles.section} aria-labelledby={sectionId}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h3 id={sectionId} style={styles.title}>
            {title}
          </h3>
          <p style={styles.subtitle}>
            Manage the items that appear in this menu section.
          </p>
        </div>
        <p style={styles.countBadge}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div style={styles.itemList}>
        {items.length === 0 ? (
          <p style={styles.emptyState}>No items in this section yet.</p>
        ) : (
          items.map((item, index) => (
            <MenuItemRow
              key={item.id || `${sectionKey}-${index}`}
              item={item}
              isDark={isDark}
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              isEditing={editingIndex === index}
              onMoveUp={() => onMoveUp(index)}
              onMoveDown={() => onMoveDown(index)}
              onToggleEdit={() => onToggleEdit(index)}
              onRemove={() => onRemove(index)}
              onNameChange={(name) => onNameChange(index, name)}
              onDescriptionChange={(description) =>
                onDescriptionChange(index, description)
              }
            />
          ))
        )}
      </div>

      <button type="button" style={styles.addButton} onClick={onAddItem}>
        Add Item
      </button>
    </section>
  );
}
