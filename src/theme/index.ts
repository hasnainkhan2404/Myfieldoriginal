import { MD3LightTheme } from 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      warning: string;
    }
  }
}

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    warning: '#FFA726',
  },
} as const; 