import { z } from 'zod';

const periodSchema = z.object({
  index: z.number(),
  name: z.string(),
  start: z.date(),
  end: z.date(),
  block: z.string().length(1).optional(),
});

const scheduleSchema = z.object({
  name: z.string(),
  periods: z.array(periodSchema),
});

type Period = z.infer<typeof periodSchema>;
type Schedule = z.infer<typeof scheduleSchema>;

export { periodSchema, scheduleSchema };
export type { Period, Schedule };
