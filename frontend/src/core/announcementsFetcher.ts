import { Result } from '../types/global';
import { Announcement } from '../types/announcements';

interface LocalAnnouncementsData {
  announcements: Announcement[];
  lastUpdated: Date;
}

const getAnnouncementsFromLocal = (): Result<LocalAnnouncementsData> => {
  const localData = localStorage.getItem('announcements');

  if (!localData) {
    return {
      success: false,
      errorMessage: 'No announcements data found in local storage',
    };
  }

  const parsedData: LocalAnnouncementsData = JSON.parse(localData);

  return {
    success: true,
    data: { ...parsedData, lastUpdated: new Date(parsedData.lastUpdated) },
  };
};

const getAnnouncements = async (): Promise<Result<Announcement[]>> => {
  try {
    const localDataResult = getAnnouncementsFromLocal();

    if (localDataResult.success) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (localDataResult.success) {
        const ONE_MINUTE = 1 * 60 * 1000; // 1 minute in milliseconds
        const now = new Date();
        const lastUpdated = new Date(localDataResult.data.lastUpdated); // ensure it's a Date

        if (now.getTime() - lastUpdated.getTime() < ONE_MINUTE) {
          console.log('Announcements: using local data (updated every minute)');
          return {
            success: true,
            data: localDataResult.data.announcements,
          };
        }
      }
    }

    console.log('Announcements: fetching new data');

    const url = process.env.REACT_APP_ANNOUNCEMENTS_URL;
    const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error('ANNOUNCEMENTS_URL or SUPABASE_ANON_KEY is not defined');
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
      'announcements',
      JSON.stringify({ announcements: data, lastUpdated: new Date() })
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

export default getAnnouncements;
