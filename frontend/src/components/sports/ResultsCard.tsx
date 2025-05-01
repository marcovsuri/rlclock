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
        padding: isMobile ? "4vw" : "2vw",
        maxHeight: "40vh",
        overflowY: "auto",
        color: "rgb(154, 31, 54)",
        width: isMobile ? "100%" : "48%",
        marginBottom: isMobile ? "4vh" : 0,
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "5vh" : "2.5vw",
          marginBottom: "1.5vh",
          textAlign: "center",
        }}
      >
        Past Results
      </h2>
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
          {result.date} — {result.result}
        </div>
      ))}
    </div>
  );
};

export default ResultsCard;
