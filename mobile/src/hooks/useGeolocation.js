import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const requestLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        setLoading(false);
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation({
        lat: locationData.coords.latitude,
        lon: locationData.coords.longitude,
      });
    } catch (err) {
      setError(err.message || 'Erreur de géolocalisation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { location, loading, error, permissionStatus, requestLocation };
};