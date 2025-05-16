import React from 'react';
import { TeamEvent } from '../../types/sports';
import BottomOverlay from './BottomOverlay';
import HeaderOverlay from './HeaderOverlay';

interface ResultsCardProps {
  results: TeamEvent[] | undefined | null;
  isMobile: boolean;
  isDarkMode: boolean;
}

const ResultsCard: React.FC<ResultsCardProps> = ({
  results,
  isMobile,
  isDarkMode,
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    borderRadius: isMobile ? '5vw' : '2vw',
    boxShadow: '0 4px 20px 4px rgba(154, 31, 54, 0.5)',
    padding: 0,
    color: 'rgb(154, 31, 54)',
    width: isMobile ? '100%' : '75%',
    marginBottom: isMobile ? '3vh' : 0,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: isMobile ? '40vh' : '100%',
    overflow: 'hidden',
  };

  const scrollAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    scrollbarWidth: 'none',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '5vh' : '2.5vw',
    margin: 0,
    color: 'rgb(154, 31, 54)',
    paddingTop: isMobile ? '4vh' : '1vw',
  };

  const resultsWrapperStyle: React.CSSProperties = {
    position: 'relative',
    paddingTop: '1vh',
  };

  const resultItemStyle: React.CSSProperties = {
    backgroundColor: isDarkMode
      ? 'rgba(154, 31, 54, 0.2)'
      : 'rgba(154, 31, 54, 0.05)',
    padding: isMobile ? '2.5vw' : '1vw',
    borderRadius: isMobile ? '3vw' : '1vw',
    fontWeight: 500,
    fontSize: isMobile ? '4vw' : '1.2vw',
    color: isDarkMode ? 'white' : 'black',
    margin: '1vh 2vw',
  };

  const errorStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: isMobile ? '4vh' : '1vw',
    color: 'black',
    justifyContent: 'center',
    marginTop: '2vh',
  };

  return (
    <div style={cardStyle}>
      <div style={scrollAreaStyle}>
        <HeaderOverlay isDarkMode={isDarkMode} isMobile={isMobile}>
          <h2 style={titleStyle}>Past Results</h2>
        </HeaderOverlay>
        {/* Header overlay for the gradient effect */}

        {results === undefined ? (
          <p style={errorStyle}>Loading...</p>
        ) : results === null ? (
          <p style={errorStyle}>No results</p>
        ) : (
          <div style={resultsWrapperStyle}>
            {results.map((result, index) => (
              <div key={index} style={resultItemStyle}>
                {result.opponents.map((opponent, i) => {
                  const outcome = result.wins[i] ? 'Win' : 'Loss';
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ textAlign: 'left' }}>{result.date}</span>
                      <span style={{ textAlign: 'right' }}>
                        {result.team} vs. {opponent} (
                        {result.scores[i].replace(/-+/g, ' - ')} {outcome})
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
            <BottomOverlay isDarkMode={isDarkMode} isMobile={isMobile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsCard;
