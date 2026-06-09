import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = async (data: any) => {
  const res = await api.post('/register', data);
  await AsyncStorage.setItem('token', res.data.token);
  return res.data.user;
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/login', { email, password });
  await AsyncStorage.setItem('token', res.data.token);
  return res.data.user;
};

export const logout = async () => {
  await api.post('/logout');
  await AsyncStorage.removeItem('token');
};