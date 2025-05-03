interface SuccessResponse<T> {
    success: true;
    data: T;
}

interface ErrorResponse {
    success: false;
    errorMessage: string;
}

export type Result<T> = SuccessResponse<T> | ErrorResponse;
