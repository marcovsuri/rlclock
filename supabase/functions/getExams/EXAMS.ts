import { ExamData } from "./schema.ts";

export const IN_USE = true;

const EXAMS: ExamData = {
  days: ["Monday, May 19", "Tuesday, May 20", "Wednesday, May 21"],
  timeSlots: {
    II: ["8:30 – 11:00", "12:00 – 2:30"],
  },
  disabledClasses: ["I", "III", "IV", "V", "VI"],
  exams: [
    {
      time: "8:30 – 11:00",
      subject: "English 11",
      day: "Monday, May 19",
      locations: ["Refectory", "Refectory", "Refectory", "Refectory"],
      teachers: ["Mr. Beam", "Mr. Cervas", "Mr. Hiatt", "Dr. Wilson"],
    },
    {
      time: "12:00 – 2:30",
      subject: "Spanish 3",
      day: "Monday, May 19",
      locations: ["Room P13"],
      teachers: ["Sr. Solis"],
    },
    {
      time: "12:00 – 2:30",
      subject: "French 3",
      day: "Monday, May 19",
      locations: ["Room P11"],
      teachers: ["Mr. Diop"],
    },
    {
      time: "12:00 – 2:30",
      subject: "Honors Computer Science",
      day: "Monday, May 19",
      locations: ["Robotics Lab"],
      teachers: ["Mr. Piper"],
    },
    {
      time: "12:00 – 2:30",
      subject: "Greek 2",
      day: "Monday, May 19",
      locations: ["Room J21"],
      teachers: ["Mr. Phillips"],
    },
    {
      time: "8:30 – 11:00",
      subject: "Honors Chemistry",
      day: "Tuesday, May 20",
      locations: ["Chem Lab", "Lecture Room"],
      teachers: ["Dr. Beauregard", "Ms. Salas"],
    },
    {
      time: "8:30 – 11:00",
      subject: "Chemistry",
      day: "Tuesday, May 20",
      locations: ["Bio Lab"],
      teachers: ["Dr. Hyde"],
    },
    {
      time: "8:30 – 11:00",
      subject: "Honors Precalculus",
      day: "Wednesday, May 21",
      locations: ["Lecture Room", "Lecture Room"],
      teachers: ["Mr. Sokol", "Ms. Delaney"],
    },
    {
      time: "8:30 – 11:00",
      subject: "Precalculus",
      day: "Wednesday, May 21",
      locations: ["Room E23"],
      teachers: ["Mr. Doerer"],
    },
    {
      time: "8:30 – 11:00",
      subject: "Honors Calculus",
      day: "Wednesday, May 21",
      locations: ["Room E22"],
      teachers: ["Mr. Bettendorf"],
    },
    {
      time: "8:30 – 11:00",
      subject: "Multivariable Calculus",
      day: "Wednesday, May 21",
      locations: ["Room E22"],
      teachers: ["Mr. Bettendorf"],
    },
    {
      time: "12:00 – 2:30",
      subject: "Applied Art",
      day: "Wednesday, May 21",
      locations: ["Art Studio"],
      teachers: ["Ms. Sutton"],
    },
    {
      time: "12:00 – 2:30",
      subject: "Latin 5",
      day: "Wednesday, May 21",
      locations: ["Room J22"],
      teachers: ["Mr. Reid"],
    },
    {
      time: "12:00 – 2:30",
      subject: "Latin 2-3",
      day: "Wednesday, May 21",
      locations: ["Room J22"],
      teachers: ["Mr. Reid"],
    },
    {
      time: "12:00 – 2:30",
      subject: "Latin 4",
      day: "Wednesday, May 21",
      locations: ["Room J20", "Room J21"],
      teachers: ["Mr. Matthews", "Ms. Morris-Kliment"],
    },
    {
      time: "12:00 – 2:30",
      subject: "Music Theory",
      day: "Wednesday, May 21",
      locations: ["Choral Room"],
      teachers: ["Mr. Opdycke"],
    },
  ],
};

export default EXAMS;
