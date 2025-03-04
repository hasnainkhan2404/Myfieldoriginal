import { useState, useEffect } from 'react';
import { taskService } from '../services/task';
import { Task, TaskComment } from '../types/task';
import { useFields } from './useFields';

export function useTask() {
  const { selectedField } = useFields();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedField) {
      loadTasks(selectedField.id);
    }
  }, [selectedField]);

  const loadTasks = async (fieldId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks(fieldId);
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await taskService.saveTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    loadTasks,
  };
} 