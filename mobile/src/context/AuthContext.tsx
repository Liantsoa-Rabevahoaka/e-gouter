import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Optionally fetch user from /api/user
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const userData = await apiLogin(email, password);
    setUser(userData);
  };

  const register = async (data) => {
    const userData = await apiRegister(data);
    setUser(userData);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);