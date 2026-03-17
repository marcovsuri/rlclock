import { matchesSchema, type Match } from '~/types/sports';
import TimedCacheFetcher from './TimedCacheFetcher';
import type { Result } from '~/types/global';
import { handleError } from '~/shared/error';

class SportsFetcher extends TimedCacheFetcher<Match[]> {
  protected readonly storageKey = 'sports';
  protected readonly ttl = 20 * 1000; // 5 minutes // TODO: change

  protected readonly fetchUrl: string;
  protected readonly fetchOptions?: RequestInit;

  constructor() {
    super();

    const url = import.meta.env.VITE_SPORTS_URL;
    const accessToken = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error(
        'VITE_SPORTS_URL or VITE_SUPABASE_ANON_KEY is not defined',
      );
    }

    this.fetchUrl = url;

    this.fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  protected parseResponse(data: unknown): Result<Match[]> {
    try {
      const result = matchesSchema.safeParse(data);

      if (!result.success) throw result.error;

      return { success: true, data: result.data };
    } catch (error) {
      return handleError(error);
    }
  }
}

export default SportsFetcher;
