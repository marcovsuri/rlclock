import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../hooks/useIsMobile';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div style={{ alignSelf: 'flex-start', marginBottom: '2vh' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: isMobile ? '0.8vh 4vw' : '0.8vh 1.5vw',
          borderRadius: '12px',
          border: '1px solid rgba(154, 31, 54, 0.2)',
          backgroundColor: 'rgba(154, 31, 54, 0.1)', // very pale red
          color: 'rgba(154, 31, 54, 1)', // deep red for text
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(154, 31, 54, 0.2)',
          transition: 'all 3s ease, box-shadow 0.5s ease',
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
