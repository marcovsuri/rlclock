import React from 'react';
import Widget from './Widget';

interface Props {
  items: string[];
  isDark: boolean;
}

const createStyles = (isDark: boolean) => {
  const item: React.CSSProperties = {
    fontSize: 'clamp(1rem, 4.2cqw, 1.2rem)',
    fontWeight: 500,
    color: isDark ? '#E8EAED' : '#202124',
    padding: '0.35rem 0',
    lineHeight: 1.35,
  };
  return { item };
};

const LunchWidget: React.FC<Props> = ({ items, isDark }) => {
  const styles = createStyles(isDark);
  return (
    <Widget title="Today's Lunch" to="/lunch" isDark={isDark}>
      {items.map((item, i) => (
        <div key={i} style={styles.item}>
          {item}
        </div>
      ))}
    </Widget>
  );
};

export default LunchWidget;
