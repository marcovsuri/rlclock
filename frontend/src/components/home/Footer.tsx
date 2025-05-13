import React from 'react';

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '1vh 0',
  marginTop: '3vh',
  marginBottom: '2vh',
  color: '#6c757d', // muted gray
  fontSize: '0.9rem',
};

const footerSubtextStyle: React.CSSProperties = {
  fontSize: '0.8rem',
};

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={{ marginBottom: '0.5vh' }}>
        <span className="text-muted">
          A friendly 🦊&nbsp; re/creation. ©&nbsp;2025
        </span>
      </div>
      <div>
        <span className="text-muted" style={footerSubtextStyle}>
          Full credit to the creators of the original RL Clock. ✌️
        </span>
      </div>
    </footer>
  );
};

export default Footer;
