import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Button, Appbar, Card, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import api from '../../src/services/api';
import ProductCard from '../../src/components/ProductCard';
import { useCart } from '../../src/context/CartContext'; // ← Importer le hook
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function SupplierDetailScreen() {
  const { id } = useLocalSearchParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const { addItem } = useCart(); // ← Récupérer addItem

  useEffect(() => {
    loadSupplier();
  }, [id]);

  const loadSupplier = async () => {
    try {
      const response = await api.get(`/fournisseurs/${id}`);
      setSupplier(response.data);
    } catch (err) {
      setError('Impossible de charger les informations du fournisseur');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await addItem(productId, 1); // ← Appel réel au contexte
      setSnackbarMsg('Produit ajouté au panier');
      setSnackbarVisible(true);
    } catch (err) {
      setSnackbarMsg("Erreur lors de l'ajout");
      setSnackbarVisible(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  if (error || !supplier) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Fournisseur introuvable'}</Text>
        <Button mode="contained" onPress={() => router.back()} buttonColor="#e67e22">
          Retour
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={supplier.nom} titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.infoCard} elevation={0}>
          <Card.Content>
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-on" size={20} color="#e67e22" />
              <Text style={styles.address}>{supplier.adresse}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Nos produits</Text>
          </Card.Content>
        </Card>

        <FlatList
          data={supplier.produits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard product={item} onAddToCart={() => handleAddToCart(item.id)} />
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.productsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun produit disponible</Text>
            </View>
          }
        />
      </ScrollView>

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

// (styles inchangés)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 16, textAlign: 'center' },
  infoCard: { margin: 16, marginBottom: 8, borderRadius: 16, backgroundColor: '#fff' },
  addressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  address: { fontSize: 14, color: '#555', marginLeft: 8, flex: 1 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  productsList: { paddingHorizontal: 16, paddingBottom: 30 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 14, color: '#999' },
});