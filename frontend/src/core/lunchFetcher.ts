import { Result } from '../types/global';
import { Menu } from '../types/lunch';

const getMenu = async (): Promise<Result<Menu>> => {
  try {
    const url = process.env.REACT_APP_LUNCH_MENU_URL;
    const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      console.log(url);
      console.log(accessToken);
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
