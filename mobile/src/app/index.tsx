import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getCurrentLocation } from '../services/geolocation';
import api from '../services/api';
import SupplierCard from '../components/SupplierCard';

export default function HomeScreen() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const { lat, lon } = await getCurrentLocation();
      const res = await api.get(`/fournisseurs/proches/${lat}/${lon}`);
      setSuppliers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Bienvenue {user?.prenom}</Text>
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SupplierCard supplier={item} />}
      />
    </View>
  );
}