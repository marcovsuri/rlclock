import React from 'react';

interface Props {
  children: React.ReactNode;
}

const createStyles = (childCount: number) => {
  const container: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${childCount}, 1fr)`,
    gap: '1.5vw',
    width: '100%',
    padding: '0 2vw 2vh',
    boxSizing: 'border-box',
    alignItems: 'stretch',
    height: '100%',
  };
  return { container };
};

const WidgetContainer: React.FC<Props> = ({ children }) => {
  const childCount = React.Children.count(children);
  const styles = createStyles(childCount);
  return <div style={styles.container}>{children}</div>;
};

export default WidgetContainer;
