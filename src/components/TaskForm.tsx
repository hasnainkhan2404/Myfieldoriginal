import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, SegmentedButtons, Chip, useTheme, List } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, TaskPriority, TaskCategory } from '../types/task';

type TaskFormProps = {
  fieldId: string;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialValues?: Partial<Task>;
};

export function TaskForm({ fieldId, onSubmit, initialValues }: TaskFormProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialValues?.category || 'other');
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ? new Date(initialValues.dueDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [weatherRequired, setWeatherRequired] = useState(false);
  const [weatherConditions, setWeatherConditions] = useState({
    minTemp: '',
    maxTemp: '',
    noRain: false,
    windSpeed: '',
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit({
        fieldId,
        title,
        description,
        category,
        priority,
        status: 'pending',
        dueDate: dueDate.toISOString(),
        checklist: checklist.map(text => ({
          id: Date.now().toString(),
          text,
          completed: false,
        })),
        weather: weatherRequired ? {
          required: true,
          conditions: {
            minTemp: weatherConditions.minTemp ? parseFloat(weatherConditions.minTemp) : undefined,
            maxTemp: weatherConditions.maxTemp ? parseFloat(weatherConditions.maxTemp) : undefined,
            noRain: weatherConditions.noRain,
            windSpeed: weatherConditions.windSpeed ? parseFloat(weatherConditions.windSpeed) : undefined,
          },
        } : undefined,
      });
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <List.Section>
        <List.Subheader>Category</List.Subheader>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}
        >
          {[
            'irrigation',
            'fertilization',
            'pest_control',
            'harvesting',
            'planting',
            'maintenance',
            'inspection',
            'other',
          ].map((cat) => (
            <Chip
              key={cat}
              selected={category === cat}
              onPress={() => setCategory(cat as TaskCategory)}
              style={styles.chip}
            >
              {cat.replace('_', ' ')}
            </Chip>
          ))}
        </ScrollView>
      </List.Section>

      <List.Section>
        <List.Subheader>Priority</List.Subheader>
        <SegmentedButtons
          value={priority}
          onValueChange={value => setPriority(value as TaskPriority)}
          buttons={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          style={styles.segmentedButtons}
        />
      </List.Section>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.button}
      >
        Due Date: {format(dueDate, 'PP')}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}

      <List.Section>
        <List.Subheader>Checklist</List.Subheader>
        <TextInput
          label="New Item"
          value={newChecklistItem}
          onChangeText={setNewChecklistItem}
          right={
            <TextInput.Icon
              icon="plus"
              onPress={() => {
                if (newChecklistItem.trim()) {
                  setChecklist([...checklist, newChecklistItem.trim()]);
                  setNewChecklistItem('');
                }
              }}
            />
          }
          mode="outlined"
          style={styles.input}
        />
        {checklist.map((item, index) => (
          <List.Item
            key={index}
            title={item}
            right={props => (
              <IconButton
                {...props}
                icon="delete"
                onPress={() => {
                  setChecklist(checklist.filter((_, i) => i !== index));
                }}
              />
            )}
          />
        ))}
      </List.Section>

      <List.Section>
        <List.Subheader>Weather Requirements</List.Subheader>
        <List.Item
          title="Weather Dependent"
          right={props => (
            <Switch
              {...props}
              value={weatherRequired}
              onValueChange={setWeatherRequired}
            />
          )}
        />
        {weatherRequired && (
          <View style={styles.weatherInputs}>
            <TextInput
              label="Min Temperature (°C)"
              value={weatherConditions.minTemp}
              onChangeText={value => setWeatherConditions(prev => ({ ...prev, minTemp: value }))}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Max Temperature (°C)"
              value={weatherConditions.maxTemp}
              onChangeText={value => setWeatherConditions(prev => ({ ...prev, maxTemp: value }))}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Max Wind Speed (km/h)"
              value={weatherConditions.windSpeed}
              onChangeText={value => setWeatherConditions(prev => ({ ...prev, windSpeed: value }))}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <List.Item
              title="No Rain Required"
              right={props => (
                <Switch
                  {...props}
                  value={weatherConditions.noRain}
                  onValueChange={value => setWeatherConditions(prev => ({ ...prev, noRain: value }))}
                />
              )}
            />
          </View>
        )}
      </List.Section>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !title || !description}
        style={styles.submitButton}
      >
        Save Task
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  weatherInputs: {
    padding: 16,
  },
  submitButton: {
    marginBottom: 32,
  },
}); 