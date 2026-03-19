import React from 'react';
import Widget from './Widget';

interface Props {
  items: string[];
  isDarkMode: boolean;
}

const createStyles = (isDarkMode: boolean) => {
  const item: React.CSSProperties = {
    fontSize: '3cqw',
    fontWeight: 500,
    color: isDarkMode ? '#E8EAED' : '#202124',
    padding: '0.2rem 0',
  };
  return { item };
};

const LunchWidget: React.FC<Props> = ({ items, isDarkMode }) => {
  const styles = createStyles(isDarkMode);
  return (
    <Widget title="Today's Lunch" isDarkMode={isDarkMode}>
      {items.map((item, i) => (
        <div key={i} style={styles.item}>
          {item}
        </div>
      ))}
    </Widget>
  );
};

export default LunchWidget;
