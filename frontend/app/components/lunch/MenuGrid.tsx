import React from 'react';
import MenuItemCard from './MenuItemCard';

interface Props {
  items: string[];
  isDark: boolean;
}

const styles = {
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    width: '100%',
  } as React.CSSProperties,
};

const MenuGrid: React.FC<Props> = ({ items, isDark }) => (
  <div style={styles.grid}>
    {items.map((item, i) => (
      <MenuItemCard key={i} item={item} isDark={isDark} />
    ))}
  </div>
);

export default MenuGrid;
