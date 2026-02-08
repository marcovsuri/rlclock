import { useState } from 'react';

interface MenuItemCardProps {
  item: string;
  isDarkMode: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseCardStyle = {
    backgroundColor: isDarkMode ? '#2D2E30' : '#F2F2F2',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
    borderRadius: '12px',
    padding: '0.1rem',
    textAlign: 'center' as const,
    fontWeight: 500,
    fontSize: '1rem',
    color: isDarkMode ? '#E8EAED' : '#202124',
    margin: '0.25rem auto',
    width: '100%',
    minHeight: '80px', // uniform height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease, background-color 3s ease, color 3s ease',
  };

  const hoverCardStyle = {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
