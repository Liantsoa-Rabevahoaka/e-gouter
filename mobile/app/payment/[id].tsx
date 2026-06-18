import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Button, ActivityIndicator, Appbar, Card, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrders } from '../../src/context/OrderContext';
import * as Haptics from 'expo-haptics';

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const { trackOrder, simulatePayment, fetchOrders } = useOrders(); // ← AJOUTER fetchOrders
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await trackOrder(id);
      setOrder(data);
    } catch (err) {
      setError('Commande introuvable');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await simulatePayment(id);
      await fetchOrders();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push(`/order/${id}`);
    } catch (err) {
      setError('Erreur lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

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
        <Text style={styles.errorText}>{error || 'Erreur'}</Text>
        <Button onPress={() => router.back()}>Retour</Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Paiement" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.orderNumber}>Commande n° {order.numero_commande}</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Montant</Text>
            <Text style={styles.totalAmount}>{order.montant_total} €</Text>
          </View>
          <Text style={styles.paymentMethod}>Mode : {order.mode_paiement}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handlePayment}
        loading={processing}
        disabled={processing}
        buttonColor="#e67e22"
        style={styles.payButton}
        labelStyle={styles.buttonLabel}
      >
        Payer {order.montant_total} €
      </Button>

      <Snackbar visible={!!error} onDismiss={() => setError(null)} duration={3000}>
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee', marginHorizontal: -16, marginTop: -16 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 16 },
  card: { borderRadius: 16, backgroundColor: '#fff', padding: 16, marginBottom: 24 },
  orderNumber: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 16, color: '#666' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#e67e22' },
  paymentMethod: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  payButton: { borderRadius: 12, paddingVertical: 8, marginTop: 16 },
  buttonLabel: { fontSize: 16, fontWeight: '600' },
});