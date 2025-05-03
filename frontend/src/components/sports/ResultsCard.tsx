import React from "react";

interface Result {
  date: string;
  result: string;
}

interface ResultsCardProps {
  results: Result[];
  isMobile: boolean;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ results, isMobile }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: isMobile ? "5vw" : "2vw",
    boxShadow: "0 4px 20px rgba(154, 31, 54, 0.5)",
    padding: isMobile ? "4vw" : "2vw",
    color: "rgb(154, 31, 54)",
    width: isMobile ? "100%" : "60%",
    marginBottom: isMobile ? "4vh" : 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  };

  const scrollAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    position: "relative",
    scrollbarWidth: "none", // for Firefox
  };

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    textAlign: "center",
    zIndex: 2,
    background: "linear-gradient(to bottom, white, rgba(255, 255, 255, 0))",
    padding: isMobile ? "4vw" : "2vw",
    paddingTop: isMobile ? "6vw" : "4vh",
    paddingBottom: isMobile ? "2vw" : "0.5vh",
    backdropFilter: "blur(2px)",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? "5vh" : "2.5vw",
    margin: 0,
    color: "rgb(154, 31, 54)",
  };

  const resultsWrapperStyle: React.CSSProperties = {
    position: "relative",
    paddingTop: "2vh",
  };

  const resultItemStyle: React.CSSProperties = {
    backgroundColor: "rgba(154, 31, 54, 0.05)",
    padding: isMobile ? "2.5vw" : "1vw",
    borderRadius: isMobile ? "3vw" : "1vw",
    fontWeight: 500,
    fontSize: isMobile ? "4vw" : "1.2vw",
    color: "black",
    marginBottom: "1vh",
  };

  const bottomOverlayStyle: React.CSSProperties = {
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2vh",
    background: "linear-gradient(to top, white, rgba(255, 255, 255, 0))",
    pointerEvents: "none",
    backdropFilter: "blur(2px)",
    zIndex: 3,
  };

  return (
    <div style={cardStyle}>
      <div style={scrollAreaStyle}>
        {/* Sticky header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>Past Results</h2>
        </div>

        {/* Scrollable content */}
        <div style={resultsWrapperStyle}>
          {results.map((result, index) => (
            <div key={index} style={resultItemStyle}>
              {result.result}
            </div>
          ))}

          {/* Bottom fade overlay */}
          <div style={bottomOverlayStyle} />
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
