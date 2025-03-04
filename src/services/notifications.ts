import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  requestPermissions: async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions');
      return false;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('weather-alerts', {
        name: 'Weather Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return true;
  },

  scheduleWeatherAlert: async (alert: WeatherAlert) => {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Weather Alert: ${alert.type}`,
          body: alert.message,
          data: { alertId: alert.id },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { 
          seconds: 1,  // Send immediately
          channelId: 'weather-alerts',
        },
      });
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  },
}; 