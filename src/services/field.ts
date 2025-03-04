import AsyncStorage from '@react-native-async-storage/async-storage';
import { Field, FieldMarker } from '../types/field';

export interface FieldInspection {
  id: string;
  fieldId: string;
  date: string;
  notes: string;
  observations: {
    type: 'growth' | 'pest' | 'disease' | 'other';
    severity: 'low' | 'medium' | 'high';
    description: string;
    imageUri?: string;
  }[];
}

export const fieldService = {
  getFields: async (): Promise<Field[]> => {
    try {
      const data = await AsyncStorage.getItem('fields');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting fields:', error);
      return [];
    }
  },

  saveField: async (field: Omit<Field, 'id'>): Promise<Field> => {
    try {
      const newField: Field = {
        ...field,
        id: Date.now().toString(),
      };

      const fields = await fieldService.getFields();
      fields.unshift(newField);
      await AsyncStorage.setItem('fields', JSON.stringify(fields));
      
      return newField;
    } catch (error) {
      console.error('Error saving field:', error);
      throw new Error('Failed to save field');
    }
  },

  getFieldMarkers: async (fieldId: string): Promise<FieldMarker[]> => {
    try {
      const data = await AsyncStorage.getItem(`field_markers_${fieldId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting field markers:', error);
      return [];
    }
  },

  saveFieldMarker: async (marker: Omit<FieldMarker, 'id'>): Promise<FieldMarker> => {
    try {
      const newMarker: FieldMarker = {
        ...marker,
        id: Date.now().toString(),
      };

      const markers = await fieldService.getFieldMarkers(marker.fieldId);
      markers.unshift(newMarker);
      await AsyncStorage.setItem(`field_markers_${marker.fieldId}`, JSON.stringify(markers));
      
      return newMarker;
    } catch (error) {
      console.error('Error saving field marker:', error);
      throw new Error('Failed to save field marker');
    }
  },

  saveInspection: async (inspection: Omit<FieldInspection, 'id'>): Promise<FieldInspection> => {
    try {
      const newInspection: FieldInspection = {
        ...inspection,
        id: Date.now().toString(),
      };

      const key = `field_inspections_${inspection.fieldId}`;
      const existingData = await AsyncStorage.getItem(key);
      const inspections = existingData ? JSON.parse(existingData) : [];
      inspections.unshift(newInspection);
      await AsyncStorage.setItem(key, JSON.stringify(inspections));

      // Update last inspection date
      const fields = await fieldService.getFields();
      const fieldIndex = fields.findIndex(f => f.id === inspection.fieldId);
      if (fieldIndex !== -1) {
        fields[fieldIndex].lastInspection = new Date().toISOString();
        await AsyncStorage.setItem('fields', JSON.stringify(fields));
      }

      return newInspection;
    } catch (error) {
      console.error('Error saving inspection:', error);
      throw new Error('Failed to save inspection');
    }
  },

  getInspections: async (fieldId: string): Promise<FieldInspection[]> => {
    try {
      const data = await AsyncStorage.getItem(`field_inspections_${fieldId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting inspections:', error);
      return [];
    }
  },
}; 