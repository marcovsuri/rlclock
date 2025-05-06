import { Result } from '../types/global';
import { TeamEvent } from '../types/sports';

const getSportsEvents = async (): Promise<Result<TeamEvent[]>> => {
  try {
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
