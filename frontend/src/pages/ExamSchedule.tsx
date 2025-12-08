import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';
import { Exam } from '../types/exams';
import getExamData from '../core/examsFetcher';

interface ExamScheduleProps {
  isDarkMode: boolean;
}

const classLevels = ['I', 'II', 'III', 'IV', 'V', 'VI'];

// Convert "HH:MM:SS" to "h:mm AM/PM"
const formatTime12h = (time24: string) => {
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minutes = minStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

// Format a slot from start-end times using 12-hr format
const formatSlot = (start: string, end: string) =>
  `${formatTime12h(start)} – ${formatTime12h(end)}`;

// Format day string "YYYY-MM-DD" to "DayName, Month Day" (e.g. Monday, May 22)
const formatDay = (day: string) => {
  const date = new Date(day + 'T00:00');

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const ExamSchedule: React.FC<ExamScheduleProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();
  const [selectedClass, setSelectedClass] = useState<string>('I');
  const [exams, setExams] = useState<Exam[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [groupedExams, setGroupedExams] = useState<
    Record<string, Record<string, Exam[]>>
  >({});
  const [filteredDays, setFilteredDays] = useState<string[]>([]);

  useEffect(() => {
    getExamData().then((result) => {
      if (result.success) {
        const fetchedExams: Exam[] = result.data;
        setExams(fetchedExams);
        const uniqueDays = Array.from(
          new Set(fetchedExams.map((e) => e.day))
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        setDays(uniqueDays);
      }
    });
  }, []);

  // Build slots from exams of the selected class
  useEffect(() => {
    const classExams = exams.filter((exam) => exam.class === selectedClass);

    // Map slot string => start time for sorting
    const slotToStartTime: Record<string, string> = {};
    const slotsSet = new Set<string>();

    classExams.forEach((e) => {
      const slotStr = formatSlot(e.time_start, e.time_end);
      slotsSet.add(slotStr);
      if (!slotToStartTime[slotStr]) {
        slotToStartTime[slotStr] = e.time_start;
      }
    });

    // Sort slots by start time ascending
    const slots = Array.from(slotsSet).sort((a, b) =>
      slotToStartTime[a].localeCompare(slotToStartTime[b])
    );

    setTimeSlots(slots);

    // Group exams by slot and day
    const grouped: Record<string, Record<string, Exam[]>> = {};
    slots.forEach((slot) => {
      grouped[slot] = {};
      days.forEach((day) => {
        grouped[slot][day] = classExams.filter(
          (exam) =>
            formatSlot(exam.time_start, exam.time_end) === slot &&
            exam.day === day
        );
      });
    });
    setGroupedExams(grouped);

    // Filter days that have at least one exam in any slot
    const daysWithExams = days
      .filter((day) => slots.some((slot) => grouped[slot][day]?.length > 0))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    setFilteredDays(daysWithExams);
  }, [exams, selectedClass, days]);

  const cellStyle: React.CSSProperties = {
    border: '1px solid rgba(154, 31, 54, 0.2)',
    borderRadius: '12px',
    padding: '1rem',
    backgroundColor: isDarkMode
      ? 'rgba(154, 31, 54, 0.15)'
      : 'rgba(154, 31, 54, 0.05)',
    color: isDarkMode ? 'white' : 'black',
    textAlign: 'center',
    verticalAlign: 'center',
    minWidth: '20vw',
  };

  const headerStyle: React.CSSProperties = {
    ...cellStyle,
    fontWeight: 600,
    backgroundColor: isDarkMode
      ? 'rgba(154, 31, 54, 0.3)'
      : 'rgba(154, 31, 54, 0.1)',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: isMobile ? '4rem 1.5rem' : '4rem',
        overflowX: 'auto',
      }}
    >
      <h2 style={{ textAlign: 'center', color: 'rgba(154, 31, 54, 1)' }}>
        Class {selectedClass} Exam Schedule
      </h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '1.5rem 0',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {classLevels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedClass(level)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(154, 31, 54, 0.2)',
              backgroundColor:
                selectedClass === level
                  ? 'rgba(154, 31, 54, 0.9)'
                  : 'rgba(154, 31, 54, 0.1)',
              color: selectedClass === level ? '#fff' : 'rgba(154, 31, 54, 1)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Class {level}
          </button>
        ))}
      </div>

      {!timeSlots.length || !filteredDays.length ? (
        <h3
          style={{
            textAlign: 'center',
            marginTop: '4rem',
            color: 'rgba(154, 31, 54, 1)',
          }}
        >
          No Exams!
        </h3>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredDays.map((day) =>
            timeSlots.map((slot) => {
              const exams = groupedExams[slot]?.[day] ?? [];
              if (!exams.length) return null;
              // Group exams by name
              const groupedByName: Record<string, Exam[]> = {};
              exams.forEach((exam) => {
                if (!groupedByName[exam.name]) {
                  groupedByName[exam.name] = [];
                }
                groupedByName[exam.name].push(exam);
              });
              return (
                <React.Fragment key={`${slot}-${day}`}>
                  <div
                    style={{
                      ...cellStyle,
                      fontWeight: 600,
                      backgroundColor: isDarkMode
                        ? 'rgba(154, 31, 54, 0.3)'
                        : 'rgba(154, 31, 54, 0.1)',
                    }}
                  >
                    {formatDay(day)}: {slot}
                  </div>
                  <div
                    style={{
                      ...cellStyle,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    {Object.entries(groupedByName).map(([name, group], idx) => (
                      <div key={idx} style={{ marginBottom: '1rem' }}>
                        <strong>{name}</strong>
                        <ul
                          style={{
                            margin: '0.25rem 0 0 0',
                            padding: 0,
                            listStyle: 'none',
                            fontSize: '0.85rem',
                          }}
                        >
                          {group.map((exam, i) => (
                            <li key={i}>
                              {exam.teacher} — {exam.room}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      ) : (
        <div
          style={{
            overflowX: 'auto',
            width: '85vw',
            boxSizing: 'border-box',
            position: 'relative',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0.75rem',
              tableLayout: 'auto',
              minWidth: '768px',
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>Time</th>
                {filteredDays.map((day) => (
                  <th key={day} style={headerStyle}>
                    {formatDay(day)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => {
                return (
                  <tr key={slot}>
                    <td style={headerStyle}>{slot}</td>
                    {filteredDays.map((day) => {
                      const exams = groupedExams[slot]?.[day] ?? [];
                      if (!exams.length) return null;
                      // Group exams by name
                      const groupedByName: Record<string, Exam[]> = {};
                      exams.forEach((exam) => {
                        if (!groupedByName[exam.name]) {
                          groupedByName[exam.name] = [];
                        }
                        groupedByName[exam.name].push(exam);
                      });
                      return (
                        <td key={`${day}-${slot}`} style={cellStyle}>
                          {Object.entries(groupedByName).map(
                            ([name, group], idx) => (
                              <div key={idx} style={{ marginBottom: '1rem' }}>
                                <strong>{name}</strong>
                                <ul
                                  style={{
                                    margin: '0.25rem 0 0 0',
                                    padding: 0,
                                    listStyle: 'none',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {group.map((exam, i) => (
                                    <li key={i}>
                                      {exam.teacher} — {exam.room}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ExamSchedule;
