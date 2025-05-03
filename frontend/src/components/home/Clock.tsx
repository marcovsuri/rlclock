import React, { useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import { getDayType, getSchedule, DayType, Schedule } from "../../core/data";
import { useDayType } from "../contexts/DayTypeContext";

const Clock: React.FC = () => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  // const [dayType, setDayType] = useState<DayType | null>(null);

  const isMobile = useIsMobile();

  // useEffect(() => {
  //   const fetchDayType = async () => {
  //     const day = await getDayType();
  //     setDayType(day);
  //   };

  //   fetchDayType();

  //   const interval = setInterval(fetchDayType, 1000); // update every second
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const sched = await getSchedule();
        setSchedule(sched);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      }
    };

    fetchSchedule(); // initial fetch

    // Schedule refetch at next midnight
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );
    const delay = nextMidnight.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      fetchSchedule();

      setInterval(fetchSchedule, 1000 * 60 * 60 * 24);
    }, delay);

    return () => clearTimeout(midnightTimeout);
  }, []);

  const dayType = useDayType();
  const current = dayType?.currentBlock;
  const isWeekend = current?.name === "Weekend";

  const displayBlock = isWeekend
    ? "Weekend!"
    : typeof current?.period === "string" && current.period === "Passing Time"
    ? "Passing Time"
    : `${current?.block ? `${current.block} Block – ` : ""}${current?.name}`;

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

      {dayType && (
        <p
          style={{
            fontWeight: 500,
            color: "black",
            fontSize: isMobile ? "4vw" : "1.5vw",
          }}
        >
          {displayBlock}
        </p>
      )}

      {schedule && (
        <>
          <p
            style={{
              fontWeight: 500,
              color: "black",
              fontSize: isMobile ? "4vw" : "1.5vw",
              marginBottom: "2vh",
            }}
          >
            {dayType?.remainingMin} min {dayType?.remainingSec} sec remaining
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "1.5vh" : "1vh",
            }}
          >
            {schedule?.periods.map((item, index) => {
              const isCurrent =
                item.name === current?.name && item.start === current.start;

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
                  <span>
                    {item.block
                      ? item.name
                        ? `${item.block} Block - ${item.name}`
                        : `${item.block} Block`
                      : item.name}
                  </span>
                  <span>
                    {item.start} - {item.end}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Clock;
