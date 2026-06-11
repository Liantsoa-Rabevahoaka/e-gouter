import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { getCurrentLocation } from '../src/services/geolocation';
import api from '../src/services/api';
import SupplierCard from '../src/components/SupplierCard';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Redirection si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user]);

  const loadSuppliers = async () => {
    if (!user) return; // Ne pas charger si pas de user
    try {
      setError(null);
      const { lat, lon } = await getCurrentLocation();
      const response = await api.get(`/fournisseurs/proches/${lat}/${lon}`);
      setSuppliers(response.data);
    } catch (err) {
      setError(err.message || 'Erreur de chargement');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) loadSuppliers();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSuppliers();
  }, []);

  if (authLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <TouchableOpacity onPress={loadSuppliers} style={{ backgroundColor: '#e67e22', padding: 10, borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Bonjour {user?.prenom}</Text>
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SupplierCard supplier={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text>Aucun fournisseur trouvé</Text>}
      />
    </View>
  );
}