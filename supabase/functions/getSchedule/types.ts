import { z } from "zod";

/*
----------------
API TYPES
----------------
*/
const API_currentBlockSchema = z.object({
  // period: z.literal('Passing Time').or(z.number()), // e.g., "1" or "Passing Time"
  period: z.string().or(z.number()), // e.g., "1" or "Passing Time"
  name: z.string(),
  start: z.string().regex(/^\d{1,2}:\d{2}$/),
  end: z.string().regex(/^\d{1,2}:\d{2}$/),
  block: z.string().length(1).optional(), // e.g., "A"
});

const API_scheduleSchema = z.object({
  name: z.string(),
  periods: z.array(API_currentBlockSchema),
});

type API_CurrentBlock = z.infer<typeof API_currentBlockSchema>;
type API_Schedule = z.infer<typeof API_scheduleSchema>;

/*
----------------
FRONTEND TYPES
----------------
*/
const periodSchema = z.object({
  index: z.number(),
  name: z.string(),
  start: z.coerce.date(), // Force Date conversion
  end: z.coerce.date(), // Force Date conversion
  block: z.string().length(1).optional(),
});

const scheduleSchema = z.object({
  name: z.string(),
  periods: z.array(periodSchema),
});

type Period = z.infer<typeof periodSchema>;
type Schedule = z.infer<typeof scheduleSchema>;

/*
----------------
DATABASE TYPES
----------------
*/
const scheduleEntrySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  day: z.string(),
  schedule: scheduleSchema,
});

type ScheduleEntry = z.infer<typeof scheduleEntrySchema>;

const scheduleQuerySchema = z.array(scheduleEntrySchema);

type ScheduleQuery = z.infer<typeof scheduleQuerySchema>;

export {
  API_currentBlockSchema,
  API_scheduleSchema,
  periodSchema,
  scheduleEntrySchema,
  scheduleQuerySchema,
  scheduleSchema,
};
export type {
  API_CurrentBlock,
  API_Schedule,
  Period,
  Schedule,
  ScheduleEntry,
  ScheduleQuery,
};
