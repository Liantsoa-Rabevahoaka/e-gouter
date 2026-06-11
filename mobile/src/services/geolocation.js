import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission de localisation refusée');
  }
  const location = await Location.getCurrentPositionAsync({});
  return {
    lat: location.coords.latitude,
    lon: location.coords.longitude,
  };
};