import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';
import { Exam, ExamData } from '../types/exams';
import getExamData from '../core/examsFetcher';
import BackButton from '../components/global/BackButton';

interface ExamScheduleProps {
  isDarkMode: boolean;
}

const timeSlotsByClass: Record<string, string[]> = {
  II: ['8:30 – 11:00', '12:00 – 2:30'],
  III: ['8:30 – 10:45', '12:00 – 2:15'],
  IV: ['8:30 – 10:45', '12:00 – 2:15'],
  V: ['8:30 – 10:30', '12:00 – 2:00'],
  VI: ['8:30 – 10:30', '12:00 – 2:00'],
};

const classLevels = ['II', 'III', 'IV', 'V', 'VI'];

function hasNoExams(
  groupedExams: Record<string, Record<string, Exam[]>>
): boolean {
  for (const timeSlot in groupedExams) {
    for (const day in groupedExams[timeSlot]) {
      if (groupedExams[timeSlot][day]?.length > 0) {
        return false;
      }
    }
  }
  return true;
}

const ExamSchedule: React.FC<ExamScheduleProps> = ({ isDarkMode }) => {
  const [disabledClasses, setDisabledClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('II');
  const isMobile = useIsMobile();
  const [exams, setExams] = useState<Exam[]>([]);
  const [days, setDays] = useState<string[]>([]);

  const timeSlots = timeSlotsByClass[selectedClass];

  const [groupedExams, setGroupedExams] = useState<
    Record<string, Record<string, Exam[]>>
  >({});

  useEffect(() => {
    getExamData().then((result) => {
      if (result.success) {
        setDisabledClasses(result.data.disabledClasses);
        setExams(result.data.exams || []);
        setDays(result.data.days || []);
      }
    });
  }, []);

  useEffect(() => {
    setSelectedClass(
      classLevels.filter((level) => !disabledClasses.includes(level))[0] ?? 'II'
    );
  }, [disabledClasses]);

  useEffect(() => {
    if (!timeSlots || timeSlots.length === 0 || days.length === 0) return;

    const newGroupedExams: Record<string, Record<string, Exam[]>> = {};
    timeSlots.forEach((time) => {
      newGroupedExams[time] = {};
      days.forEach((day) => {
        newGroupedExams[time][day] = exams.filter(
          (exam) => exam.time === time && exam.day === day
        );
      });
    });
    setGroupedExams(newGroupedExams);
  }, [days, timeSlots, exams]);

  const cellStyle: React.CSSProperties = {
    border: '1px solid rgba(154, 31, 54, 0.2)',
    borderRadius: '16px',
    padding: '1rem',
    verticalAlign: 'center',
    backgroundColor: isDarkMode
      ? 'rgba(154, 31, 54, 0.15)'
      : 'rgba(154, 31, 54, 0.05)',
    color: isDarkMode ? 'white' : 'black',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    justifySelf: 'center',
  };

  const headerStyle: React.CSSProperties = {
    ...cellStyle,
    fontWeight: 'bold',
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
        overflowX: 'hidden',
      }}
    >
      <h2 style={{ textAlign: 'center', color: 'rgba(154, 31, 54, 1)' }}>
        Class {selectedClass} Exam Schedule
      </h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          margin: '1rem 0',
        }}
      >
        {classLevels.map((level) => (
          <button
            key={level}
            disabled={disabledClasses.includes(level)}
            onClick={() => setSelectedClass(level)}
            style={{
              padding: isMobile ? '0.8vh 4vw' : '0.8vh 1.5vw',
              borderRadius: '12px',
              border: '1px solid rgba(154, 31, 54, 0.2)',
              backgroundColor: disabledClasses.includes(level)
                ? 'rgba(200, 200, 200, 0.3)'
                : selectedClass === level
                ? 'rgba(154, 31, 54, 0.9)'
                : 'rgba(154, 31, 54, 0.1)',
              color: disabledClasses.includes(level)
                ? '#888'
                : selectedClass === level
                ? '#fff'
                : 'rgba(154, 31, 54, 1)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: disabledClasses.includes(level)
                ? 'not-allowed'
                : 'pointer',
              boxShadow: disabledClasses.includes(level)
                ? 'none'
                : selectedClass === level
                ? '0 6px 12px rgba(154, 31, 54, 0.4)'
                : '0 2px 6px rgba(154, 31, 54, 0.2)',
              transition: 'all 0.3s ease, box-shadow 0.5s ease',
              opacity: disabledClasses.includes(level) ? 0.6 : 1,
            }}
          >
            Class {level}
          </button>
        ))}
      </div>
      {hasNoExams(groupedExams) ? (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: '0',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: -1000,
          }}
        >
          <h1
            style={{
              color: 'rgba(154, 31, 54, 1)',
              textAlign: 'center',
            }}
          >
            No Exams!
          </h1>
        </div>
      ) : !isMobile ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            tableLayout: 'auto',
            borderSpacing: '1rem',
          }}
        >
          <thead>
            <tr>
              <th style={headerStyle}>Time</th>
              {days.map((day) => (
                <th key={day} style={headerStyle}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td style={headerStyle}>{time}</td>
                {days.map((day) => (
                  <td key={`${day}-${time}`} style={cellStyle}>
                    {groupedExams[time][day].map((exam, i) => (
                      <div key={i} style={{ marginBottom: '0.75rem' }}>
                        <strong>{exam.subject}</strong>
                        {exam.locations.map((loc, idx) => (
                          <div key={idx} style={{ fontSize: '0.85em' }}>
                            {exam.teachers[idx]} — {loc}
                          </div>
                        ))}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          {days.map((day) => {
            const filtered = timeSlots.filter(
              (time) => groupedExams[time][day]?.length > 0
            );
            if (filtered.length === 0) return null;
            return (
              <div key={day} style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'rgba(154, 31, 54, 1)' }}>{day}</h3>
                {filtered.map((time) => (
                  <div
                    key={time}
                    style={{
                      backgroundColor: isDarkMode
                        ? 'rgba(154, 31, 54, 0.15)'
                        : 'rgba(154, 31, 54, 0.05)',
                      color: isDarkMode ? 'white' : 'black',
                      border: '1px solid rgba(154, 31, 54, 0.2)',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                    }}
                  >
                    <h4 style={{ marginBottom: '0.5rem' }}>{time}</h4>
                    {groupedExams[time][day].map((exam, i) => (
                      <div key={i} style={{ marginBottom: '0.5rem' }}>
                        <strong>{exam.subject}</strong>
                        {exam.locations.map((loc, idx) => (
                          <div key={idx} style={{ fontSize: '1rem' }}>
                            {exam.teachers[idx]} — {loc}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ExamSchedule;
