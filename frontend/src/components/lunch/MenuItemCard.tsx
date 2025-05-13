import { useState } from 'react';

interface MenuItemCardProps {
  item: string;
  isDarkMode: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseCardStyle = {
    backgroundColor: 'rgba(154, 31, 54, 0.1)', // very pale red
    border: '1px solid rgba(154, 31, 54, 0.5)',
    borderRadius: '12px',
    padding: '0.1rem',
    textAlign: 'center' as const,
    fontWeight: 500,
    fontSize: '1rem',
    color: isDarkMode ? 'white' : 'black',
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
    boxShadow: '0 8px 16px rgba(154, 31, 54, 0.2)',
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
