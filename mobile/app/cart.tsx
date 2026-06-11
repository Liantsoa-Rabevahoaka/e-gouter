import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Button, Appbar, Divider, Snackbar } from 'react-native-paper';
import { useCart } from '../src/context/CartContext';
import { useAuth } from '../src/context/AuthContext';
import { router } from 'expo-router';
import CartItem from '../src/components/CartItem';
import * as Haptics from 'expo-haptics';

export default function CartScreen() {
  const { user } = useAuth();
  const { cart, loading, total, updateItem, removeItem, clearCart } = useCart();
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  if (!user) {
    router.replace('/login');
    return null;
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  const handleCheckout = () => {
    if (isEmpty) {
      setSnackbarMsg('Votre panier est vide');
      setSnackbarVisible(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/checkout');
  };

  const handleClearCart = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await clearCart();
    setSnackbarMsg('Panier vidé');
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Mon panier" titleStyle={styles.headerTitle} />
        {!isEmpty && (
          <Appbar.Action icon="delete" onPress={handleClearCart} />
        )}
      </Appbar.Header>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <Button mode="contained" onPress={() => router.push('/')} buttonColor="#e67e22">
            Découvrir les fournisseurs
          </Button>
        </View>
      ) : (
        <FlatList
          data={cart.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CartItem item={item} onUpdate={updateItem} onRemove={removeItem} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {!isEmpty && (
        <View style={styles.footer}>
          <Divider />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{total.toFixed(2)} €</Text>
          </View>
          <Button
            mode="contained"
            onPress={handleCheckout}
            buttonColor="#e67e22"
            style={styles.checkoutButton}
            labelStyle={styles.buttonLabel}
          >
            Valider la commande
          </Button>
        </View>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
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
  list: { padding: 16, paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#999', marginBottom: 20 },
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  totalPrice: { fontSize: 24, fontWeight: 'bold', color: '#e67e22' },
  checkoutButton: { borderRadius: 12, paddingVertical: 6 },
  buttonLabel: { fontSize: 16, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});