import { z } from "zod";

const MatchResultEnum = z.enum(["win", "tie", "loss"]);

const matchSchema = z
  .object({
    team: z.string(),
    opponents: z.array(z.string()),
    date: z.string(),
    results: z.array(MatchResultEnum),
    scores: z.array(z.string()),
  })
  .refine(
    ({ opponents, results, scores }) =>
      opponents.length === results.length && results.length === scores.length,
    { message: "opponents, results, and scores must all have the same length" },
  );

type Match = z.infer<typeof matchSchema>;
type MatchResult = z.infer<typeof MatchResultEnum>;

export { matchSchema };
export type { Match, MatchResult };
