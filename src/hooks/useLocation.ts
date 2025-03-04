import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

// Default location (example: New York City)
const DEFAULT_LOCATION: Location.LocationObject = {
  coords: {
    latitude: 40.7128,
    longitude: -74.0060,
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject>(DEFAULT_LOCATION);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // First check if location services are enabled
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          console.log('Location services are disabled');
          setErrorMsg('Location services are disabled. Using default location.');
          return; // Keep using default location
        }

        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission denied');
          setErrorMsg('Location permission denied. Using default location.');
          return; // Keep using default location
        }

        // Try to get last known location first
        const lastLocation = await Location.getLastKnownPositionAsync({});
        if (lastLocation) {
          console.log('Using last known location');
          setLocation(lastLocation);
        }

        // Then try to get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
        });
        
        console.log('Got current location:', currentLocation);
        setLocation(currentLocation);
        setErrorMsg(null); // Clear any previous errors

      } catch (error) {
        console.warn('Error getting location:', error);
        setErrorMsg('Unable to get current location. Using default location.');
        // Keep using default location
      }
    })();
  }, []);

  // Always return a location (either real or default)
  return {
    location,
    errorMsg,
  };
} 