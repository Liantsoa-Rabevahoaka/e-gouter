import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilisez l'IP de votre machine (celle du backend Laravel)
const API_URL = 'http://192.168.42.176:8000/api';  // IP à changer


const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Déclencher une déconnexion globale
      await AsyncStorage.removeItem('token');
      delete api.defaults.headers.Authorization;
      // Optionnel : émettre un événement (mais pas nécessaire)
    }
    return Promise.reject(error);
  }
);

export default api;