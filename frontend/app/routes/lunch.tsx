import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { menuFetcher } from '~/shared/fetchers';
import type { Route } from './+types/lunch';
import type { Menu } from '~/types/lunch';
import useIsMobile from '~/hooks/useIsMobile';
import MenuSection from '~/components/lunch/MenuSection';
import HamburgerButton from '~/components/home/nav/HamburgerButton';
import Nav from '~/components/home/nav/Nav';
import useTheme from '~/hooks/useTheme';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RL Clock | Lunch' },
    { name: 'description', content: 'RL Lunch Menu' },
  ];
}

export async function clientLoader() {
  // Fetch menu
  const menuResult = await menuFetcher.get();
  if (!menuResult.success) console.error(menuResult.errorMessage);

  return { menu: menuResult.success ? menuResult.data : null };
}

const MENU_SECTIONS: { key: keyof Menu; title: string }[] = [
  { key: 'Entrées', title: 'Entrées' },
  { key: 'Sides and Vegetables', title: 'Sides and Vegetables' },
  { key: 'Soups', title: 'Soups' },
];

const createStyles = (isMobile: boolean, isDark: boolean) => {
  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    alignItems: 'center',
  };

  const inner: React.CSSProperties = {
    flexGrow: 1,
    padding: isMobile ? '2rem 1rem' : '2rem 3rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: isDark ? '#E8EAED' : '#202124',
    width: '100%',
  };

  const content: React.CSSProperties = {
    width: isMobile ? '100%' : '60vw',
    maxWidth: '600px',
    margin: '0 auto',
    boxSizing: 'border-box',
  };

  const title: React.CSSProperties = {
    fontSize: isMobile ? 26 : 32,
    color: isDark ? '#B0263E' : 'rgb(154, 31, 54)',
    margin: '0 0 1rem',
    textAlign: 'center',
  };

  const sectionList: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  };

  const empty: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 16,
    color: '#5F6368',
    marginTop: '2vh',
  };

  return { container, inner, content, title, sectionList, empty };
};

export default function Lunch({ loaderData }: Route.ComponentProps) {
  const { menu }: { menu: Menu | null } = loaderData;
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const styles = createStyles(isMobile, isDark);

  const visibleSections = menu
    ? MENU_SECTIONS.filter(({ key }) => menu[key].length > 0)
    : [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.container}
      >
        <HamburgerButton isDark={isDark} onClick={() => setNavOpen(true)} />
        <Nav
          isMobile={isMobile}
          isDark={isDark}
          isOpen={navOpen}
          onClose={() => setNavOpen(false)}
        />
        <main style={styles.inner}>
          <div style={styles.content}>
            <h1 style={styles.title}>RL Lunch Menu</h1>
            <div style={styles.sectionList}>
              {menu && visibleSections.length > 0 ? (
                visibleSections.map(({ key, title }) => (
                  <MenuSection
                    key={key}
                    title={title}
                    items={menu[key].map((item) => item.name)}
                    isMobile={isMobile}
                    isDark={isDark}
                  />
                ))
              ) : (
                <p style={styles.empty}>No lunch served today.</p>
              )}
            </div>
          </div>
        </main>
      </motion.div>
    </>
  );
}
