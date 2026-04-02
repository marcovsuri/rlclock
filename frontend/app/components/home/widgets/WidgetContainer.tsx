import React from 'react';

interface Props {
  children: React.ReactNode;
  isMobile: boolean;
}

const createStyles = (isMobile: boolean) => {
  const container: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: isMobile ? '1rem' : '1vw',
    width: isMobile ? 'min(93vw, 720px)' : '34vw',
    maxWidth: isMobile ? '720px' : '34vw',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
    alignItems: 'stretch',
  };

  return { container };
};

const WidgetContainer: React.FC<Props> = ({ children, isMobile }) => {
  const styles = createStyles(isMobile);
  return <div style={styles.container}>{children}</div>;
};

export default WidgetContainer;
