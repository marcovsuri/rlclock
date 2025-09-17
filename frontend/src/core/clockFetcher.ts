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

interface LocalScheduleData {
  schedule: Schedule;
  lastUpdated: Date;
}

const getScheduleFromLocal = (): Result<LocalScheduleData> => {
  // const localData = localStorage.getItem('schedule');
  const localData = null;

  if (!localData) {
    return {
      success: false,
      errorMessage: 'No schedule data found in local storage',
    };
  }

  const parsedData: LocalScheduleData = JSON.parse(localData);

  return {
    success: true,
    data: {
      schedule: parsedData.schedule,
      lastUpdated: new Date(parsedData.lastUpdated),
    },
  };
};

const getSchedule = async (): Promise<Result<Schedule>> => {
  try {
    const localDataResult = getScheduleFromLocal();

    if (localDataResult.success) {
      const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds
      const now = new Date();
      const lastUpdated = new Date(localDataResult.data.lastUpdated); // ensure it's a Date

      if (now.getTime() - lastUpdated.getTime() < THIRTY_MINUTES) {
        console.log('Schedule: using local data');
        return {
          success: true,
          data: localDataResult.data.schedule,
        };
      }
    }

    console.log('Schedule: fetching new data');

    // const response = await fetch(scheduleUrl);

    // if (!response.ok) {
    //   throw new Error('Failed to fetch data from API');
    // }

    // const data = await response.json();

    // const parsedData = scheduleSchema.parse(data);

    const parsedData: Schedule = {
      name: 'No Hall',
      periods: [
        { period: 0, name: 'Homeroom', start: '9:00', end: '9:05' },
        { period: 1, name: 'F Block', start: '9:10', end: '9:55' },
        { period: 2, name: 'G Block', start: '10:00', end: '10:45' },
        { period: 3, name: 'H Block', start: '10:50', end: '11:35' },
        {
          period: 4,
          name: 'A Block - First Lunch',
          start: '11:40',
          end: '12:05',
        },
        {
          period: 5,
          name: 'A Block - Between Lunches',
          start: '12:10',
          end: '12:25',
        },
        {
          period: 6,
          name: 'A Block - Second Lunch',
          start: '12:30',
          end: '12:55',
        },
        { period: 7, name: 'B Block', start: '13:00', end: '13:45' },
        { period: 8, name: 'C Block', start: '13:50', end: '14:35' },
      ],
    };

    localStorage.setItem(
      'schedule',
      JSON.stringify({
        schedule: parsedData,
        lastUpdated: new Date(),
      })
    );

    return {
      success: true,
      data: parsedData,
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
