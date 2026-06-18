import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Text, ActivityIndicator, Appbar } from 'react-native-paper';
import { useOrders } from '../src/context/OrderContext';
import { router } from 'expo-router';

export default function OrdersScreen() {
  const { orders, loading, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders(); // ← Chargement au montage
  }, []);

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
          <Text style={styles.emptyText}>Aucune commande pour l'instant</Text>
        </View>
      ) : (
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
  card: { backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginBottom: 12, borderRadius: 12, elevation: 2 },
  number: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  status: { marginTop: 8, fontWeight: '500' },
});