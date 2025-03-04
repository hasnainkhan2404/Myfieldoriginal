import { WeatherData, WeatherForecast, WeatherAlert } from '../types/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEATHER_API_KEY } from '@env';
import { notificationService } from './notifications';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Temporary mock service while API key activates
const useMockData = true; // Set to false when API key is active

// Add this to verify the API key is loaded
console.log('API Key loaded:', WEATHER_API_KEY);

export const weatherService = {
  getCurrentWeather: async (latitude: number, longitude: number): Promise<WeatherData> => {
    if (useMockData) {
      return {
        temperature: 22 + Math.random() * 5,
        humidity: 65 + Math.random() * 10,
        windSpeed: 10 + Math.random() * 5,
        precipitation: Math.random() * 2,
        condition: ['clear', 'cloudy', 'rain', 'storm'][Math.floor(Math.random() * 4)] as WeatherData['condition'],
        timestamp: new Date().toISOString(),
      };
    }

    try {
      // Log the complete URL to verify it's correct
      const url = `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`;
      console.log('Complete Weather URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('Weather API response:', data);
      
      if (data.cod && data.cod !== 200) {
        throw new Error(data.message);
      }

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        precipitation: data.rain ? data.rain['1h'] || 0 : 0,
        condition: mapOpenWeatherCondition(data.weather[0].id),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch current weather');
    }
  },

  getForecast: async (latitude: number, longitude: number): Promise<WeatherForecast> => {
    if (useMockData) {
      const hourly = Array(24).fill(null).map((_, i) => ({
        temperature: 20 + Math.random() * 10,
        humidity: 60 + Math.random() * 20,
        windSpeed: 10 + Math.random() * 10,
        precipitation: Math.random() * 2,
        condition: ['clear', 'cloudy', 'rain', 'storm'][Math.floor(Math.random() * 4)] as WeatherData['condition'],
        timestamp: new Date(Date.now() + i * 3600000).toISOString(),
      }));

      const daily = Array(7).fill(null).map((_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString(),
        high: 25 + Math.random() * 5,
        low: 15 + Math.random() * 5,
        condition: ['clear', 'cloudy', 'rain', 'storm'][Math.floor(Math.random() * 4)] as WeatherData['condition'],
        precipitation: Math.random() * 10,
      }));

      return { hourly, daily };
    }

    try {
      const url = `${WEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`;
      console.log('Forecast API URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('Forecast API response:', data);

      if (data.cod && data.cod !== '200') {
        throw new Error(data.message);
      }

      // Process hourly data
      const hourly = data.list.slice(0, 24).map((item: any) => ({
        temperature: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        precipitation: item.rain ? item.rain['3h'] / 3 : 0,
        condition: mapOpenWeatherCondition(item.weather[0].id),
        timestamp: new Date(item.dt * 1000).toISOString(),
      }));

      // Process daily data
      const dailyData = data.list.reduce((acc: any, item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            temps: [],
            conditions: [],
            precip: 0,
          };
        }
        acc[date].temps.push(item.main.temp);
        acc[date].conditions.push(item.weather[0].id);
        acc[date].precip += item.rain ? item.rain['3h'] / 3 : 0;
        return acc;
      }, {});

      const daily = Object.entries(dailyData).slice(0, 7).map(([date, data]: [string, any]) => ({
        date,
        high: Math.max(...data.temps),
        low: Math.min(...data.temps),
        condition: mapOpenWeatherCondition(data.conditions[Math.floor(data.conditions.length / 2)]),
        precipitation: data.precip,
      }));

      return { hourly, daily };
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('Failed to fetch forecast');
    }
  },

  getAlerts: async (): Promise<WeatherAlert[]> => {
    try {
      const data = await AsyncStorage.getItem('weather_alerts');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting alerts:', error);
      return [];
    }
  },

  saveAlert: async (alert: Omit<WeatherAlert, 'id'>): Promise<WeatherAlert> => {
    try {
      const newAlert: WeatherAlert = {
        ...alert,
        id: Date.now().toString(),
      };

      const alerts = await weatherService.getAlerts();
      alerts.unshift(newAlert);
      await AsyncStorage.setItem('weather_alerts', JSON.stringify(alerts));
      
      // Send notification for the new alert
      await notificationService.scheduleWeatherAlert(newAlert);
      
      return newAlert;
    } catch (error) {
      console.error('Error saving alert:', error);
      throw new Error('Failed to save alert');
    }
  },

  // Add method to check for weather conditions and create alerts automatically
  checkWeatherConditions: async (weather: WeatherData, forecast: WeatherForecast): Promise<void> => {
    const alerts: Omit<WeatherAlert, 'id'>[] = [];

    // Check current conditions
    if (weather.condition === 'storm') {
      alerts.push({
        type: 'storm',
        severity: 'high',
        message: 'Severe storm warning. Take necessary precautions.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour duration
        affectedFields: [], // You can add specific field IDs here
      });
    }

    // Check for extreme temperatures in forecast
    const maxTemp = Math.max(...forecast.daily.map(day => day.high));
    if (maxTemp > 35) {
      alerts.push({
        type: 'drought',
        severity: 'medium',
        message: `High temperature warning: ${maxTemp}°C expected. Ensure proper irrigation.`,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(), // 24 hours duration
        affectedFields: [],
      });
    }

    // Create alerts
    for (const alert of alerts) {
      await weatherService.saveAlert(alert);
    }
  },
};

function mapOpenWeatherCondition(code: number): WeatherData['condition'] {
  // Map OpenWeatherMap condition codes to our conditions
  if (code >= 200 && code < 300) return 'storm';  // Thunderstorm
  if (code >= 300 && code < 600) return 'rain';   // Drizzle and Rain
  if (code >= 800 && code < 803) return 'clear';  // Clear and Few Clouds
  if (code >= 803) return 'cloudy';               // Cloudy
  return 'cloudy'; // Default fallback
} 