import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, SegmentedButtons, Chip, Switch, useTheme, Text, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarEvent, EventType } from '../types/calendar';
import { format } from 'date-fns';

type EventFormProps = {
  fieldId: string;
  onSubmit: (data: Omit<CalendarEvent, 'id'>) => Promise<void>;
  initialValues?: Partial<CalendarEvent>;
};

export function EventForm({ fieldId, onSubmit, initialValues }: EventFormProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [type, setType] = useState<EventType>(initialValues?.type || 'custom');
  const [startDate, setStartDate] = useState(
    initialValues?.startDate ? new Date(initialValues.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    initialValues?.endDate ? new Date(initialValues.endDate) : new Date()
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [allDay, setAllDay] = useState(initialValues?.allDay || false);
  const [priority, setPriority] = useState(initialValues?.priority || 'medium');
  const [notifications, setNotifications] = useState(initialValues?.notifications?.enabled || false);
  const [notificationTime, setNotificationTime] = useState(
    initialValues?.notifications?.before?.toString() || '30'
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit({
        fieldId,
        title,
        description,
        type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        allDay,
        status: 'scheduled',
        priority,
        notifications: notifications ? {
          enabled: true,
          before: parseInt(notificationTime),
        } : undefined,
      });
    } catch (error) {
      console.error('Error submitting event:', error);
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

      <View style={styles.row}>
        <Text>All Day</Text>
        <Switch value={allDay} onValueChange={setAllDay} />
      </View>

      <Button
        mode="outlined"
        onPress={() => setShowStartPicker(true)}
        style={styles.input}
      >
        Start: {format(startDate, allDay ? 'PP' : 'PPp')}
      </Button>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode={allDay ? 'date' : 'datetime'}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      <Button
        mode="outlined"
        onPress={() => setShowEndPicker(true)}
        style={styles.input}
      >
        End: {format(endDate, allDay ? 'PP' : 'PPp')}
      </Button>

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode={allDay ? 'date' : 'datetime'}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}

      <View style={styles.section}>
        <Text variant="titleMedium">Event Type</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}
        >
          {[
            'task',
            'inspection',
            'weather_alert',
            'harvest',
            'planting',
            'fertilization',
            'irrigation',
            'custom',
          ].map((t) => (
            <Chip
              key={t}
              selected={type === t}
              onPress={() => setType(t as EventType)}
              style={styles.chip}
            >
              {t.replace('_', ' ')}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium">Priority</Text>
        <SegmentedButtons
          value={priority}
          onValueChange={value => setPriority(value as 'low' | 'medium' | 'high')}
          buttons={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text>Enable Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        {notifications && (
          <TextInput
            label="Minutes before event"
            value={notificationTime}
            onChangeText={setNotificationTime}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
        )}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !title}
        style={styles.submitButton}
      >
        Save Event
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
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  chip: {
    marginRight: 8,
  },
  submitButton: {
    marginBottom: 32,
  },
}); 