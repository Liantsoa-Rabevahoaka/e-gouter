import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';

export default function SupplierDetailScreen() {
  const { id } = useLocalSearchParams();
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/fournisseurs/${id}`).then(res => {
      setSupplier(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = (produitId: number, quantite: number = 1) => {
    addItem(produitId, quantite);
    alert('Ajouté au panier');
  };

  if (loading) return <ActivityIndicator size="large" />;
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{supplier.nom}</Text>
      <Text style={styles.address}>{supplier.adresse}</Text>
      <FlatList
        data={supplier.produits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard product={item} onAdd={() => handleAddToCart(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  address: { fontSize: 16, color: '#666', marginBottom: 20 },
});