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
    backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
    padding: isMobile ? '0.75rem' : '1rem 1.25rem',
    borderRadius: '12px',
    boxShadow: isDarkMode
      ? '0 1px 4px rgba(0,0,0,0.4)'
      : '0 1px 4px rgba(0,0,0,0.06)',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? 20 : 24,
    color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
    margin: '0 0 0.5rem',
    fontWeight: 600,
    borderBottom: isDarkMode ? '1px solid rgba(176, 38, 62, 0.15)' : '1px solid rgba(154, 31, 54, 0.12)',
    paddingBottom: '0.4rem',
    textAlign: 'left',
  };
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <MenuGrid items={items} isDarkMode={isDarkMode} />
    </div>
  );
};

export default MenuSection;
