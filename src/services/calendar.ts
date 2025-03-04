import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarEvent, CalendarFilter } from '../types/calendar';
import { isWithinInterval, parseISO } from 'date-fns';

const CALENDAR_STORAGE_KEY = 'myfield_calendar';

export const calendarService = {
  getEvents: async (fieldId: string, filter?: CalendarFilter): Promise<CalendarEvent[]> => {
    try {
      const data = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
      let events = data ? JSON.parse(data) : [];
      events = events.filter((event: CalendarEvent) => event.fieldId === fieldId);

      if (filter) {
        events = events.filter((event: CalendarEvent) => {
          if (filter.types && !filter.types.includes(event.type)) return false;
          if (filter.status && !filter.status.includes(event.status)) return false;
          if (filter.priority && !filter.priority.includes(event.priority)) return false;
          
          if (filter.startDate && filter.endDate) {
            const eventDate = parseISO(event.startDate);
            return isWithinInterval(eventDate, {
              start: filter.startDate,
              end: filter.endDate,
            });
          }
          
          return true;
        });
      }

      return events;
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return [];
    }
  },

  saveEvent: async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    try {
      const newEvent: CalendarEvent = {
        ...event,
        id: Date.now().toString(),
      };

      const data = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
      const events = data ? JSON.parse(data) : [];
      events.push(newEvent);
      await AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));

      return newEvent;
    } catch (error) {
      console.error('Error saving calendar event:', error);
      throw new Error('Failed to save calendar event');
    }
  },

  updateEvent: async (id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      const data = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
      const events = data ? JSON.parse(data) : [];
      
      const updatedEvents = events.map((event: CalendarEvent) =>
        event.id === id ? { ...event, ...updates } : event
      );
      
      await AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updatedEvents));
      return updatedEvents.find((event: CalendarEvent) => event.id === id);
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
      const events = data ? JSON.parse(data) : [];
      
      const updatedEvents = events.filter((event: CalendarEvent) => event.id !== id);
      await AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  },

  generateRecurringEvents: (event: CalendarEvent): CalendarEvent[] => {
    // Implementation for generating recurring events based on recurrence rules
    // This would create multiple event instances based on the recurrence pattern
    return [];
  },
}; 