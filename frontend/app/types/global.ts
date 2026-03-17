interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  errorMessage: string;
}

type Result<T> = SuccessResponse<T> | ErrorResponse;

export type { ErrorResponse, Result };
