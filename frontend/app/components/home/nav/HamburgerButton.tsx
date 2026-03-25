interface Props {
  onClick: () => void;
}

const createStyles = () => {
  const button: React.CSSProperties = {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    zIndex: 50,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    backdropFilter: 'blur(8px)',
  };

  const bar: React.CSSProperties = {
    display: 'block',
    width: '20px',
    height: '2px',
    background: 'currentColor',
    borderRadius: '2px',
  };

  return { button, bar };
};

const HamburgerButton = ({ onClick }: Props) => {
  const styles = createStyles();

  return (
    <button
      onClick={onClick}
      aria-label="Open navigation"
      style={styles.button}
    >
      <span style={styles.bar} />
      <span style={styles.bar} />
      <span style={styles.bar} />
    </button>
  );
};

export default HamburgerButton;
