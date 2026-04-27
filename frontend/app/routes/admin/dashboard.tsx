import type { CSSProperties } from 'react';
import { useNavigation, useOutletContext } from 'react-router';
import AdminDashboardHeader from '~/components/admin/dashboard/AdminDashboardHeader';
import AdminSidebar from '~/components/admin/dashboard/AdminSidebar';
import MenuEditSection from '~/components/admin/dashboard/menu/MenuEditSection';
import ScheduleEditSection from '~/components/admin/dashboard/schedule/ScheduleEditSection';
import useTheme from '~/hooks/useTheme';
import type { Route } from './+types/dashboard';
import type { AdminUser } from './layout';

type AdminOutletContext = { user: AdminUser };

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RL Clock | Admin Dashboard' },
    { name: 'description', content: 'Protected RL Clock admin dashboard' },
  ];
}

const dashboardSections: {
  id: string;
  label: string;
  title: string;
  description: string;
}[] = [
  {
    id: 'schedule-editor',
    label: 'Schedule',
    title: 'Edit Schedule',
    description: 'Manage the schedule blocks that appear in RL Clock.',
  },
  {
    id: 'menu-editor',
    label: 'Menu',
    title: 'Edit Menu',
    description: 'Manage the menu sections and items that appear in RL Clock.',
  },
];

const createStyles = () => {
  return {
    page: {
      minHeight: '100vh',
      padding: '1.5rem',
    } satisfies CSSProperties,
    layout: {
      width: 'min(100%, 1320px)',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      alignItems: 'stretch',
    } satisfies CSSProperties,
    content: {
      flex: '1 1 720px',
      minWidth: 0,
      display: 'grid',
      gap: '1.5rem',
    } satisfies CSSProperties,
    main: {
      display: 'grid',
      gap: '1.5rem',
    } satisfies CSSProperties,
    cardGrid: {
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    } satisfies CSSProperties,
    notesList: {
      margin: 0,
      paddingLeft: '1.25rem',
      display: 'grid',
      gap: '0.75rem',
    } satisfies CSSProperties,
  };
};

export default function AdminDashboard() {
  const { user } = useOutletContext<AdminOutletContext>();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const signingOut = navigation.state === 'submitting';
  const styles = createStyles();

  return (
    <main style={styles.page}>
      <div style={styles.layout}>
        <AdminSidebar
          sections={dashboardSections}
          signingOut={signingOut}
          isDark={isDark}
        />

        <div style={styles.content}>
          <AdminDashboardHeader
            email={user.email}
            userId={user.id}
            isDark={isDark}
          />

          <div style={styles.main}>
            <ScheduleEditSection isDark={isDark} />
            <MenuEditSection isDark={isDark} />
          </div>
        </div>
      </div>
    </main>
  );
}
