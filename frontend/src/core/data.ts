import { z } from 'zod';

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

const getDayType = async (): Promise<DayType | null> => {
    return fetch(dayTypeUrl)
        .then((response) => {
            if (!response.ok) {
                console.error(
                    'Network response was not ok:',
                    response.statusText
                );
                return null; // Return null or handle the error gracefully
            }
            return response.json();
        })
        .then((data) => {
            try {
                return dayTypeSchema.parse(data);
            } catch (error) {
                console.error('Validation error:', error, '\n Data:', data);
                return null; // Return null if parsing fails
            }
        })
        .catch(() => {
            console.error('Fetch error:', 'Failed to fetch data from API');
            return null; // Return null or handle the error gracefully
        });
};

const getSchedule = async (): Promise<Schedule | null> => {
    return fetch(scheduleUrl)
        .then((response) => {
            if (!response.ok) {
                console.error(
                    'Network response was not ok:',
                    response.statusText
                );
                return null; // Return null or handle the error gracefully
            }
            return response.json();
        })
        .then((data) => {
            try {
                return scheduleSchema.parse(data);
            } catch (error) {
                console.error('Validation error:', error, '\n Data:', data);
                return null; // Return null if parsing fails
            }
        })
        .catch(() => {
            console.error('Fetch error:', 'Failed to fetch data from API');
            return null; // Return null or handle the error gracefully
        });
};

export { getDayType, getSchedule };
