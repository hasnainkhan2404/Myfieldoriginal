import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme, Menu } from 'react-native-paper';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type TaskListProps = {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
};

export function TaskList({ tasks, onTaskPress, onStatusChange, onDelete }: TaskListProps) {
  const theme = useTheme();

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'in_progress': return theme.colors.primary;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.secondary;
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const [menuVisible, setMenuVisible] = React.useState(false);

    return (
      <Card 
        style={styles.card} 
        onPress={() => onTaskPress(task)}
      >
        <Card.Title
          title={task.title}
          subtitle={format(new Date(task.dueDate), 'PPP')}
          right={(props) => (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  {...props}
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item 
                onPress={() => {
                  onStatusChange(task.id, 'completed');
                  setMenuVisible(false);
                }} 
                title="Mark Complete"
              />
              <Menu.Item 
                onPress={() => {
                  onStatusChange(task.id, 'in_progress');
                  setMenuVisible(false);
                }} 
                title="Start Task"
              />
              <Menu.Item 
                onPress={() => {
                  onDelete(task.id);
                  setMenuVisible(false);
                }} 
                title="Delete"
              />
            </Menu>
          )}
        />
        <Card.Content>
          <Text numberOfLines={2} style={styles.description}>
            {task.description}
          </Text>
          <View style={styles.chipContainer}>
            <Chip 
              style={[styles.chip, { backgroundColor: getPriorityColor(task.priority) }]}
              textStyle={{ color: 'white' }}
            >
              {task.priority}
            </Chip>
            <Chip 
              style={[styles.chip, { backgroundColor: getStatusColor(task.status) }]}
              textStyle={{ color: 'white' }}
            >
              {task.status.replace('_', ' ')}
            </Chip>
            <Chip icon="tag">
              {task.category.replace('_', ' ')}
            </Chip>
          </View>
          {task.checklist && task.checklist.length > 0 && (
            <View style={styles.checklistContainer}>
              <Text style={styles.checklistTitle}>
                Progress: {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  description: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
  },
  checklistContainer: {
    marginTop: 8,
  },
  checklistTitle: {
    fontSize: 12,
    color: '#666',
  },
}); 