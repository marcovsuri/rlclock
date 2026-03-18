import React from 'react';
import MenuGrid from './MenuGrid';

interface Props {
  title: string;
  items: string[];
  isMobile: boolean;
  isDarkMode: boolean;
}

const createStyles = (isMobile: boolean, isDarkMode: boolean) => {
  const section: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
    padding: isMobile ? '0.75rem' : '1rem 1.25rem',
    borderRadius: '12px',
    boxShadow: isDarkMode
      ? '0 1px 4px rgba(0,0,0,0.4)'
      : '0 1px 4px rgba(0,0,0,0.06)',
  };
  const sectionTitle: React.CSSProperties = {
    fontSize: isMobile ? 20 : 24,
    color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
    margin: '0 0 0.5rem',
    fontWeight: 600,
    borderBottom: isDarkMode
      ? '1px solid rgba(176, 38, 62, 0.15)'
      : '1px solid rgba(154, 31, 54, 0.12)',
    paddingBottom: '0.4rem',
    textAlign: 'left',
  };
  return { section, sectionTitle };
};

const MenuSection: React.FC<Props> = ({
  title,
  items,
  isMobile,
  isDarkMode,
}) => {
  const styles = createStyles(isMobile, isDarkMode);
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <MenuGrid items={items} isDarkMode={isDarkMode} />
    </div>
  );
};

export default MenuSection;
