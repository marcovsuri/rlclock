import { useState } from 'react';

interface MenuItemCardProps {
  item: string;
  isDarkMode: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseCardStyle = {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    textAlign: 'left' as const,
    fontWeight: 450,
    fontSize: 16,
    color: isDarkMode ? '#E8EAED' : '#202124',
    margin: '0',
    width: '100%',
    boxSizing: 'border-box' as const,
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease, color 3s ease',
    cursor: 'default',
  };

  const hoverCardStyle = {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  };
  return (
    <div
      style={{
        ...baseCardStyle,
        ...(isHovered ? hoverCardStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item}
    </div>
  );
};

export default MenuItemCard;
