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
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: isMobile ? "5vw" : "2vw",
        boxShadow: "0 4px 20px rgba(154, 31, 54, 0.5)",
        padding: 0,
        color: "rgb(154, 31, 54)",
        width: isMobile ? "100%" : "48%",
        marginBottom: isMobile ? "4vh" : 0,
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "60vh" : "50vh", // ✅ fixed height here
        overflow: "hidden",
      }}
    >
      {/* Scrollable List with sticky header */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            textAlign: "center",
            zIndex: 2,
            background:
              "linear-gradient(to bottom, white, rgba(255, 255, 255, 0))",
            padding: isMobile ? "4vw" : "2vw",
            paddingTop: isMobile ? "6vw" : "4vw",
            paddingBottom: isMobile ? "1vw" : "0.5vw",
            backdropFilter: "blur(2px)",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "5vh" : "2.5vw",
              margin: 0,
              color: "rgb(154, 31, 54)",
            }}
          >
            Past Results
          </h2>
        </div>

        {/* Scrollable Items + Bottom Overlay */}
        <div
          style={{
            position: "relative", // ✅ needed for the overlay to position correctly
            padding: isMobile ? "4vw" : "2vw",
            paddingTop: isMobile ? "0" : "1vw",
          }}
        >
          {results.map((result, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "rgba(154, 31, 54, 0.1)",
                padding: isMobile ? "2.5vw" : "1vw",
                borderRadius: isMobile ? "3vw" : "1vw",
                fontWeight: 500,
                fontSize: isMobile ? "4vw" : "1.2vw",
                color: "black",
                marginBottom: "1vh",
              }}
            >
              {result.result}
            </div>
          ))}

          {/* Bottom gradient overlay — now correctly placed */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              height: isMobile ? "2vh" : "2vh",
              background:
                "linear-gradient(to top, white, rgba(255, 255, 255, 0))",
              pointerEvents: "none",
              backdropFilter: "blur(2px)",
              zIndex: 3,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
