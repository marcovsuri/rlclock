import React, { createContext, useEffect, useState, useContext } from "react";
import { getDayType, DayType } from "../../core/data";

const DayTypeContext = createContext<DayType | null>(null);

export const useDayType = () => useContext(DayTypeContext);

export const DayTypeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dayType, setDayType] = useState<DayType | null>(null);

  useEffect(() => {
    const fetchDayType = async () => {
      const data = await getDayType();
      setDayType(data);
    };

    fetchDayType();

    const interval = setInterval(fetchDayType, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  return (
    <DayTypeContext.Provider value={dayType}>
      {children}
    </DayTypeContext.Provider>
  );
};
