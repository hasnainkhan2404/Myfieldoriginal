import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ActivityIndicator, FAB } from 'react-native-paper';
import { TaskList } from '../../../../src/components/TaskList';
import { useTask } from '../../../../src/hooks/useTask';
import { TaskStatus } from '../../../../src/types/task';

export default function FieldTasks() {
  const { id } = useLocalSearchParams();
  const { tasks, loading, error, updateTask, deleteTask } = useTask();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleTaskPress = (task: Task) => {
    router.push(`/field/${id}/tasks/${task.id}`);
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTask(taskId, { 
        status,
        ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TaskList
        tasks={tasks}
        onTaskPress={handleTaskPress}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
      <FAB
        icon="plus"
        label="New Task"
        style={styles.fab}
        onPress={() => router.push(`/field/${id}/tasks/new`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 