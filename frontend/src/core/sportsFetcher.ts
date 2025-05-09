import { Result } from '../types/global';
import { TeamEvent } from '../types/sports';

interface LocalSportsData {
  events: TeamEvent[];
  lastUpdated: Date;
}

const getSportsEventsFromLocal = (): Result<LocalSportsData> => {
  const localData = localStorage.getItem('sportsEvents');

  if (!localData) {
    return {
      success: false,
      errorMessage: 'No lunch menu data found in local storage',
    };
  }

  const parsedData: LocalSportsData = JSON.parse(localData);

  return {
    success: true,
    data: { ...parsedData, lastUpdated: new Date(parsedData.lastUpdated) },
  };
};

const getSportsEvents = async (): Promise<Result<TeamEvent[]>> => {
  try {
    const localDataResult = getSportsEventsFromLocal();

    if (localDataResult.success) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (localDataResult.success) {
        const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds
        const now = new Date();
        const lastUpdated = new Date(localDataResult.data.lastUpdated); // ensure it's a Date

        if (now.getTime() - lastUpdated.getTime() < THIRTY_MINUTES) {
          console.log(
            'Sports events: using local data (updated within 30 minutes)'
          );
          return {
            success: true,
            data: localDataResult.data.events,
          };
        }
      }
    }

    console.log('Sports events: fetching new data');

    const url = process.env.REACT_APP_SPORTS_URL;
    const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      console.log(url);
      console.log(accessToken);
      throw new Error('SPORTS_URL or SUPABASE_ANON_KEY is not defined');
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
      'sportsEvents',
      JSON.stringify({ events: data, lastUpdated: new Date() })
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch lunch menu:', error);
    return {
      success: false,
      errorMessage: 'Failed to fetch lunch menu',
    };
  }
};

export default getSportsEvents;
