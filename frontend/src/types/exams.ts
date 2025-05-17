import { z } from 'zod';

const examSchema = z.object({
  time: z.string(),
  subject: z.string(),
  day: z.string(),
  locations: z.array(z.string()),
  teachers: z.array(z.string()),
});

export type Exam = z.infer<typeof examSchema>;
