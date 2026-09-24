import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // TODO(open decision): final application ID depends on the publishing organisation
  // (05-mobile-app-spec.md §8). Changing it later requires a new Play Store listing.
  appId: 'com.example.housingmap',
  appName: 'Housing Map',
  webDir: 'dist/mobile/browser',
};

export default config;
