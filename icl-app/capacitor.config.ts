import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.icl.indoorchampionleague',
  appName: 'ICL',
  webDir: 'dist/icl-app/browser',
  plugins: {
    // Draw edge-to-edge behind the status and navigation bars; the app pads itself by the
    // real bar heights (see --ion-safe-area-* in theme/variables.scss).
    SystemBars: {
      initialViewportFitValueHint: 'cover',
      style: 'DARK',
    },
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      androidIsEncryption: false,
    },
  },
};

export default config;
