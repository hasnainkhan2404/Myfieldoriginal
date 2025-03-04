import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  Text, 
  Card, 
  Checkbox, 
  Button, 
  List, 
  Divider,
  useTheme,
} from 'react-native-paper';
import { useTask } from '../../../../src/hooks/useTask';
import { format } from 'date-fns';

export default function TaskDetail() {
  const { id, taskId } = useLocalSearchParams();
  const { tasks, updateTask } = useTask();
  const theme = useTheme();

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text>Task not found</Text>
      </View>
    );
  }

  const handleChecklistItemToggle = async (itemId: string) => {
    if (!task.checklist) return;

    const updatedChecklist = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    try {
      await updateTask(task.id, { checklist: updatedChecklist });
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={task.title} />
        <Card.Content>
          <Text style={styles.description}>{task.description}</Text>
          <Text style={styles.date}>
            Due: {format(new Date(task.dueDate), 'PPP')}
          </Text>
          {task.completedAt && (
            <Text style={styles.date}>
              Completed: {format(new Date(task.completedAt), 'PPP')}
            </Text>
          )}
        </Card.Content>
      </Card>

      {task.checklist && task.checklist.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Checklist" />
          <Card.Content>
            {task.checklist.map(item => (
              <Checkbox.Item
                key={item.id}
                label={item.text}
                status={item.completed ? 'checked' : 'unchecked'}
                onPress={() => handleChecklistItemToggle(item.id)}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {task.weather?.required && (
        <Card style={styles.card}>
          <Card.Title title="Weather Requirements" />
          <Card.Content>
            {task.weather.conditions.minTemp && (
              <Text>Min Temperature: {task.weather.conditions.minTemp}°C</Text>
            )}
            {task.weather.conditions.maxTemp && (
              <Text>Max Temperature: {task.weather.conditions.maxTemp}°C</Text>
            )}
            {task.weather.conditions.windSpeed && (
              <Text>Max Wind Speed: {task.weather.conditions.windSpeed} km/h</Text>
            )}
            {task.weather.conditions.noRain && (
              <Text>No Rain Required</Text>
            )}
          </Card.Content>
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => router.push(`/field/${id}/tasks/${taskId}/edit`)}
          style={styles.button}
        >
          Edit Task
        </Button>
        <Button 
          mode="outlined"
          onPress={() => router.back()}
          style={styles.button}
        >
          Back to List
        </Button>
      </View>
    </ScrollView>
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
  card: {
    margin: 16,
  },
  description: {
    marginBottom: 8,
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    padding: 16,
    gap: 8,
  },
  button: {
    marginBottom: 8,
  },
}); 