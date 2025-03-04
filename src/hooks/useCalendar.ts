import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendar';
import { CalendarEvent, CalendarFilter } from '../types/calendar';
import { useFields } from './useFields';
import { startOfMonth, endOfMonth } from 'date-fns';

export function useCalendar() {
  const { selectedField } = useFields();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<CalendarFilter>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  useEffect(() => {
    if (selectedField) {
      loadEvents(selectedField.id);
    }
  }, [selectedField, currentFilter]);

  const loadEvents = async (fieldId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getEvents(fieldId, currentFilter);
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = await calendarService.saveEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      console.error('Error adding event:', err);
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = await calendarService.updateEvent(id, updates);
      setEvents(prev => prev.map(event => 
        event.id === id ? updatedEvent : event
      ));
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await calendarService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  const filterEvents = (filter: CalendarFilter) => {
    setCurrentFilter(filter);
  };

  return {
    events,
    loading,
    error,
    currentFilter,
    addEvent,
    updateEvent,
    deleteEvent,
    filterEvents,
    loadEvents,
  };
} 