import { z } from 'zod';

const serviceDataSchema = z.object({
  id: z.string().uuid(), // UUID string
  last_updated: z.string(), // ISO date string, e.g., "2025-11-08T12:00:00Z"
  numDonations: z.number().int(), // number of donations
  donationGoal: z.number().int(), // target goal for donations
});

export type ServiceData = z.infer<typeof serviceDataSchema>;
