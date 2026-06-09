import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/stats').then(res => {
        setStats(res.data);
        setLoading(false);
      });
    }
  }, []);

  if (user?.role !== 'admin') return <Text style={styles.error}>Accès réservé aux administrateurs</Text>;
  if (loading) return <ActivityIndicator size="large" />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text>👥 Utilisateurs : {stats.users}</Text>
      <Text>🏪 Fournisseurs : {stats.fournisseurs}</Text>
      <Text>🍔 Produits : {stats.produits}</Text>
      <Text>📦 Commandes : {stats.commandes}</Text>
      <Text>💰 CA total : {stats.chiffre_affaires} €</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  error: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 18, color: 'red' },
});