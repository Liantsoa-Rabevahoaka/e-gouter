import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useOrders } from '../context/OrderContext';
import { useEffect } from 'react';

export default function OrdersScreen() {
  const { orders, loading, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes commandes</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.number}>#{item.numero_commande}</Text>
            <Text>Date : {new Date(item.created_at).toLocaleDateString()}</Text>
            <Text>Montant : {item.montant_total} €</Text>
            <Text style={[styles.status, { color: item.statut === 'livrée' ? 'green' : 'orange' }]}>
              Statut : {item.statut}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  number: { fontWeight: 'bold', fontSize: 16 },
  status: { marginTop: 8, fontWeight: '500' },
});