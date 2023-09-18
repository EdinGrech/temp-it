import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'temp-it',
  webDir: 'www',
  server: {
    //androidScheme: 'https',
    cleartext: true
  }
};

export default config;
