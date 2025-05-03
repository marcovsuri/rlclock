import MenuGrid from './MenuGrid';

const sectionStyle: React.CSSProperties = {
  marginBottom: '3rem',
  backgroundColor: 'white', // very pale red background
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(154, 31, 54, 0.5)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '2rem',
  color: 'rgb(154, 31, 54)',
  marginBottom: '1.5rem',
  fontWeight: 600,
  borderBottom: '2px solid rgba(154, 31, 54, 0.2)',
  paddingBottom: '0.5rem',
  textAlign: 'center',
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
