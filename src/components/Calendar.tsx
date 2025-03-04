import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Calendar as RNCalendar, MarkedDates } from 'react-native-calendars';
import { Text, Card, useTheme } from 'react-native-paper';
import { CalendarEvent } from '../types/calendar';
import { format } from 'date-fns';

type CalendarProps = {
  events: CalendarEvent[];
  onDayPress: (date: string) => void;
  onEventPress: (event: CalendarEvent) => void;
};

export function Calendar({ events, onDayPress, onEventPress }: CalendarProps) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const markedDates: MarkedDates = events.reduce((acc, event) => {
    const date = format(new Date(event.startDate), 'yyyy-MM-dd');
    acc[date] = {
      marked: true,
      dotColor: event.color || theme.colors.primary,
      selected: date === selectedDate,
      selectedColor: theme.colors.primaryContainer,
    };
    return acc;
  }, {} as MarkedDates);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    onDayPress(day.dateString);
  };

  const getDayEvents = (date: string) => {
    return events.filter(event => 
      format(new Date(event.startDate), 'yyyy-MM-dd') === date
    );
  };

  return (
    <View style={styles.container}>
      <RNCalendar
        theme={{
          todayTextColor: theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primaryContainer,
          selectedDayTextColor: theme.colors.onPrimaryContainer,
          monthTextColor: theme.colors.primary,
          textMonthFontWeight: 'bold',
          arrowColor: theme.colors.primary,
        }}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        enableSwipeMonths
      />
      <ScrollView style={styles.eventList}>
        {getDayEvents(selectedDate).map(event => (
          <Card 
            key={event.id} 
            style={[styles.eventCard, { borderLeftColor: event.color || theme.colors.primary }]}
            onPress={() => onEventPress(event)}
          >
            <Card.Content>
              <Text variant="titleMedium">{event.title}</Text>
              <Text variant="bodySmall">
                {format(new Date(event.startDate), 'h:mm a')}
                {event.endDate && ` - ${format(new Date(event.endDate), 'h:mm a')}`}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                {event.type.replace('_', ' ')}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventList: {
    padding: 16,
  },
  eventCard: {
    marginBottom: 8,
    borderLeftWidth: 4,
  },
}); 