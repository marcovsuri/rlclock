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

    const response = await fetch(scheduleUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch data from API');
    }

    const data = await response.json();

    // const parsedData = scheduleSchema.parse(data);

    // const parsedData: Schedule = {
    //   name: 'No Hall',
    //   periods: [
    //     { period: 0, name: 'Homeroom', start: '8:20', end: '8:25' },
    //     { period: 1, name: 'F Block', start: '8:30', end: '9:15' },
    //     { period: 2, name: 'G Block', start: '9:20', end: '10:05' },
    //     { period: 3, name: 'H Block', start: '10:10', end: '10:55' },
    //     {
    //       period: 4,
    //       name: 'A Block - First Lunch',
    //       start: '11:00',
    //       end: '11:25',
    //     },
    //     {
    //       period: 5,
    //       name: 'A Block - Between Lunches',
    //       start: '11:30',
    //       end: '11:45',
    //     },
    //     {
    //       period: 6,
    //       name: 'A Block - Second Lunch',
    //       start: '11:50',
    //       end: '12:15',
    //     },
    //     { period: 7, name: 'B Block', start: '12:20', end: '13:05' },
    //     { period: 8, name: 'C Block', start: '13:10', end: '13:55' },
    //     // { period: 9, name: 'E Block', start: '14:00', end: '14:45' },
    //     // { period: 10, name: 'Activities Period', start: '14:50', end: '15:20' },
    //   ],
    // };

    const parsedData: Schedule = {
      name: 'No Hall',
      periods: [
        { period: 0, name: 'Homeroom', start: '8:20', end: '8:25' },
        { period: 1, name: 'D Block', start: '8:30', end: '9:10' },
        { period: 2, name: 'E Block', start: '9:15', end: '9:55' },
        { period: 3, name: 'F Block', start: '10:00', end: '10:40' },
        { period: 4, name: 'G Block', start: '10:45', end: '11:25' },
        {
          period: 5,
          name: 'H Block - First Lunch',
          start: '11:30',
          end: '11:55',
        },
        {
          period: 6,
          name: 'H Block - Between Lunches',
          start: '12:00',
          end: '12:15',
        },
        {
          period: 7,
          name: 'H Block - Second Lunch',
          start: '12:20',
          end: '12:45',
        },
        { period: 8, name: 'A Block', start: '12:50', end: '13:30' },
        { period: 9, name: 'B Block', start: '13:35', end: '14:15' },
        { period: 10, name: 'C Block', start: '14:20', end: '15:00' },
        // { period: 9, name: 'E Block', start: '14:00', end: '14:45' },
        // { period: 10, name: 'Activities Period', start: '14:50', end: '15:20' },
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
