import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ActivityIndicator, FAB, Portal, Modal, Button, Chip, Text, ScrollView } from 'react-native-paper';
import { Calendar } from '../../../../src/components/Calendar';
import { useCalendar } from '../../../../src/hooks/useCalendar';
import { CalendarFilter, EventType } from '../../../../src/types/calendar';
import { startOfMonth, endOfMonth } from 'date-fns';

export default function FieldCalendar() {
  const { id } = useLocalSearchParams();
  const { events, loading, filterEvents } = useCalendar();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // ... rest of the calendar component code ...
} 