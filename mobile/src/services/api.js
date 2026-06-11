import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilisez l'IP de votre machine (celle du backend Laravel)
const API_URL = 'http://192.168.33.77:8000/api';  // À remplacer par votre IP

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
      await AsyncStorage.removeItem('token');
      // Navigation vers login (à implémenter via un event ou un contexte)
    }
    return Promise.reject(error);
  }
);

export default api;