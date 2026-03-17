import { scheduleSchema, type Schedule } from '~/types/clock';
import TimedCacheFetcher from './TimedCacheFetcher';
import type { Result } from '~/types/global';

class ScheduleFetcher extends TimedCacheFetcher<Schedule> {
  protected readonly storageKey = 'schedule';
  protected readonly ttl = 10 * 1000; // 5 minutes // TODO: change

  protected readonly fetchUrl: string;
  protected readonly fetchOptions?: RequestInit;

  constructor() {
    super();

    const url = import.meta.env.VITE_SCHEDULE_URL;
    const accessToken = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error(
        'VITE_SCHEDULE_URL or VITE_SUPABASE_ANON_KEY is not defined',
      );
    }

    this.fetchUrl = url;

    this.fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  protected parseResponse(data: unknown): Result<Schedule> {
    try {
      const result = scheduleSchema.safeParse(data);

      if (!result.success) throw result.error;

      return { success: true, data: result.data };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, errorMessage: error.message };
      }

      return { success: false, errorMessage: 'Unknown error' };
    }
  }
}

const scheduleFetcher = new ScheduleFetcher();

export default scheduleFetcher;
