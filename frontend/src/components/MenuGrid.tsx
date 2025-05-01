import MenuItemCard from "./MenuItemCard";

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  width: "100%",
};

const MenuGrid = ({ items }: { items: string[] }) => {
  return (
    <div style={gridStyle}>
      {items.map((item, index) => (
        <MenuItemCard key={index} item={item} />
      ))}
    </div>
  );
};

export default MenuGrid;
