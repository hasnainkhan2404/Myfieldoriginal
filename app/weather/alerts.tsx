import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, IconButton, Chip, useTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useWeather } from '../../src/hooks/useWeather';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WeatherAlerts() {
  const { alerts } = useWeather();
  const theme = useTheme();

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return theme.colors.primary;
      case 'medium': return theme.colors.warning;
      case 'high': return theme.colors.error;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'storm': return 'weather-lightning';
      case 'frost': return 'snowflake';
      case 'drought': return 'water-off';
      case 'pest': return 'bug';
      default: return 'alert';
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Weather Alerts',
          headerRight: () => (
            <IconButton icon="bell-plus" onPress={() => {/* TODO: Add new alert */}} />
          ),
        }}
      />
      <ScrollView style={styles.container}>
        {alerts.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No active weather alerts
              </Text>
            </Card.Content>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} style={styles.card}>
              <Card.Title
                title={alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                subtitle={`Valid: ${format(new Date(alert.startDate), 'PP')} - ${format(new Date(alert.endDate), 'PP')}`}
                left={(props) => (
                  <MaterialCommunityIcons
                    {...props}
                    name={getAlertIcon(alert.type)}
                    size={24}
                    color={getSeverityColor(alert.severity)}
                  />
                )}
              />
              <Card.Content>
                <View style={styles.alertContent}>
                  <Chip 
                    style={{ backgroundColor: getSeverityColor(alert.severity) }}
                  >
                    {alert.severity.toUpperCase()}
                  </Chip>
                  <Text variant="bodyMedium" style={styles.message}>
                    {alert.message}
                  </Text>
                  <Text variant="bodySmall" style={styles.fieldsAffected}>
                    Fields Affected: {alert.affectedFields.length}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  alertContent: {
    gap: 12,
  },
  message: {
    marginTop: 8,
  },
  fieldsAffected: {
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 