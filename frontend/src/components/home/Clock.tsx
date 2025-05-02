import React, { useEffect, useState } from "react";

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

const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const minutesToHHMM = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const getCurrentBlockIndex = (): number => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < schedule.length; i++) {
    const [start, end] = schedule[i].time.split(" - ");
    if (
      currentMinutes >= timeToMinutes(start) &&
      currentMinutes < timeToMinutes(end)
    ) {
      return i;
    }
  }

  return -1;
};

const getTimeRemaining = (endTime: string) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const endMinutes = timeToMinutes(endTime);
  const remaining = endMinutes - currentMinutes;

  const mins = Math.floor(remaining);
  const secs = 60 - now.getSeconds();
  return {
    minutes: mins - 1,
    seconds: secs % 60,
  };
};

const Clock: React.FC = () => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(
    getCurrentBlockIndex()
  );
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const update = () => {
      const index = getCurrentBlockIndex();
      setCurrentBlockIndex(index);

      if (index !== -1) {
        const [, end] = schedule[index].time.split(" - ");
        setTimeLeft(getTimeRemaining(end));
      } else {
        setTimeLeft(null);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const beforeSchool =
    nowMinutes < timeToMinutes(schedule[0].time.split(" - ")[0]);
  const afterSchool =
    nowMinutes >=
    timeToMinutes(schedule[schedule.length - 1].time.split(" - ")[1]);

  const displayBlock =
    currentBlockIndex !== -1
      ? schedule[currentBlockIndex].block
      : beforeSchool
      ? "Before School"
      : afterSchool
      ? "After School"
      : "Passing Time";

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: isMobile ? "4vw" : "2vw",
        borderRadius: isMobile ? "5vw" : "2vw",
        boxShadow: "0 4px 20px rgba(154, 31, 54, 0.5)",
        textAlign: "center",
        color: "rgb(154, 31, 54)",
        width: isMobile ? "90vw" : "40vw",
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
          margin: "1vh 0",
        }}
      >
        {displayBlock}
      </p>

      {timeLeft && (
        <p
          style={{
            fontWeight: 500,
            color: "black",
            fontSize: isMobile ? "4vw" : "1.5vw",
            marginBottom: "2vh",
          }}
        >
          {timeLeft.minutes} min {timeLeft.seconds} sec remaining
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "1.5vh" : "1vh",
        }}
      >
        {schedule.map((item, index) => {
          const isCurrent = index === currentBlockIndex;
          return (
            <div
              key={index}
              style={{
                backgroundColor: isCurrent
                  ? "rgba(154, 31, 54, 0.25)"
                  : "rgba(154, 31, 54, 0.1)",
                padding: isMobile ? "2.5vw" : "1vw",
                borderRadius: isMobile ? "3vw" : "1vw",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 500,
                fontSize: isMobile ? "4vw" : "1.2vw",
                color: isCurrent ? "#9a1f36" : "black",
                border: isCurrent ? "2px solid #9a1f36" : "none",
              }}
            >
              <span>{item.block}</span>
              <span>{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Clock;
