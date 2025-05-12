import { z } from 'zod';

export const UpcomingEventSchema = z.object({
  team: z.string(),
  opponents: z.array(z.string()),
  date: z.string(), // Formatted as MM/DD/YYYY
  time: z.string(),
  where: z.string(),
});

export type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;
