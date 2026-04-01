import React from 'react';
import Widget from './Widget';

interface Props {
  items: string[] | null;
  isDark: boolean;
  isMobile: boolean;
}

const createStyles = (isDark: boolean) => {
  const list: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15em',
  };

  const item: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 400,
    color: isDark ? '#E8EAED' : '#202124',
    lineHeight: 1.35,
  };

  return { list, item };
};

const LunchWidget: React.FC<Props> = ({ items, isDark, isMobile }) => {
  const styles = createStyles(isDark);
  return (
    <Widget
      title="Today's Lunch"
      to="/lunch"
      isDark={isDark}
      isMobile={isMobile}
    >
      {items && items.length > 0 ? (
        <span style={styles.list}>
          {items.map((item, i) => (
            <span key={i} style={styles.item}>
              {item}
            </span>
          ))}
        </span>
      ) : (
        <div style={styles.item}>No lunch today</div>
      )}
    </Widget>
  );
};

export default LunchWidget;
