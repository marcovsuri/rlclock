import React from 'react';
import Widget from './Widget';

interface Props {
  items: string[];
  isDarkMode: boolean;
}

const createStyles = (isDarkMode: boolean) => {
  const item: React.CSSProperties = {
    fontSize: 'clamp(1rem, 4.2cqw, 1.2rem)',
    fontWeight: 500,
    color: isDarkMode ? '#E8EAED' : '#202124',
    padding: '0.35rem 0',
    lineHeight: 1.35,
  };
  return { item };
};

const LunchWidget: React.FC<Props> = ({ items, isDarkMode }) => {
  const styles = createStyles(isDarkMode);
  return (
    <Widget title="Today's Lunch" to="/lunch" isDarkMode={isDarkMode}>
      {items.map((item, i) => (
        <div key={i} style={styles.item}>
          {item}
        </div>
      ))}
    </Widget>
  );
};

export default LunchWidget;
