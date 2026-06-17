import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, TextInput, Button, Appbar, RadioButton, ActivityIndicator, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useCart } from '../src/context/CartContext';
import { useOrders } from '../src/context/OrderContext';
import * as Haptics from 'expo-haptics';

const PAYMENT_METHODS = [
  { label: 'MVola', value: 'MVola' },
  { label: 'Orange Money', value: 'Orange Money' },
  { label: 'Airtel Money', value: 'Airtel Money' },
  { label: 'Visa', value: 'Visa' },
  { label: 'Mastercard', value: 'Mastercard' },
  { label: 'Paiement à la livraison', value: 'paiement à la livraison' },
];

export default function CheckoutScreen() {
  const { total, clearCart } = useCart();
  const { validateOrder } = useOrders();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MVola');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleConfirm = async () => {
    if (!address.trim()) {
      setSnackbarMsg('Veuillez saisir une adresse de livraison');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      const order = await validateOrder(paymentMethod, address);

      console.log('Commande retournée:', order);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await clearCart(); // vider le panier localement
      router.push(`/payment/${order.id}`);
    } catch (error) {
      setSnackbarMsg(error.response?.data?.error || 'Erreur lors de la validation');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Validation commande" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <TextInput
            mode="outlined"
            placeholder="Votre adresse complète"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            style={styles.addressInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
            {PAYMENT_METHODS.map(method => (
              <View key={method.value} style={styles.radioRow}>
                <RadioButton value={method.value} color="#e67e22" />
                <Text style={styles.radioLabel}>{method.label}</Text>
              </View>
            ))}
          </RadioButton.Group>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total à payer</Text>
          <Text style={styles.totalPrice}>{total.toFixed(2)} €</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleConfirm}
          loading={loading}
          disabled={loading}
          buttonColor="#e67e22"
          style={styles.confirmButton}
          labelStyle={styles.buttonLabel}
        >
          Confirmer la commande
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
      >
        {snackbarMsg}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  content: { padding: 16, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1a1a2e' },
  addressInput: { backgroundColor: '#fff' },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radioLabel: { fontSize: 16, marginLeft: 8, color: '#333' },
  totalSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  totalLabel: { fontSize: 16, color: '#666' },
  totalPrice: { fontSize: 28, fontWeight: 'bold', color: '#e67e22', marginTop: 8 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: { borderRadius: 12, paddingVertical: 6 },
  buttonLabel: { fontSize: 16, fontWeight: '600' },
});