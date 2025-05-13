import MenuGrid from './MenuGrid';

const MenuSection = ({
  title,
  items,
  isDarkMode,
}: {
  title: string;
  items: string[];
  isDarkMode: boolean;
}) => {
  const sectionStyle: React.CSSProperties = {
    marginBottom: '3rem',
    backgroundColor: isDarkMode ? 'black' : 'white',
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
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <MenuGrid items={items} isDarkMode={isDarkMode} />
    </div>
  );
};

export default MenuSection;
