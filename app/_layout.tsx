import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from '../src/providers/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Define your custom theme
const theme = {
  ...MD3LightTheme,
  // Add any custom colors, fonts, etc.
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32', // Forest green
    secondary: '#558B2F',
    background: '#FFFFFF',
    warning: '#FFA000',
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              contentStyle: {
                backgroundColor: '#fff',
              },
              headerSafeAreaInsets: { top: 0 },
            }}
          >
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="field/[id]"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 