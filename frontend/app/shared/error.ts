import type { ErrorResponse } from '~/types/global';

const handleError = (e: unknown): ErrorResponse => ({
  success: false,
  errorMessage: e instanceof Error ? e.message : 'Unknown error',
});

export { handleError };
