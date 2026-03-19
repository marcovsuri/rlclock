import { menuSchema, type Menu } from '~/types/lunch';
import TimedCacheFetcher from './TimedCacheFetcher';
import type { Result } from '~/types/global';
import { handleError } from '~/shared/error';

class MenuFetcher extends TimedCacheFetcher<Menu> {
  protected readonly storageKey = 'menu';
  protected readonly ttl = 20 * 1000; // 5 minutes // Todo: change

  protected readonly fetchUrl: string;
  protected readonly fetchOptions?: RequestInit | undefined;

  constructor() {
    super();

    const url = import.meta.env.VITE_MENU_URL;
    const accessToken = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error('VITE_MENU_URL or VITE_SUPABASE_ANON_KEY is not defined');
    }

    this.fetchUrl = url;

    this.fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  protected parseResponse(data: unknown): Result<Menu> {
    try {
      const menu = menuSchema.parse(data);

      return { success: true, data: menu };
    } catch (error) {
      return handleError(error);
    }
  }
}

export default MenuFetcher;
