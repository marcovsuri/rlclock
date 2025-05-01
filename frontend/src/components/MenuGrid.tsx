import MenuItemCard from './MenuItemCard';

const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
};

const MenuGrid = ({ items }: { items: string[] }) => {
    return (
        <div style={cardGridStyle}>
            {items.map((item, index) => (
                <MenuItemCard key={index} item={item} />
            ))}
        </div>
    );
};

export default MenuGrid;
