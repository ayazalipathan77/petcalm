import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.petcalm.app',
  appName: 'PetCalm',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#FAFCFB',
      androidSplashResourceName: 'splash',
      showSpinnerAnimation: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    LocalNotifications: {
      smallIcon: 'ic_launcher',
      iconColor: '#5B8A72',
      sound: 'beep.wav',
    },
  },
};

export default config;
