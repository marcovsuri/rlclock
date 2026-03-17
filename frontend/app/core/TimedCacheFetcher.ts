import type { Result } from '~/types/global';

interface CachedEntry<T> {
  data: T;
  /** ISO 8601 string — survives JSON round-trips without needing `new Date()` on the way out */
  lastUpdated: string;
}

abstract class TimedCacheFetcher<T> {
  /** The localStorage key used to store and retrieve cached data */
  protected abstract readonly storageKey: string;

  /** How long cached data is considered fresh, in milliseconds */
  protected abstract readonly ttl: number;

  /** The URL to fetch data from when the cache is missing or stale */
  protected abstract readonly fetchUrl: string;

  /** Options with which to fetch data when cache is missing or stale */
  protected abstract readonly fetchOptions?: RequestInit;

  /**
   * Implement to apply Zod validation or reshape the raw API response.
   */
  protected abstract parseResponse(data: unknown): Result<T>;

  /**
   * Attempts to read and validate a cached entry from localStorage.
   * Returns a failure if the entry is missing, unreadable, or older than `ttl`.
   */
  private getFromStorage(): Result<T> {
    try {
      const raw = localStorage.getItem(this.storageKey);

      if (!raw) throw new Error('No data in storage');

      const cached: CachedEntry<T> = JSON.parse(raw);

      // Check age
      const age = Date.now() - new Date(cached.lastUpdated).getTime();
      if (age > this.ttl) throw new Error('Cached data has expired');

      // Check data format
      const result = this.parseResponse(cached.data);
      if (!result.success) throw new Error('Cached data not of correct format');

      return { success: true, data: result.data };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, errorMessage: error.message };
      }

      return { success: false, errorMessage: 'Unknown error' };
    }
  }

  /**
   * Persists data to localStorage under `storageKey` with the current timestamp.
   * Returns a failure result if serialization or storage write fails.
   */
  private saveToStorage(data: T): Result<null> {
    try {
      const entry: CachedEntry<T> = {
        data,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(entry));

      return { success: true, data: null };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, errorMessage: error.message };
      }

      return { success: false, errorMessage: 'Unknown error' };
    }
  }

  /**
   * Returns the data for this fetcher, using a valid cache hit when available.
   * Falls through to a live fetch when the cache is missing, stale, or unreadable.
   * All failure modes are captured in the returned `Result` — this method never throws.
   */
  async get(): Promise<Result<T>> {
    try {
      const cached = this.getFromStorage();

      if (cached.success) {
        console.log(`${this.storageKey}: using cached data`);
        return cached;
      }

      console.log(
        `${this.storageKey}: fetching new data (${cached.errorMessage})`,
      );

      const response = await fetch(this.fetchUrl, this.fetchOptions);

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const raw = await response.json();
      const parsed = this.parseResponse(raw);

      if (!parsed.success) throw new Error(parsed.errorMessage);

      const saveResult = this.saveToStorage(parsed.data);

      if (!saveResult.success) {
        // Non-fatal: log the issue but still return the freshly fetched data
        console.warn(
          `Could not save data - ${this.storageKey}: ${saveResult.errorMessage}`,
        );
      }

      return { success: true, data: parsed.data };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, errorMessage: error.message };
      }

      return { success: false, errorMessage: 'Unknown error' };
    }
  }
}

export default TimedCacheFetcher;
