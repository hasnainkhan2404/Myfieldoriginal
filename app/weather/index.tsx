import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../../src/hooks/useWeather';
import { format } from 'date-fns';
import { router } from 'expo-router';

export default function Weather() {
  const { currentWeather, forecast, alerts, loading, error, loadWeather } = useWeather();
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadWeather} />
      }
    >
      {/* Current Weather */}
      <Card style={styles.card}>
        <Card.Title 
          title="Current Weather"
          right={(props) => (
            <IconButton 
              {...props} 
              icon="refresh" 
              onPress={loadWeather}
            />
          )}
        />
        <Card.Content>
          <View style={styles.currentWeather}>
            <MaterialCommunityIcons
              name={getWeatherIcon(currentWeather?.condition || 'cloudy')}
              size={64}
              color={theme.colors.primary}
            />
            <View style={styles.weatherInfo}>
              <Text variant="displaySmall">
                {currentWeather?.temperature.toFixed(1)}°C
              </Text>
              <Text variant="titleMedium">
                {currentWeather?.condition.charAt(0).toUpperCase() + 
                 currentWeather?.condition.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name="water-percent" 
                size={24} 
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium">
                {currentWeather?.humidity}%
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name="weather-windy" 
                size={24} 
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium">
                {currentWeather?.windSpeed} km/h
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name="water" 
                size={24} 
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium">
                {currentWeather?.precipitation} mm
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Hourly Forecast */}
      <Card style={styles.card}>
        <Card.Title 
          title="Today's Forecast"
          right={(props) => (
            <IconButton 
              {...props} 
              icon="chevron-right" 
              onPress={() => router.push('/weather/forecast')}
            />
          )}
        />
        <Card.Content>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {forecast?.hourly.slice(0, 24).map((hour, index) => (
              <View key={index} style={styles.hourlyForecast}>
                <Text variant="bodyMedium">
                  {format(new Date(hour.timestamp), 'HH:mm')}
                </Text>
                <MaterialCommunityIcons
                  name={getWeatherIcon(hour.condition)}
                  size={24}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium">
                  {hour.temperature.toFixed(1)}°
                </Text>
              </View>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Weather Alerts */}
      <Card style={styles.card}>
        <Card.Title 
          title="Weather Alerts"
          right={(props) => (
            <IconButton 
              {...props} 
              icon="chevron-right" 
              onPress={() => router.push('/weather/alerts')}
            />
          )}
        />
        <Card.Content>
          {alerts.length === 0 ? (
            <Text variant="bodyMedium">No active weather alerts</Text>
          ) : (
            alerts.slice(0, 3).map((alert) => (
              <View key={alert.id} style={styles.alert}>
                <MaterialCommunityIcons
                  name="alert"
                  size={24}
                  color={theme.colors.error}
                />
                <Text variant="bodyMedium" style={styles.alertText}>
                  {alert.message}
                </Text>
              </View>
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherInfo: {
    marginLeft: 16,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  hourlyForecast: {
    alignItems: 'center',
    marginRight: 24,
    gap: 8,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  alertText: {
    marginLeft: 8,
    flex: 1,
  },
  error: {
    color: 'red',
  },
}); 