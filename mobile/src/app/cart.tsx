import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItemComponent from '../components/CartItem';
import { router } from 'expo-router';

export default function CartScreen() {
  const { cart, loading, removeItem, updateItem, clearCart } = useCart();
  const { user } = useAuth();

  if (!user) return <Text style={styles.placeholder}>Connectez-vous pour voir votre panier</Text>;
  if (loading) return <ActivityIndicator size="large" />;
  if (!cart || cart.items.length === 0) return <Text style={styles.placeholder}>Votre panier est vide</Text>;

  const total = cart.items.reduce((sum, item) => sum + item.quantite * item.prix_unitaire, 0);

  const handleCheckout = () => {
    router.push('/checkout'); // à créer
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItemComponent item={item} onUpdate={updateItem} onRemove={removeItem} />
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total : {total.toFixed(2)} €</Text>
        <TouchableOpacity style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Valider la commande</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearText}>Vider le panier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  footer: { borderTopWidth: 1, borderColor: '#eee', paddingVertical: 16 },
  total: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  button: { backgroundColor: '#e67e22', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  clearButton: { alignItems: 'center' },
  clearText: { color: 'red' },
  placeholder: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#888' },
});