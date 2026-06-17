import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, ActivityIndicator, Appbar, Button, Card } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrders } from '../../src/context/OrderContext';
import * as Haptics from 'expo-haptics';

const STATUS_STEPS = [
  { key: 'en attente de paiement', label: 'En attente', icon: 'hourglass-empty' },
  { key: 'payée', label: 'Payée', icon: 'check-circle' },
  { key: 'en préparation', label: 'Préparation', icon: 'food' },
  { key: 'en livraison', label: 'Livraison', icon: 'delivery-dining' },
  { key: 'livrée', label: 'Livrée', icon: 'celebration' },
  { key: 'annulée', label: 'Annulée', icon: 'cancel' },
];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams();
  const { trackOrder } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrder = async () => {
    try {
      const data = await trackOrder(id);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError('Commande introuvable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 5000);
    return () => clearInterval(interval);
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
        <Text style={styles.errorText}>{error || 'Erreur'}</Text>
        <Button mode="contained" onPress={() => router.back()}>Retour</Button>
      </View>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(step => step.key === order.statut);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`Commande #${order.numero_commande}`} titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.statusTitle}>Statut actuel : {order.statut}</Text>
          {/* Ici vous pouvez ajouter une barre de progression ou une liste d'étapes */}
          <View style={styles.stepsContainer}>
            {STATUS_STEPS.map((step, idx) => (
              <View key={step.key} style={styles.step}>
                <View style={[styles.stepIndicator, idx <= currentStepIndex && styles.stepActive]} />
                <Text style={[styles.stepLabel, idx <= currentStepIndex && styles.stepLabelActive]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.detail}>Montant : {order.montant_total} €</Text>
          <Text style={styles.detail}>Mode de paiement : {order.mode_paiement}</Text>
          <Text style={styles.detail}>Adresse : {order.adresse_livraison}</Text>
        </Card.Content>
      </Card>

      <Button mode="outlined" onPress={() => router.push('/')} style={styles.homeButton}>
        Retour à l'accueil
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 16 },
  card: { margin: 16, padding: 16, borderRadius: 16 },
  statusTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  stepsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  step: { alignItems: 'center', flex: 1 },
  stepIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ccc', marginBottom: 5 },
  stepActive: { backgroundColor: '#e67e22' },
  stepLabel: { fontSize: 10, color: '#999', textAlign: 'center' },
  stepLabelActive: { color: '#e67e22', fontWeight: 'bold' },
  detail: { fontSize: 14, color: '#555', marginBottom: 8 },
  homeButton: { margin: 16, borderRadius: 12, borderColor: '#e67e22' },
});