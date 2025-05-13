import MenuItemCard from './MenuItemCard';
interface MenuGridProps {
  items: string[];
  isDarkMode: boolean;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, isDarkMode }) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
