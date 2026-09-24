import { Environment } from './environment.model';

// TODO(open decision): staging host is not chosen yet (11-open-decisions.md, Backend).
export const environment: Environment = {
  name: 'staging',
  apiBaseUrl: 'https://staging-api.invalid',
};
