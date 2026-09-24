import { HttpErrorResponse } from '@angular/common/http';

export type ApiErrorKind = 'offline' | 'server-unavailable' | 'not-found' | 'unexpected';

export interface ApiError {
  readonly kind: ApiErrorKind;
  /** Safe to show to users. Never contains server details or stack traces. */
  readonly message: string;
}

const MESSAGES: Record<ApiErrorKind, string> = {
  offline: 'No internet connection. Check your connection and try again.',
  'server-unavailable': 'The map service is not available right now. Please try again later.',
  'not-found': 'The requested information could not be found.',
  unexpected: 'Something went wrong. Please try again.',
};

const HTTP_NOT_FOUND = 404;
const HTTP_SERVER_ERROR_MIN = 500;

/** Converts any error from an API call into a user-friendly {@link ApiError}. */
export function toApiError(error: unknown, isOnline: boolean): ApiError {
  const kind = classify(error, isOnline);
  return { kind, message: MESSAGES[kind] };
}

function classify(error: unknown, isOnline: boolean): ApiErrorKind {
  if (!isOnline) {
    return 'offline';
  }
  if (!(error instanceof HttpErrorResponse)) {
    return 'unexpected';
  }
  // Status 0: request never reached the server (DNS, CORS, connection refused).
  if (error.status === 0 || error.status >= HTTP_SERVER_ERROR_MIN) {
    return 'server-unavailable';
  }
  if (error.status === HTTP_NOT_FOUND) {
    return 'not-found';
  }
  return 'unexpected';
}
