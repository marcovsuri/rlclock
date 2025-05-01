import MenuGrid from './MenuGrid';

const sectionStyle = {
    marginBottom: '40px',
};

const sectionTitleStyle = {
    fontSize: '28px',
    color: '#b30000',
    marginBottom: '20px',
    borderBottom: '2px solid #f5c2c2',
    paddingBottom: '6px',
};

const MenuSection = ({ title, items }: { title: string; items: string[] }) => {
    return (
        <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{title}</h2>
            <MenuGrid items={items} />
        </div>
    );
};

export default MenuSection;
