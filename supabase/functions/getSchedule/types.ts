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

const NewAPI_blockSchema = z.object({
  block_id: z.number(),
  block: z.string(),
  start_time: z.string(), // ISO string
  end_time: z.string(), // ISO string
  offering_type: z.number(),
  is_canceled: z.boolean(),
});

const NewAPI_scheduleSetSchema = z.object({
  schedule_set_id: z.number(),
  day_label: z.string().optional(),
  holiday_label: z.string().optional(),
  blocks: z.array(NewAPI_blockSchema),
});

const NewAPI_daySchema = z.object({
  calendar_day: z.string(), // ISO date string
  schedule_sets: z.array(NewAPI_scheduleSetSchema),
});

const NewAPI_scheduleSchema = z.object({
  count: z.number(),
  value: z.array(NewAPI_daySchema),
});

type API_CurrentBlock = z.infer<typeof API_currentBlockSchema>;
type API_Schedule = z.infer<typeof API_scheduleSchema>;
type NewAPI_Schedule = z.infer<typeof NewAPI_scheduleSchema>;

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

const scheduleQuerySchema = z.array(scheduleEntrySchema);

const newScheduleEntrySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  day: z.string(),
  schedule: scheduleSchema, // transformed Schedule, not raw API shape
});

const newScheduleQuerySchema = z.array(newScheduleEntrySchema);

type ScheduleEntry = z.infer<typeof scheduleEntrySchema>;
type ScheduleQuery = z.infer<typeof scheduleQuerySchema>;
type NewScheduleEntry = z.infer<typeof newScheduleEntrySchema>;
type NewScheduleQuery = z.infer<typeof newScheduleQuerySchema>;

export {
  API_scheduleSchema,
  NewAPI_scheduleSchema,
  newScheduleQuerySchema,
  scheduleQuerySchema,
};
export type {
  API_Schedule,
  NewAPI_Schedule,
  NewScheduleEntry,
  NewScheduleQuery,
  Period,
  Schedule,
};
