-- Use 2025 year for dates
-- class_enum values: 'I', 'II', 'III', 'IV', 'V', 'VI'

INSERT INTO public.exams (class, day, time_start, time_end, name, teacher, room, is_active) VALUES

-- Monday, May 19, 2025
('II', '2025-05-19', '08:30:00', '11:00:00', 'English 11', 'Mr. Beam', 'Refectory', true),
('II', '2025-05-19', '08:30:00', '11:00:00', 'English 11', 'Mr. Cervas', 'Refectory', true),
('II', '2025-05-19', '08:30:00', '11:00:00', 'English 11', 'Mr. Hiatt', 'Refectory', true),
('II', '2025-05-19', '08:30:00', '11:00:00', 'English 11', 'Dr. Wilson', 'Refectory', true),

('II', '2025-05-19', '12:00:00', '14:30:00', 'Spanish 3', 'Sr. Solis', 'Room P13', true),
('II', '2025-05-19', '12:00:00', '14:30:00', 'French 3', 'Mr. Diop', 'Room P11', true),
('II', '2025-05-19', '12:00:00', '14:30:00', 'Honors Computer Science', 'Mr. Piper', 'Robotics Lab', true),
('II', '2025-05-19', '12:00:00', '14:30:00', 'Greek 2', 'Mr. Phillips', 'Room J21', true),

-- Tuesday, May 20, 2025
('II', '2025-05-20', '08:30:00', '11:00:00', 'Honors Chemistry', 'Dr. Beauregard', 'Chem Lab', true),
('II', '2025-05-20', '08:30:00', '11:00:00', 'Honors Chemistry', 'Ms. Salas', 'Lecture Room', true),
('II', '2025-05-20', '08:30:00', '11:00:00', 'Chemistry', 'Dr. Hyde', 'Bio Lab', true),

-- Wednesday, May 21, 2025
('II', '2025-05-21', '08:30:00', '11:00:00', 'Honors Precalculus', 'Mr. Sokol', 'Lecture Room', true),
('II', '2025-05-21', '08:30:00', '11:00:00', 'Honors Precalculus', 'Ms. Delaney', 'Lecture Room', true),
('II', '2025-05-21', '08:30:00', '11:00:00', 'Precalculus', 'Mr. Doerer', 'Room E23', true),
('II', '2025-05-21', '08:30:00', '11:00:00', 'Honors Calculus', 'Mr. Bettendorf', 'Room E22', true),
('II', '2025-05-21', '08:30:00', '11:00:00', 'Multivariable Calculus', 'Mr. Bettendorf', 'Room E22', true),

('II', '2025-05-21', '12:00:00', '14:30:00', 'Applied Art', 'Ms. Sutton', 'Art Studio', true),
('II', '2025-05-21', '12:00:00', '14:30:00', 'Latin 5', 'Mr. Reid', 'Room J22', true),
('II', '2025-05-21', '12:00:00', '14:30:00', 'Latin 2-3', 'Mr. Reid', 'Room J22', true),
('II', '2025-05-21', '12:00:00', '14:30:00', 'Latin 4', 'Mr. Matthews', 'Room J20', true),
('II', '2025-05-21', '12:00:00', '14:30:00', 'Latin 4', 'Ms. Morris-Kliment', 'Room J21', true),
('II', '2025-05-21', '12:00:00', '14:30:00', 'Music Theory', 'Mr. Opdycke', 'Choral Room', true);

