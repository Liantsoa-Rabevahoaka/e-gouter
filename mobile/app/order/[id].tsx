import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Appbar, Card, Button } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrders } from '../../src/context/OrderContext';
import OrderStatus from '../../src/components/OrderStatus';
import * as Haptics from 'expo-haptics';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams();
  const { trackOrder } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const loadOrder = async () => {
    try {
      const data = await trackOrder(id);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger le suivi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // Rafraîchir toutes les 5 secondes
    intervalRef.current = setInterval(loadOrder, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Commande introuvable'}</Text>
        <Button onPress={() => router.back()}>Retour</Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Suivi commande" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.orderNumber}>Commande n° {order.numero_commande}</Text>
            <Text style={styles.date}>Passée le {new Date(order.created_at).toLocaleString()}</Text>
            <View style={styles.divider} />
            <OrderStatus status={order.statut} />
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Montant total</Text>
              <Text style={styles.totalAmount}>{order.montant_total} €</Text>
            </View>
            <Text style={styles.paymentMethod}>Paiement : {order.mode_paiement}</Text>
            <Text style={styles.address}>Livraison : {order.adresse_livraison}</Text>
          </Card.Content>
        </Card>

        <Button mode="outlined" onPress={() => router.push('/')} style={styles.homeButton} textColor="#e67e22">
          Retour à l'accueil
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  content: { padding: 16, paddingBottom: 30 },
  card: { borderRadius: 16, backgroundColor: '#fff', padding: 8 },
  orderNumber: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: '#1a1a2e' },
  date: { fontSize: 14, color: '#888', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 16, color: '#666' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#e67e22' },
  paymentMethod: { fontSize: 14, color: '#555', marginBottom: 4 },
  address: { fontSize: 14, color: '#555' },
  homeButton: { marginTop: 24, borderRadius: 8, borderColor: '#e67e22' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 16, textAlign: 'center' },
});