import { z } from 'zod';

const periodSchema = z.object({
  index: z.number(),
  name: z.string(),
  start: z.coerce.date(), // Force Date conversion
  end: z.coerce.date(), // Force Date conversion
});

const scheduleSchema = z
  .object({
    name: z.string(),
    periods: z.array(periodSchema),
  })
  .nullable();

type Period = z.infer<typeof periodSchema>;
type Schedule = z.infer<typeof scheduleSchema>;

export { periodSchema, scheduleSchema };
export type { Period, Schedule };
