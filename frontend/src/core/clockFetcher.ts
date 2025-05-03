import { z } from 'zod';
import { Result } from '../types/global';

const dayTypeUrl = 'https://rl-mod-clock-api.azurewebsites.net/daytype.json';
const scheduleUrl =
  'https://rl-mod-clock-api.azurewebsites.net/todays_schedule.json';

const currentBlockSchema = z.object({
  // period: z.literal('Passing Time').or(z.number()), // e.g., "1" or "Passing Time"
  period: z.string().or(z.number()), // e.g., "1" or "Passing Time"
  name: z.string(),
  start: z.string().regex(/^\d{1,2}:\d{2}$/),
  end: z.string().regex(/^\d{1,2}:\d{2}$/),
  block: z.string().length(1).optional(), // e.g., "A"
});

const dayTypeSchema = z.object({
  date: z.string().regex(/^\d{8}$/), // e.g., "20250430"
  dayType: z.string().length(1), // e.g., "F"
  hallLength: z.number().int().nonnegative(),
  currentBlock: currentBlockSchema,
  remainingMin: z.number().int().nonnegative(),
  remainingSec: z.number().int().nonnegative(),
  remainingTime: z.string().regex(/^\d+:\d{2}$/), // e.g., "2:48"
  remainingDisp: z.number().int().nonnegative(),
});

const scheduleSchema = z.object({
  name: z.string(),
  periods: z.array(currentBlockSchema),
});

export type DayType = z.infer<typeof dayTypeSchema>;
export type CurrentBlock = z.infer<typeof currentBlockSchema>;
export type Schedule = z.infer<typeof scheduleSchema>;

const getDayType = async (): Promise<Result<DayType>> => {
  try {
    const response = await fetch(dayTypeUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch data from API');
    }

    const data = await response.json();

    return {
      success: true,
      data: dayTypeSchema.parse(data),
    };
  } catch (error) {
    console.error('Error fetching day type:', error);
    return {
      success: false,
      errorMessage: 'Failed to fetch day type',
    };
  }
};

const getSchedule = async (): Promise<Result<Schedule>> => {
  try {
    const response = await fetch(scheduleUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch data from API');
    }

    const data = await response.json();

    return {
      success: true,
      data: scheduleSchema.parse(data),
    };
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return {
      success: false,
      errorMessage: 'Failed to fetch schedule',
    };
  }
};

export { getDayType, getSchedule };
