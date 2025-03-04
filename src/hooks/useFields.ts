import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Field, FieldMarker } from '../types/field';
import { fieldService } from '../services/field';

const FIELDS_STORAGE_KEY = 'myfield_fields';
const MARKERS_STORAGE_KEY = 'myfield_markers';

export function useFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [markers, setMarkers] = useState<FieldMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inspections, setInspections] = useState<FieldInspection[]>([]);

  // Load fields and markers from storage on mount
  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load fields
      const storedFields = await AsyncStorage.getItem(FIELDS_STORAGE_KEY);
      if (storedFields) {
        setFields(JSON.parse(storedFields));
      }

      // Load markers
      const storedMarkers = await AsyncStorage.getItem(MARKERS_STORAGE_KEY);
      if (storedMarkers) {
        setMarkers(JSON.parse(storedMarkers));
      }
    } catch (err) {
      console.error('Error loading fields:', err);
      setError('Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  const loadMarkers = async (fieldId: string) => {
    try {
      const data = await fieldService.getFieldMarkers(fieldId);
      setMarkers(data);
    } catch (err) {
      console.error('Error loading markers:', err);
    }
  };

  const loadInspections = async (fieldId: string) => {
    try {
      const data = await fieldService.getInspections(fieldId);
      setInspections(data);
    } catch (err) {
      console.error('Error loading inspections:', err);
    }
  };

  const selectField = async (field: Field) => {
    setSelectedField(field);
    await loadMarkers(field.id);
  };

  const addField = async (fieldData: Omit<Field, 'id'>) => {
    try {
      const newField: Field = {
        ...fieldData,
        id: Date.now().toString(),
      };

      const updatedFields = [...fields, newField];
      await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(updatedFields));
      setFields(updatedFields);
      return newField;
    } catch (err) {
      console.error('Error adding field:', err);
      throw new Error('Failed to add field');
    }
  };

  const updateField = async (id: string, updates: Partial<Field>) => {
    try {
      const updatedFields = fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      );
      await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(updatedFields));
      setFields(updatedFields);

      if (selectedField?.id === id) {
        setSelectedField({ ...selectedField, ...updates });
      }
    } catch (err) {
      console.error('Error updating field:', err);
      throw new Error('Failed to update field');
    }
  };

  const deleteField = async (id: string) => {
    try {
      const updatedFields = fields.filter(field => field.id !== id);
      await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(updatedFields));
      setFields(updatedFields);

      // Also delete associated markers
      const updatedMarkers = markers.filter(marker => marker.fieldId !== id);
      await AsyncStorage.setItem(MARKERS_STORAGE_KEY, JSON.stringify(updatedMarkers));
      setMarkers(updatedMarkers);

      if (selectedField?.id === id) {
        setSelectedField(null);
      }
    } catch (err) {
      console.error('Error deleting field:', err);
      throw new Error('Failed to delete field');
    }
  };

  const addMarker = async (markerData: Omit<FieldMarker, 'id'>) => {
    try {
      const newMarker: FieldMarker = {
        ...markerData,
        id: Date.now().toString(),
      };

      const updatedMarkers = [...markers, newMarker];
      await AsyncStorage.setItem(MARKERS_STORAGE_KEY, JSON.stringify(updatedMarkers));
      setMarkers(updatedMarkers);
      return newMarker;
    } catch (err) {
      console.error('Error adding marker:', err);
      throw new Error('Failed to add marker');
    }
  };

  const updateMarker = async (id: string, updates: Partial<FieldMarker>) => {
    try {
      const updatedMarkers = markers.map(marker => 
        marker.id === id ? { ...marker, ...updates } : marker
      );
      await AsyncStorage.setItem(MARKERS_STORAGE_KEY, JSON.stringify(updatedMarkers));
      setMarkers(updatedMarkers);
    } catch (err) {
      console.error('Error updating marker:', err);
      throw new Error('Failed to update marker');
    }
  };

  const deleteMarker = async (id: string) => {
    try {
      const updatedMarkers = markers.filter(marker => marker.id !== id);
      await AsyncStorage.setItem(MARKERS_STORAGE_KEY, JSON.stringify(updatedMarkers));
      setMarkers(updatedMarkers);
    } catch (err) {
      console.error('Error deleting marker:', err);
      throw new Error('Failed to delete marker');
    }
  };

  const addInspection = async (inspection: Omit<FieldInspection, 'id'>) => {
    try {
      const newInspection = await fieldService.saveInspection(inspection);
      setInspections(prev => [newInspection, ...prev]);
      return newInspection;
    } catch (err) {
      setError('Failed to add inspection');
      console.error(err);
      throw err;
    }
  };

  return {
    fields,
    selectedField,
    markers: markers.filter(m => m.fieldId === selectedField?.id),
    loading,
    error,
    inspections,
    addField,
    updateField,
    deleteField,
    addMarker,
    updateMarker,
    deleteMarker,
    selectField,
    loadFields,
    loadInspections,
    addInspection,
  };
} 