import React from 'react';
import { TeamEvent } from '../../types/sports';

interface ResultsCardProps {
  results: TeamEvent[] | undefined | null;
  isMobile: boolean;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ results, isMobile }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: isMobile ? '5vw' : '2vw',
    boxShadow: '0 4px 20px rgba(154, 31, 54, 0.5)',
    padding: isMobile ? '4vw' : '2vw',
    paddingTop: 0,
    paddingBottom: 0,
    color: 'rgb(154, 31, 54)',
    width: isMobile ? '100%' : '70%',
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

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    textAlign: 'center',
    zIndex: 2,
    background: 'linear-gradient(to bottom, white, rgba(255, 255, 255, 0))',
    padding: isMobile ? '4vw' : '2vw',
    paddingBottom: isMobile ? '0' : '1vh',
    backdropFilter: 'blur(2px)',
    margin: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '5vh' : '2.5vw',
    margin: 0,
    color: 'rgb(154, 31, 54)',
    paddingTop: isMobile ? '4vh' : '1vw',
  };

  const resultsWrapperStyle: React.CSSProperties = {
    position: 'relative',
    paddingTop: '1vh', // space between header and items
    // paddingBottom: '2vh', // space for bottom blur
  };

  const resultItemStyle: React.CSSProperties = {
    backgroundColor: 'rgba(154, 31, 54, 0.05)',
    padding: isMobile ? '2.5vw' : '1vw',
    borderRadius: isMobile ? '3vw' : '1vw',
    fontWeight: 500,
    fontSize: isMobile ? '4vw' : '1.2vw',
    color: 'black',
    marginBottom: '1vh',
    textAlign: 'center',
  };

  const bottomOverlayStyle: React.CSSProperties = {
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3vh',
    background: 'linear-gradient(to top, white, rgba(255, 255, 255, 0))',
    pointerEvents: 'none',
    backdropFilter: 'blur(2px)',
    zIndex: 3,
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
        <div style={headerStyle}>
          <h2 style={titleStyle}>Past Results</h2>
        </div>

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
                    <div key={i}>
                      ({outcome}) {result.team} vs. {opponent} (
                      {result.scores[i]})
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={bottomOverlayStyle} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsCard;
