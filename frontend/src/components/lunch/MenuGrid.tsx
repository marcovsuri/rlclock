import MenuItemCard from './MenuItemCard';
interface MenuGridProps {
  items: string[];
  isDarkMode: boolean;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, isDarkMode }) => {
  const gridStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    width: '100%',
  };
  return (
    <div style={gridStyle}>
      {items.map((item, index) => (
        <MenuItemCard key={index} item={item} isDarkMode={isDarkMode} />
      ))}
    </div>
  );
};

export default MenuGrid;
