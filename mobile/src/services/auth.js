// src/services/auth.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  await AsyncStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/register', userData);
  await AsyncStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = async () => {
  await api.post('/logout');
  await AsyncStorage.removeItem('token');
};

export const getStoredUser = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.get('/user');
    return response.data;
  }
  return null;
};