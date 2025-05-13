import { Result } from '../types/global';
import { Menu } from '../types/lunch';

interface LocalLunchData {
  menu: Menu;
  lastUpdated: Date;
}

const getMenuFromLocal = (): Result<LocalLunchData> => {
  const localData = localStorage.getItem('lunchMenu');

  if (!localData) {
    return {
      success: false,
      errorMessage: 'No lunch menu data found in local storage',
    };
  }

  const parsedData: LocalLunchData = JSON.parse(localData);

  return {
    success: true,
    data: {
      menu: parsedData.menu,
      lastUpdated: new Date(parsedData.lastUpdated),
    },
  };
};

const getMenu = async (): Promise<Result<Menu>> => {
  try {
    const localDataResult = getMenuFromLocal();

    if (localDataResult.success) {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      if (localDataResult.data.lastUpdated > oneDayAgo) {
        // console.log('Lunch menu: using local data');
        return {
          success: true,
          data: localDataResult.data.menu,
        };
      }
    }

    // console.log('Lunch menu: fetching new data');

    const url = process.env.REACT_APP_LUNCH_MENU_URL;
    const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error(
        'LUNCH_MENU_URL or LUNCH_MENU_ACCESS_TOKEN is not defined'
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
      'lunchMenu',
      JSON.stringify({
        menu: data,
        lastUpdated: new Date(),
      })
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

export default getMenu;
