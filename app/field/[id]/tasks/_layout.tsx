import { Stack } from 'expo-router';

export default function TasksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Tasks',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Task',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[taskId]"
        options={{
          title: 'Task Details',
        }}
      />
    </Stack>
  );
} 