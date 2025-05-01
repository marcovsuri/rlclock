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
  return (
    <div
      style={{
        backgroundColor: "white", // pastel red + transparency
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgb(154, 31, 54, 0.5)",
        textAlign: "center",
        color: "rgb(154, 31, 54)",
        maxWidth: "50vw",
        minWidth: "45vw",
        margin: "0.25 rem",
      }}
    >
      <h2 style={{ marginBottom: "0.1rem", fontSize: "3rem" }}>RL Clock</h2>
      <p
        style={{
          fontWeight: 500,
          color: "black",
          fontSize: "1.5rem",
          marginBottom: 0,
        }}
      >
        A-Block
      </p>
      <p
        style={{
          marginTop: 0,
          marginBottom: "1.2rem",
          fontWeight: 500,
          color: "black",
          fontSize: "1.5rem",
        }}
      >
        14 minutes remaining
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {schedule.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "rgb(154, 31, 54, 0.1)", // slightly different shade for bubble rows
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 500,
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
