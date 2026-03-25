import React from 'react';

interface Props {
  children: React.ReactNode;
  isMobile: boolean;
}

const createStyles = (childCount: number, isMobile: boolean) => {
  const container: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile
      ? 'minmax(0, 1fr)'
      : `repeat(${childCount}, minmax(0, 1fr))`,
    gap: isMobile ? '1rem' : '1.5vw',
    width: '100%',
    maxWidth: '1200px',
    padding: isMobile ? '0 1rem' : '0 2vw 2vh',
    margin: '0 auto',
    boxSizing: 'border-box',
    alignItems: 'stretch',
    height: '100%',
  };
  return { container };
};

const WidgetContainer: React.FC<Props> = ({ children, isMobile }) => {
  const childCount = React.Children.count(children);
  const styles = createStyles(childCount, isMobile);
  return <div style={styles.container}>{children}</div>;
};

export default WidgetContainer;
