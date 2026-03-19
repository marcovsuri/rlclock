import { upcomingMatchesSchema, type UpcomingMatch } from '~/types/sports';
import TimedCacheFetcher from './TimedCacheFetcher';
import type { Result } from '~/types/global';
import { handleError } from '~/shared/error';

class UpcomingMatchesFetcher extends TimedCacheFetcher<UpcomingMatch[]> {
  protected readonly storageKey = 'upcomingMatches';
  protected readonly ttl = 20 * 1000; // 5 minutes // TODO: change

  protected readonly fetchUrl: string;
  protected readonly fetchOptions?: RequestInit;

  constructor() {
    super();

    const url = import.meta.env.VITE_UPCOMING_MATCHES_URL;
    const accessToken = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error(
        'VITE_UPCOMING_MATCHES_URL or VITE_SUPABASE_ANON_KEY is not defined',
      );
    }

    this.fetchUrl = url;

    this.fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  protected parseResponse(data: unknown): Result<UpcomingMatch[]> {
    try {
      const result = upcomingMatchesSchema.parse(data);

      return { success: true, data: result };
    } catch (error) {
      return handleError(error);
    }
  }
}

export default UpcomingMatchesFetcher;
