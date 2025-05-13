import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ alignSelf: 'flex-start', marginBottom: '2vh' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '0.8vh 1.5vw',
          borderRadius: '12px',
          border: '1px solid rgba(154, 31, 54, 0.2)',
          backgroundColor: 'rgba(154, 31, 54, 0.1)', // very pale red
          color: 'rgba(154, 31, 54, 1)', // deep red for text
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(154, 31, 54, 0.2)',
          transition: 'all 0.3s ease',
          marginLeft: '0',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(154, 31, 54, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(154, 31, 54, 0.2)';
        }}
      >
        ← Back
      </button>
    </div>
  );
};

export default BackButton;
