import { z } from "https://esm.sh/zod@4.3.6";

const upcomingMatchSchema = z.object({
  team: z.string(),
  opponents: z.array(z.string()),
  date: z.string(), // M/D/YYYY
  time: z.string(),
  location: z.string(),
});

const upcomingMatchesSchema = z.array(upcomingMatchSchema);

type UpcomingMatch = z.infer<typeof upcomingMatchSchema>;

export { upcomingMatchesSchema, upcomingMatchSchema };
export type { UpcomingMatch };
