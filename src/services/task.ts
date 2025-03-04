import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskComment } from '../types/task';

const TASKS_STORAGE_KEY = 'myfield_tasks';
const COMMENTS_STORAGE_KEY = 'myfield_task_comments';

export const taskService = {
  getTasks: async (fieldId: string): Promise<Task[]> => {
    try {
      const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const tasks = data ? JSON.parse(data) : [];
      return tasks.filter((task: Task) => task.fieldId === fieldId);
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  saveTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    try {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const tasks = data ? JSON.parse(data) : [];
      tasks.unshift(newTask);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

      return newTask;
    } catch (error) {
      console.error('Error saving task:', error);
      throw new Error('Failed to save task');
    }
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const tasks = data ? JSON.parse(data) : [];
      
      const updatedTasks = tasks.map((task: Task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
      return updatedTasks.find((task: Task) => task.id === id);
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const tasks = data ? JSON.parse(data) : [];
      
      const updatedTasks = tasks.filter((task: Task) => task.id !== id);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },

  getComments: async (taskId: string): Promise<TaskComment[]> => {
    try {
      const data = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
      const comments = data ? JSON.parse(data) : [];
      return comments.filter((comment: TaskComment) => comment.taskId === taskId);
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  },

  addComment: async (comment: Omit<TaskComment, 'id' | 'createdAt'>): Promise<TaskComment> => {
    try {
      const newComment: TaskComment = {
        ...comment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const data = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
      const comments = data ? JSON.parse(data) : [];
      comments.push(newComment);
      await AsyncStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));

      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  },
}; 