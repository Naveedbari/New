import { HttpErrorResponse } from '@angular/common/http';

import { toApiError } from './api-error';

describe('toApiError', () => {
  it('reports offline when the device has no connection', () => {
    expect(toApiError(new HttpErrorResponse({ status: 0 }), false).kind).toBe('offline');
  });

  it('treats status 0 (connection refused/CORS) as server unavailable', () => {
    expect(toApiError(new HttpErrorResponse({ status: 0 }), true).kind).toBe('server-unavailable');
  });

  it('treats 5xx as server unavailable', () => {
    expect(toApiError(new HttpErrorResponse({ status: 503 }), true).kind).toBe(
      'server-unavailable',
    );
  });

  it('maps 404 to not-found', () => {
    expect(toApiError(new HttpErrorResponse({ status: 404 }), true).kind).toBe('not-found');
  });

  it('never exposes server error details to the user', () => {
    const error = new HttpErrorResponse({
      status: 500,
      error: 'System.NullReferenceException at HousingMap.Api…',
    });

    const result = toApiError(error, true);

    expect(result.message).not.toContain('Exception');
  });

  it('maps non-HTTP errors to unexpected', () => {
    expect(toApiError(new Error('boom'), true).kind).toBe('unexpected');
  });
});
