import { z } from "zod";

const classes = z.literal("I").or(z.literal("II")).or(z.literal("III")).or(
  z.literal("IV"),
).or(z.literal("V")).or(z.literal("VI"));

const examSchema = z.object({
  time: z.string(),
  subject: z.string(),
  day: z.string(),
  locations: z.array(z.string()),
  teachers: z.array(z.string()),
});

const examDataSchema = z.object({
  days: z.array(z.string()),
  timeSlots: z.record(
    classes,
    z.array(z.string()),
  ),
  disabledClasses: z.array(classes),
  exams: z.array(examSchema),
});

export type ExamData = z.infer<typeof examDataSchema>;
