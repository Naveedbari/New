export interface Environment {
  /** Shown in Settings so testers know which backend they are using. */
  readonly name: 'development' | 'staging' | 'production';
  /** Base URL of the Housing Map API, without a trailing slash. */
  readonly apiBaseUrl: string;
}
