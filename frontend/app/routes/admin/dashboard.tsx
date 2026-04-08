import {
  Form,
  Link,
  redirect,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type { Route } from './+types/dashboard';
import type { AdminUser } from './layout';

type AdminOutletContext = { user: AdminUser };

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RL Clock | Admin Dashboard' },
    { name: 'description', content: 'Protected RL Clock admin dashboard' },
  ];
}

const createStyles = () => {
  const page: React.CSSProperties = {
    minHeight: '100vh',
    padding: '2rem',
    background:
      'linear-gradient(180deg, rgba(176,38,62,0.08), rgba(255,255,255,1))',
    fontFamily: 'Roboto, sans-serif',
  };

  const shell: React.CSSProperties = {
    width: 'min(100%, 900px)',
    margin: '0 auto',
    display: 'grid',
    gap: '1.5rem',
  };

  const card: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '22px',
    padding: '1.75rem',
    border: '1px solid rgba(176, 38, 62, 0.12)',
    boxShadow: '0 20px 60px rgba(32, 33, 36, 0.08)',
  };

  const badge: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.4rem 0.75rem',
    borderRadius: '999px',
    backgroundColor: 'rgba(26, 127, 55, 0.12)',
    color: '#1A7F37',
    fontWeight: 700,
    fontSize: '0.9rem',
  };

  const title: React.CSSProperties = {
    margin: '1rem 0 0.4rem',
    fontSize: '2.1rem',
    color: '#202124',
  };

  const text: React.CSSProperties = {
    margin: 0,
    color: '#5F6368',
    lineHeight: 1.6,
  };

  const infoGrid: React.CSSProperties = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  };

  const infoCard: React.CSSProperties = {
    backgroundColor: '#F8F9FA',
    borderRadius: '16px',
    padding: '1rem',
  };

  const label: React.CSSProperties = {
    margin: 0,
    color: '#5F6368',
    fontSize: '0.9rem',
  };

  const value: React.CSSProperties = {
    margin: '0.4rem 0 0',
    color: '#202124',
    fontWeight: 700,
  };

  const actions: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  };

  const primaryButton: React.CSSProperties = {
    border: 0,
    borderRadius: '12px',
    padding: '0.9rem 1.1rem',
    fontWeight: 700,
    backgroundColor: '#B0263E',
    color: '#FFFFFF',
    cursor: 'pointer',
  };

  const secondaryButton: React.CSSProperties = {
    border: '1px solid #DADCE0',
    borderRadius: '12px',
    padding: '0.9rem 1.1rem',
    fontWeight: 700,
    backgroundColor: '#FFFFFF',
    color: '#202124',
    cursor: 'pointer',
  };

  return {
    page,
    shell,
    card,
    badge,
    title,
    text,
    infoGrid,
    infoCard,
    label,
    value,
    actions,
    primaryButton,
    secondaryButton,
  };
};

export default function AdminDashboard() {
  const { user } = useOutletContext<AdminOutletContext>();
  const navigation = useNavigation();
  const signingOut = navigation.state === 'submitting';

  const styles = createStyles();

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.card}>
          <div style={styles.badge}>Protected Route</div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.text}>
            This area is gated by Supabase auth. Anyone who is not signed in is
            redirected to the admin sign-in screen before this page renders.
          </p>
        </section>

        <section style={styles.card}>
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <p style={styles.label}>Signed in as</p>
              <p style={styles.value}>{user.email ?? 'No email provided'}</p>
            </div>
            <div style={styles.infoCard}>
              <p style={styles.label}>User ID</p>
              <p style={styles.value}>{user.id}</p>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.actions}>
            <Link to="/" style={styles.primaryButton}>
              Back to Site
            </Link>
            <Form method="post" action="/admin/signout">
              <button
                type="submit"
                style={styles.secondaryButton}
                disabled={signingOut}
              >
                {signingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </Form>
          </div>
        </section>
      </div>
    </main>
  );
}
