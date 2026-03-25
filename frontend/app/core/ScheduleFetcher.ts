import { scheduleSchema, type Schedule } from '~/types/clock';
import TimedCacheFetcher from './TimedCacheFetcher';
import type { Result } from '~/types/global';
import { handleError } from '~/shared/error';
import { TTL } from './testing';

class ScheduleFetcher extends TimedCacheFetcher<Schedule> {
  protected readonly storageKey = 'schedule';
  protected readonly ttl = TTL;

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
      const schedule = scheduleSchema.parse(data);

      return { success: true, data: schedule };
    } catch (error) {
      return handleError(error);
    }
  }
}

export default ScheduleFetcher;
