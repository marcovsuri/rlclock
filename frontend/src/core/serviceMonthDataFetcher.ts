import { Result } from '../types/global';
import { z } from 'zod';

interface CounterSchema {
  counter: number;
  lastUpdated: Date;
}

const SheetDataSchema = z.object({
  class: z.string(),
  participationPercentage: z.number().int(),
  points: z.number().int(),
});

export type SheetData = z.infer<typeof SheetDataSchema>;

/**
 * Read cached service month counter from localStorage
 */
const getServiceMonthCounterFromLocal = (): Result<CounterSchema> => {
  const localData = localStorage.getItem('serviceMonthCounter');

  if (!localData) {
    return {
      success: false,
      errorMessage: 'No serviceMonthCounter data found in local storage',
    };
  }

  const parsedData = JSON.parse(localData) as {
    counter: number;
    lastUpdated: string;
  };

  return {
    success: true,
    data: {
      counter: parsedData.counter,
      lastUpdated: new Date(parsedData.lastUpdated),
    },
  };
};

/**
 * Fetch service month counter (cached + remote)
 */
export const getServiceMonthCounter = async (): Promise<Result<number>> => {
  try {
    const localResult = getServiceMonthCounterFromLocal();

    if (localResult.success) {
      const ONE_MINUTE = 1 * 60 * 1000;
      const now = new Date();
      const lastUpdated = localResult.data.lastUpdated;

      if (now.getTime() - lastUpdated.getTime() < ONE_MINUTE) {
        console.log('ServiceMonthCounter: using local data');
        return {
          success: true,
          data: localResult.data.counter,
        };
      }
    }

    console.log('ServiceMonthCounter: fetching new data');

    const SHEET_ID = '1tzZkz5KOsi0BQsy1IK7ahOnUnUsWzsXrubcHJUdPMYo';
    const donationCounterCell = 'Master!I23';
    const API_KEY = 'AIzaSyADL-VbqbBIO2rMU42ssff9o68u0verUGw';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${donationCounterCell}?key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.values?.[0]?.[0]) {
      throw new Error('No service month counter value found');
    }

    const parsed = parseInt(json.values[0][0], 10);
    const counter = isNaN(parsed) ? 0 : parsed;

    localStorage.setItem(
      'serviceMonthCounter',
      JSON.stringify({
        counter,
        lastUpdated: new Date().toISOString(),
      })
    );

    return {
      success: true,
      data: counter,
    };
  } catch (error: unknown) {
    let message = 'Failed to fetch service month counter';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error('Failed to fetch serviceMonthCounter:', message);

    return {
      success: false,
      errorMessage: message,
    };
  }
};

/**
 * Fetch service month leaderboard data from Google Sheets
 */
export const getServiceMonthLeaderboardData = async (): Promise<
  Result<SheetData[]>
> => {
  try {
    const SHEET_ID = '1tzZkz5KOsi0BQsy1IK7ahOnUnUsWzsXrubcHJUdPMYo';
    const RANGE = 'Master!E5:F10';
    const API_KEY = 'AIzaSyADL-VbqbBIO2rMU42ssff9o68u0verUGw';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    if (!json.values) {
      throw new Error('No data returned from Sheets API');
    }

    const parsedData: SheetData[] = json.values.map(
      ([label, pointsStr]: [string, string]) => {
        const match = label.match(/^([A-Z]+)\s+\(([\d.]+)%\)$/);
        if (!match) {
          throw new Error(`Invalid label format: ${label}`);
        }

        const [, className, participationPercentageStr] = match;

        return SheetDataSchema.parse({
          class: className,
          participationPercentage: Math.round(
            parseFloat(participationPercentageStr)
          ),
          points: parseInt(pointsStr, 10),
        });
      }
    );

    return {
      success: true,
      data: parsedData,
    };
  } catch (error: unknown) {
    let message = 'Failed to fetch service month leaderboard data';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error('Failed to fetch service month leaderboard:', message);

    return {
      success: false,
      errorMessage: message,
    };
  }
};

export default getServiceMonthCounter;
