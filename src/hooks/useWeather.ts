import { useState, useEffect } from 'react';
import { WeatherData, WeatherForecast, WeatherAlert } from '../types/weather';
import { weatherService } from '../services/weather';
import { useFields } from './useFields';
import { useLocation } from './useLocation';
import { notificationService } from '../services/notifications';

export function useWeather() {
  const { fields } = useFields();
  const { location, errorMsg: locationError } = useLocation();
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize notifications on mount
  useEffect(() => {
    notificationService.requestPermissions();
  }, []);

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const [weather, forecastData, alertsData] = await Promise.all([
        weatherService.getCurrentWeather(
          location.coords.latitude,
          location.coords.longitude
        ),
        weatherService.getForecast(
          location.coords.latitude,
          location.coords.longitude
        ),
        weatherService.getAlerts(),
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
      setAlerts(alertsData);

      // Check weather conditions and create alerts if needed
      await weatherService.checkWeatherConditions(weather, forecastData);
      
      if (locationError) {
        setError(locationError);
      }
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async (alert: Omit<WeatherAlert, 'id'>) => {
    try {
      const newAlert = await weatherService.saveAlert(alert);
      setAlerts(prev => [newAlert, ...prev]);
      return newAlert;
    } catch (err) {
      console.error('Error adding alert:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadWeather();
  }, [location]);

  return {
    currentWeather,
    forecast,
    alerts,
    loading,
    error,
    loadWeather,
    addAlert,
  };
} 