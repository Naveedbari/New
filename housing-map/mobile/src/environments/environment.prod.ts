import { Environment } from './environment.model';

// TODO(open decision): production host is not chosen yet (11-open-decisions.md, Backend).
// The ".invalid" TLD guarantees a production build never talks to a real server by accident.
export const environment: Environment = {
  name: 'production',
  apiBaseUrl: 'https://api.invalid',
};
