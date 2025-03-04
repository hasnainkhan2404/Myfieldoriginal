import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { Card, Text, Button, useTheme, Avatar, ActivityIndicator } from 'react-native-paper';
import { useAuthContext } from '../../src/providers/AuthProvider';
import { useWeather } from '../../src/hooks/useWeather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Home() {
  const { user } = useAuthContext();
  const { weather, loading, error, refresh } = useWeather();
  const theme = useTheme();

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'weather-sunny';
      case 'cloudy': return 'weather-cloudy';
      case 'rainy': return 'weather-rainy';
      default: return 'weather-partly-cloudy';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      {/* Welcome Card */}
      <Card style={styles.card}>
        <Card.Title
          title={`Welcome${user?.full_name ? `, ${user.full_name}` : ''}`}
          subtitle="Your farming assistant"
          left={(props) => (
            <Avatar.Icon {...props} icon="account" />
          )}
        />
      </Card>

      {/* Weather Card */}
      <Card style={styles.card}>
        <Card.Title
          title="Weather Forecast"
          left={(props) => (
            <Avatar.Icon {...props} icon="weather-partly-cloudy" />
          )}
        />
        <Card.Content>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Text variant="bodyMedium" style={styles.errorText}>{error}</Text>
          ) : weather ? (
            <>
              <View style={styles.weatherRow}>
                <MaterialCommunityIcons 
                  name={getWeatherIcon(weather.condition)} 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <Text variant="bodyLarge" style={styles.weatherText}>
                  {weather.condition}, {weather.temperature}°C
                </Text>
              </View>
              <Text variant="bodyMedium">
                Humidity: {weather.humidity}% • Wind: {weather.windSpeed} km/h
              </Text>
              <Button 
                mode="text" 
                onPress={() => router.push('/weather')}
                style={styles.weatherButton}
              >
                View Detailed Forecast
              </Button>
            </>
          ) : null}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Title 
          title="Quick Actions"
          left={(props) => (
            <Avatar.Icon {...props} icon="lightning-bolt" />
          )}
        />
        <Card.Content style={styles.quickActions}>
          <Button 
            mode="contained-tonal" 
            icon="message-text"
            style={styles.actionButton}
            onPress={() => {/* TODO: Navigate to consult */}}
          >
            Get Expert Help
          </Button>
          <Button 
            mode="contained-tonal"
            icon="leaf"
            style={styles.actionButton}
            onPress={() => {/* TODO: Navigate to analysis */}}
          >
            Analyze Crops
          </Button>
        </Card.Content>
      </Card>

      {/* Tips Card */}
      <Card style={styles.card}>
        <Card.Title 
          title="Daily Tips"
          left={(props) => (
            <Avatar.Icon {...props} icon="lightbulb" />
          )}
        />
        <Card.Content>
          <Text variant="bodyMedium">
            • Check soil moisture levels regularly{'\n'}
            • Monitor for pest activity{'\n'}
            • Plan your irrigation schedule
          </Text>
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
  card: {
    marginBottom: 16,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherText: {
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginVertical: 8,
    minWidth: '45%',
  },
  errorText: {
    color: 'red',
  },
  weatherButton: {
    marginTop: 8,
  },
}); 