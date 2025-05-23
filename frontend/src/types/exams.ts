import { z } from 'zod';

const classEnum = z.enum(['I', 'II', 'III', 'IV', 'V', 'VI']);

const examSchema = z.object({
  class: classEnum, // class (enum)
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // day (date string "YYYY-MM-DD")
  time_start: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // time (e.g., "08:30:00")
  time_end: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  name: z.string(), // name (text)
  teacher: z.string(), // teacher (text)
  room: z.string(), // room (text)
  is_active: z.boolean(), // is_active (bool)
});

export type Exam = z.infer<typeof examSchema>;
