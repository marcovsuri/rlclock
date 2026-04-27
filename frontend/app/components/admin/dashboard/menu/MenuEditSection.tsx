import type { CSSProperties } from 'react';
import { useState } from 'react';
import AdminSectionContainer from '~/components/admin/dashboard/AdminSectionContainer';
import MenuSectionEditor from '~/components/admin/dashboard/menu/MenuSectionEditor';
import { useMenuEditor } from '~/hooks/admin/dashboard/menu/useMenuEditor';
import { createBrowserSupabaseClient } from '~/lib/supabase';
import { MENU_SECTION_CONFIG } from '~/types/lunch';

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
  const textMuted = isDark ? '#B8BEC5' : '#5F6368';
  const accent = isDark ? '#D85872' : '#B0263E';

  return {
    sectionList: {
      display: 'grid',
      gap: '1rem',
    } satisfies CSSProperties,
    controlGroup: {
      display: 'grid',
      gap: '1rem',
    } satisfies CSSProperties,
    menuIdRow: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'end',
      gap: '1rem',
    } satisfies CSSProperties,
    menuIdControls: {
      display: 'grid',
      gap: '0.35rem',
      flex: '1 1 260px',
      minWidth: 'min(100%, 260px)',
    } satisfies CSSProperties,
    menuIdLabel: {
      margin: 0,
      color: accent,
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    } satisfies CSSProperties,
    menuIdInput: {
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
    idButtonRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      marginLeft: 'auto',
    } satisfies CSSProperties,
    fetchButtonRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
    } satisfies CSSProperties,
    helperText: {
      margin: 0,
      color: textMuted,
      lineHeight: 1.6,
    } satisfies CSSProperties,
    footerAction: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: '0.25rem',
    } satisfies CSSProperties,
  };
};

export default function MenuEditSection({ isDark }: Props) {
  const accent = isDark ? '#D85872' : '#B0263E';
  const button = makeButton(accent);
  const styles = createStyles(isDark);
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const {
    menu,
    menuId,
    editingTarget,
    updateMenuId,
    updateItem,
    moveItem,
    toggleEdit,
    fetchMenuIdFromSupabase,
    fetchMenuFromAPI,
    fetchMenuFromSupabase,
    sendMenuId,
    addItem,
    removeItem,
    sendMenu,
  } = useMenuEditor(supabase);

  return (
    <AdminSectionContainer
      id="menu-editor"
      eyebrow="Menu"
      title="Edit Menu"
      description="Edit and reorder the items in each menu section. You can pull the latest menu data, adjust section contents, and save the result to Supabase."
      isDark={isDark}
      headerAction={
        <div style={styles.fetchButtonRow}>
          <button type="button" style={button} onClick={fetchMenuFromSupabase}>
            Fetch from Database
          </button>
          <button type="button" style={button} onClick={fetchMenuFromAPI}>
            Fetch from API
          </button>
        </div>
      }
    >
      <div style={styles.controlGroup}>
        <div style={styles.menuIdRow}>
          <label style={styles.menuIdControls}>
            <span style={styles.menuIdLabel}>Menu ID</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={menuId}
              onChange={(event) => updateMenuId(event.target.value)}
              placeholder="Enter Sage menu ID"
              style={styles.menuIdInput}
            />
          </label>

          <div style={styles.idButtonRow}>
            <button
              type="button"
              style={button}
              onClick={fetchMenuIdFromSupabase}
            >
              Load Latest ID
            </button>
            <button type="button" style={button} onClick={sendMenuId}>
              Send ID to Database
            </button>
          </div>
        </div>
      </div>

      <div style={styles.sectionList}>
        {MENU_SECTION_CONFIG.map(({ key, title }) => (
          <MenuSectionEditor
            key={key}
            title={title}
            sectionKey={key}
            items={menu[key]}
            isDark={isDark}
            editingIndex={
              editingTarget?.sectionKey === key ? editingTarget.index : null
            }
            onToggleEdit={(index) => toggleEdit(key, index)}
            onMoveUp={(index) => moveItem(key, index, index - 1)}
            onMoveDown={(index) => moveItem(key, index, index + 1)}
            onRemove={(index) => removeItem(key, index)}
            onNameChange={(index, name) =>
              updateItem(key, index, (item) => ({ ...item, name }))
            }
            onDescriptionChange={(index, desc) =>
              updateItem(key, index, (item) => ({ ...item, desc }))
            }
            onAddItem={() => addItem(key)}
          />
        ))}
      </div>

      <div style={styles.footerAction}>
        <button type="button" style={button} onClick={sendMenu}>
          Send to Database
        </button>
      </div>
    </AdminSectionContainer>
  );
}
