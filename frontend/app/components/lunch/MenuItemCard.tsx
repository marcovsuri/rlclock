import React, { useState } from 'react';

interface Props {
  item: string;
  isDark: boolean;
}

const createStyles = (isDark: boolean, hovered: boolean) => {
  const card: React.CSSProperties = {
    backgroundColor: hovered
      ? isDark
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(0,0,0,0.06)'
      : isDark
        ? 'rgba(255,255,255,0.04)'
        : 'rgba(0,0,0,0.03)',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    textAlign: 'left',
    fontWeight: 450,
    fontSize: 16,
    color: isDark ? '#E8EAED' : '#202124',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    cursor: 'default',
  };
  return { card };
};

const MenuItemCard: React.FC<Props> = ({ item, isDark }) => {
  const [hovered, setHovered] = useState(false);
  const styles = createStyles(isDark, hovered);
  return (
    <div
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item}
    </div>
  );
};

export default MenuItemCard;
