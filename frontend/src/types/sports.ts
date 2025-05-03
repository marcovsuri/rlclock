import { z } from 'zod';

export const TeamEventSchema = z.object({
  team: z.string(),
  opponents: z.array(z.string()),
  date: z.string(),
  wins: z.array(z.boolean()),
  scores: z.array(z.string()),
});

export type TeamEvent = z.infer<typeof TeamEventSchema>;
