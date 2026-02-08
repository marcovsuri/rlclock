import MenuGrid from './MenuGrid';
import useIsMobile from '../../hooks/useIsMobile';

const MenuSection = ({
  title,
  items,
  isDarkMode,
}: {
  title: string;
  items: string[];
  isDarkMode: boolean;
}) => {
  const isMobile = useIsMobile();

  const sectionStyle: React.CSSProperties = {
    marginBottom: '3rem',
    backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: isDarkMode
      ? '0 2px 12px rgba(0,0,0,0.5)'
      : '0 2px 12px rgba(0,0,0,0.1)',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? 26 : 32,
    color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
    marginBottom: '1.5rem',
    fontWeight: 600,
    borderBottom: isDarkMode ? '1px solid rgba(176, 38, 62, 0.4)' : '1px solid rgba(154, 31, 54, 0.4)',
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
