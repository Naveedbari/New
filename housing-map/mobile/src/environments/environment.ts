import { Environment } from './environment.model';

// Development: API from `dotnet run` (see api/README.md). On an Android emulator use 10.0.2.2.
export const environment: Environment = {
  name: 'development',
  apiBaseUrl: 'http://localhost:5095',
};
