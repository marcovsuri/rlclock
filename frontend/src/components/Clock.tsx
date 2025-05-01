import React from "react";

const schedule = [
  { time: "8:25 - 8:30", block: "Homeroom" },
  { time: "8:30 - 9:15", block: "A Block" },
  { time: "9:20 - 10:05", block: "B Block" },
  { time: "10:10 - 10:55", block: "C Block" },
  { time: "11:00 - 11:25", block: "D Block - 1st Lunch" },
  { time: "11:25 - 11:45", block: "D Block - Between Lunches" },
  { time: "11:45 - 12:05", block: "D Block - 2nd Lunch" },
  { time: "12:10 - 12:55", block: "E Block" },
  { time: "1:00 - 1:45", block: "F Block" },
  { time: "1:50 - 2:40", block: "H Block" },
];

const Clock: React.FC = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: isMobile ? "4vw" : "2vw",
        borderRadius: isMobile ? "5vw" : "2vw",
        boxShadow: "0 4px 20px rgba(154, 31, 54, 0.5)",
        textAlign: "center",
        color: "rgb(154, 31, 54)",
        width: isMobile ? "90vw" : "50vw",
        margin: "2vh auto",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginBottom: "1.5vh",
          fontSize: isMobile ? "5vh" : "3vw",
        }}
      >
        RL Clock
      </h2>

      <p
        style={{
          fontWeight: 500,
          color: "black",
          fontSize: isMobile ? "4vw" : "1.5vw",
          margin: "0.5vh 0",
        }}
      >
        A-Block
      </p>
      <p
        style={{
          margin: "0.5vh 0 2vh 0",
          fontWeight: 500,
          color: "black",
          fontSize: isMobile ? "4vw" : "1.5vw",
        }}
      >
        14 minutes remaining
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "1.5vh" : "1vh",
        }}
      >
        {schedule.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "rgba(154, 31, 54, 0.1)",
              padding: isMobile ? "2.5vw" : "1vw",
              borderRadius: isMobile ? "3vw" : "1vw",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 500,
              fontSize: isMobile ? "4vw" : "1vw",
              color: "black",
            }}
          >
            <span>{item.block}</span>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;
