import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { TaskForm } from '../../../../src/components/TaskForm';
import { useTask } from '../../../../src/hooks/useTask';

export default function NewTask() {
  const { id } = useLocalSearchParams();
  const { addTask } = useTask();

  const handleSubmit = async (data: any) => {
    try {
      await addTask(data);
      router.back();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TaskForm fieldId={id as string} onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
}); 