export type EventType = 
  | 'task'
  | 'inspection'
  | 'weather_alert'
  | 'harvest'
  | 'planting'
  | 'fertilization'
  | 'irrigation'
  | 'custom';

export interface CalendarEvent {
  id: string;
  fieldId: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  relatedTaskId?: string;
  relatedInspectionId?: string;
  color?: string;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
  };
  notifications?: {
    enabled: boolean;
    before: number; // minutes
  };
}

export interface CalendarFilter {
  types?: EventType[];
  status?: string[];
  priority?: string[];
  startDate?: Date;
  endDate?: Date;
} 