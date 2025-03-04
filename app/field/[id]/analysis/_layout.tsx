import { Stack } from 'expo-router';

export default function AnalysisLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Analysis',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Analysis',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
} 