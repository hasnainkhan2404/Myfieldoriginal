import { Stack } from 'expo-router';

export default function WeatherLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="alerts" options={{ headerShown: false }} />
      <Stack.Screen name="forecast" options={{ headerShown: false }} />
    </Stack>
  );
} 