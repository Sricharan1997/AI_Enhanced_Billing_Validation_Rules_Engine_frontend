/**
 * API Error Handler
 * Handles and formats API errors
 */

export class ApiError extends Error {
  public statusCode?: number;
  public originalError?: unknown;

  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Response) {
    const statusCode = error.status;
    const message = getErrorMessage(statusCode);
    return new ApiError(message, statusCode, error);
  }

  if (error instanceof Error) {
    // Check if it's a network error
    if (error.message.includes('fetch')) {
      return new ApiError('Network error - please check your connection', undefined, error);
    }
    return new ApiError(error.message, undefined, error);
  }

  if (typeof error === 'string') {
    return new ApiError(error);
  }

  return new ApiError('An unexpected error occurred', undefined, error);
}

function getErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Invalid request - please check your input';
    case 401:
      return 'Unauthorized - please log in';
    case 403:
      return 'Forbidden - you do not have permission to access this resource';
    case 404:
      return 'Resource not found';
    case 409:
      return 'Conflict - the resource already exists';
    case 422:
      return 'Invalid data - please check your input';
    case 429:
      return 'Too many requests - please try again later';
    case 500:
      return 'Server error - please try again later';
    case 502:
      return 'Bad gateway - please try again later';
    case 503:
      return 'Service unavailable - please try again later';
    default:
      if (statusCode >= 500) {
        return 'Server error - please try again later';
      }
      if (statusCode >= 400) {
        return 'Request error - please try again';
      }
      return 'An error occurred - please try again';
  }
}

/**
 * Formats error for user display
 */
export function formatErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  return apiError.message;
}
