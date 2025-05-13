import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear();
  
  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1vh 0',
    marginTop: '3vh',
    marginBottom: '2vh',
    color: isDarkMode ? '#f8f9fa' : '#6c757d', // Adjusted for dark mode text color
    fontSize: '0.9rem',
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const footerSubtextStyle: React.CSSProperties = {
    fontSize: '0.8rem',
  };

  //current year now instead of having to be hardcoded

  return (
    <footer style={footerStyle}>
      <div style={{ marginBottom: '0.5vh' }}>
        <span className="text-muted">
          A friendly 🦊&nbsp; re/creation. ©&nbsp;{currentYear}
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