import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, Appbar, Card, Chip } from 'react-native-paper';
import { useOrders } from '../src/context/OrderContext';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const getStatusColor = (status) => {
  switch (status) {
    case 'livrée': return '#4CAF50';
    case 'annulée': return '#f44336';
    case 'en attente de paiement': return '#FF9800';
    case 'payée': return '#2196F3';
    case 'en préparation': return '#9C27B0';
    case 'en livraison': return '#FF5722';
    default: return '#999';
  }
};

export default function OrdersScreen() {
  const { orders, loading, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderPress = (orderId) => {
    router.push(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Mes commandes" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt-long" size={60} color="#ddd" />
          <Text style={styles.emptyText}>Aucune commande pour l'instant</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleOrderPress(item.id)} activeOpacity={0.8}>
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Text style={styles.orderNumber}>#{item.numero_commande}</Text>
                    <Chip style={{ backgroundColor: getStatusColor(item.statut) + '22' }}>
                      <Text style={{ color: getStatusColor(item.statut), fontWeight: '500' }}>
                        {item.statut}
                      </Text>
                    </Chip>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
                    <Text style={styles.amount}>{item.montant_total} €</Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  list: { padding: 16, paddingBottom: 30 },
  card: { marginBottom: 12, borderRadius: 16, backgroundColor: '#fff' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderNumber: { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: 14, color: '#888' },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#e67e22' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});