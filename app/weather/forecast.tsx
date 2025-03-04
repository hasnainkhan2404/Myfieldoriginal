import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, IconButton, SegmentedButtons, useTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useWeather } from '../../src/hooks/useWeather';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function WeatherForecast() {
  const { forecast } = useWeather();
  const [view, setView] = useState<'hourly' | 'daily'>('hourly');
  const theme = useTheme();

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return 'weather-sunny';
      case 'cloudy': return 'weather-cloudy';
      case 'rain': return 'weather-rainy';
      case 'storm': return 'weather-lightning-rainy';
      default: return 'weather-cloudy';
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Weather Forecast' }} />
      <ScrollView style={styles.container}>
        <SegmentedButtons
          value={view}
          onValueChange={value => setView(value as 'hourly' | 'daily')}
          buttons={[
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: '7 Days' },
          ]}
          style={styles.viewToggle}
        />

        {view === 'hourly' ? (
          <>
            <Card style={styles.card}>
              <Card.Title title="Temperature" />
              <Card.Content>
                <LineChart
                  data={{
                    labels: forecast?.hourly.map(h => format(new Date(h.timestamp), 'HH:mm')) || [],
                    datasets: [{
                      data: forecast?.hourly.map(h => h.temperature) || [],
                    }],
                  }}
                  width={Dimensions.get('window').width - 32}
                  height={220}
                  chartConfig={{
                    backgroundColor: theme.colors.background,
                    backgroundGradientFrom: theme.colors.background,
                    backgroundGradientTo: theme.colors.background,
                    decimalPlaces: 1,
                    color: (opacity = 1) => theme.colors.primary,
                  }}
                  style={styles.chart}
                />
              </Card.Content>
            </Card>

            {forecast?.hourly.map((hour, index) => (
              <Card key={index} style={styles.hourCard}>
                <Card.Title
                  title={format(new Date(hour.timestamp), 'HH:mm')}
                  left={(props) => (
                    <MaterialCommunityIcons
                      {...props}
                      name={getWeatherIcon(hour.condition)}
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                />
                <Card.Content>
                  <View style={styles.hourlyDetails}>
                    <View style={styles.detailItem}>
                      <Text variant="titleLarge">{hour.temperature.toFixed(1)}°C</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="water-percent" size={20} />
                      <Text>{hour.humidity}%</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="weather-windy" size={20} />
                      <Text>{hour.windSpeed} km/h</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        ) : (
          forecast?.daily.map((day, index) => (
            <Card key={index} style={styles.card}>
              <Card.Title
                title={format(new Date(day.date), 'EEEE')}
                subtitle={format(new Date(day.date), 'PP')}
                left={(props) => (
                  <MaterialCommunityIcons
                    {...props}
                    name={getWeatherIcon(day.condition)}
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              />
              <Card.Content>
                <View style={styles.dailyDetails}>
                  <View style={styles.temperatures}>
                    <Text variant="titleLarge">{day.high.toFixed(1)}°</Text>
                    <Text variant="titleMedium" style={styles.lowTemp}>
                      {day.low.toFixed(1)}°
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="water" size={20} />
                    <Text>{day.precipitation} mm</Text>
                  </View>
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
  viewToggle: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  hourCard: {
    marginBottom: 8,
  },
  hourlyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperatures: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  lowTemp: {
    color: '#666',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
}); 