import { Result } from '../types/global';
import { UpcomingEvent } from '../types/upcomingSports';

interface LocalUpcomingSportsData {
  events: UpcomingEvent[];
  lastUpdated: Date;
}

const getUpcomingSportsEventsFromLocal =
  (): Result<LocalUpcomingSportsData> => {
    const localData = localStorage.getItem('upcomingSportsEvents');

    if (!localData) {
      return {
        success: false,
        errorMessage: 'No upcoming sports events data found in local storage',
      };
    }

    const parsedData: LocalUpcomingSportsData = JSON.parse(localData);

    return {
      success: true,
      data: { ...parsedData, lastUpdated: new Date(parsedData.lastUpdated) },
    };
  };

const getUpcomingSportsEvents = async (): Promise<Result<UpcomingEvent[]>> => {
  try {
    const localDataResult = getUpcomingSportsEventsFromLocal();

    if (localDataResult.success) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (localDataResult.success) {
        const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds
        const now = new Date();
        const lastUpdated = new Date(localDataResult.data.lastUpdated); // ensure it's a Date

        if (now.getTime() - lastUpdated.getTime() < THIRTY_MINUTES) {
          // console.log(
          //   'Upcoming sports events: using local data (updated within 30 minutes)'
          // );
          return {
            success: true,
            data: localDataResult.data.events,
          };
        }
      }
    }

    console.log('Upcoming sports events: fetching new data');

    const url = process.env.REACT_APP_UPCOMING_SPORTS_URL;
    const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error(
        'UPCOMING_SPORTS_URL or SUPABASE_ANON_KEY is not defined'
      );
    }

    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    localStorage.setItem(
      'upcomingSportsEvents',
      JSON.stringify({ events: data, lastUpdated: new Date() })
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch upcoming sports events:', error);
    return {
      success: false,
      errorMessage: 'Failed to fetch upcoming sports events',
    };
  }
};

export default getUpcomingSportsEvents;
