import { Stack } from 'expo-router';

export default function FieldLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          title: 'Field Details'
        }}
      />
    </Stack>
  );
} 