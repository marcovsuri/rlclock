import { Result } from '../types/global';
import { UpcomingEvent } from '../types/upcomingSports';

interface LocalUpcomingSportsData {
  events: UpcomingEvent[];
  lastUpdated: string; // stored as ISO string in localStorage
}

const getUpcomingSportsEventsFromLocal = (): Result<{
  events: UpcomingEvent[];
  lastUpdated: Date;
}> => {
  const localData = localStorage.getItem('upcomingSportsEvents');

  if (!localData) {
    return {
      success: false,
      errorMessage: 'No upcoming sports events data found in local storage',
    };
  }

  try {
    const parsedData: LocalUpcomingSportsData = JSON.parse(localData);

    return {
      success: true,
      data: {
        events: parsedData.events,
        lastUpdated: new Date(parsedData.lastUpdated),
      },
    };
  } catch {
    return {
      success: false,
      errorMessage: 'Failed to parse local upcoming sports data',
    };
  }
};

const getUpcomingSportsEvents = async (): Promise<Result<UpcomingEvent[]>> => {
  try {
    // const localDataResult = getUpcomingSportsEventsFromLocal();

    // if (localDataResult.success) {
    //   const THIRTY_MINUTES = 30 * 60 * 1000;
    //   const now = Date.now();
    //   const lastUpdatedTime = localDataResult.data.lastUpdated.getTime();

    //   if (now - lastUpdatedTime < THIRTY_MINUTES) {
    //     console.log('Using local upcoming sports data (fresh)');
    //     return {
    //       success: true,
    //       data: localDataResult.data.events,
    //     };
    //   }
    // }

    console.log('Fetching new upcoming sports events');

    const url = process.env.REACT_APP_UPCOMING_SPORTS_URL;
    const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error(
        'UPCOMING_SPORTS_URL or SUPABASE_ANON_KEY is not defined'
      );
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UpcomingEvent[] = await response.json();

    localStorage.setItem(
      'upcomingSportsEvents',
      JSON.stringify({
        events: data,
        lastUpdated: new Date().toISOString(),
      })
    );

    console.log(data);

    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch upcoming sports events:', error);

    return {
      success: false,
      errorMessage: 'Failed to fetch upcoming sports events',
    };
  }
};

export default getUpcomingSportsEvents;
