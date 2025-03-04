export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskCategory = 
  | 'irrigation' 
  | 'fertilization' 
  | 'pest_control' 
  | 'harvesting' 
  | 'planting' 
  | 'maintenance'
  | 'inspection'
  | 'other';

export interface Task {
  id: string;
  fieldId: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  attachments?: string[]; // URLs to images or documents
  notes?: string[];
  checklist?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  weather?: {
    required: boolean;
    conditions: {
      minTemp?: number;
      maxTemp?: number;
      noRain?: boolean;
      windSpeed?: number;
    };
  };
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
  attachments?: string[];
} 