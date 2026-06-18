import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, ActivityIndicator, Button, Appbar, Menu, Divider } from 'react-native-paper';
import { useAuth } from '../src/context/AuthContext';
import { useGeolocation } from '../src/hooks/useGeolocation';
import api from '../src/services/api';
import SupplierCard from '../src/components/SupplierCard';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { user, loading: authLoading, logout } = useAuth();
  const { location, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Redirection immédiate si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user]);

  const loadSuppliers = useCallback(async () => {
    if (!user) return; // Ne pas charger si pas connecté
    if (!location) return;
    
    setApiError(null);
    try {
      const response = await api.get(`/fournisseurs/proches/${location.lat}/${location.lon}`);
      console.log('Fournisseurs reçus :', response.data.map(f => f.nom));
      setSuppliers(response.data);
    } catch (err) {
      console.error('❌ Erreur API:', err.response?.status, err.response?.data);
      if (err.response?.status === 401) {
        // Token invalide : déconnecter l'utilisateur
        await logout();
        router.replace('/login');
      } else {
        setApiError(err.message || 'Erreur de chargement');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, location, logout]);

  useEffect(() => {
    if (user && location) {
      loadSuppliers();
    } else if (user && !location && !geoLoading) {
      setLoading(false);
    }
  }, [user, location, geoLoading, loadSuppliers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (!location) {
      await requestLocation();
    }
    await loadSuppliers();
  }, [location, requestLocation, loadSuppliers]);

  const handleSupplierPress = (supplierId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/supplier/${supplierId}`);
  };

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setMenuVisible(false);
    await logout();
    router.replace('/login');
  };

  // Pendant le chargement de l'authentification, ne rien afficher (évite flash)
  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  // Si non authentifié, ne rien afficher (la redirection va s'effectuer)
  if (!user) {
    return null;
  }

  // Géolocalisation en cours
  if (geoLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Récupération de votre position...</Text>
      </View>
    );
  }

  if (geoError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{geoError}</Text>
        <Button mode="contained" onPress={requestLocation} buttonColor="#e67e22">
          Réessayer
        </Button>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Position non disponible</Text>
        <Button mode="contained" onPress={requestLocation} buttonColor="#e67e22">
          Activer la localisation
        </Button>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Chargement des fournisseurs...</Text>
      </View>
    );
  }

  if (apiError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{apiError}</Text>
        <Button mode="contained" onPress={loadSuppliers} buttonColor="#e67e22">
          Réessayer
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="E-Goûter" titleStyle={styles.headerTitle} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Appbar.Action icon="account-circle" onPress={() => setMenuVisible(true)} />}
        >
          <Menu.Item onPress={() => { setMenuVisible(false); router.push('/orders'); }} title="Mes commandes" />
          <Menu.Item onPress={() => { setMenuVisible(false); router.push('/cart'); }} title="Mon panier" />

          {/* Afficher Admin uniquement si rôle = admin */}
            {user?.role === 'admin' && (
              <Menu.Item onPress={() => { setMenuVisible(false); router.push('/admin'); }} title="Administration" leadingIcon="shield" />
            )}

          <Divider />
          <Menu.Item onPress={handleLogout} title="Déconnexion" leadingIcon="logout" />
        </Menu>
      </Appbar.Header>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Bonjour, {user?.prenom} {user?.nom}
        </Text>
        <Text style={styles.subtitle}>Fournisseurs proches de vous</Text>
      </View>

      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SupplierCard supplier={item} onPress={() => handleSupplierPress(item.id)} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e67e22']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun fournisseur trouvé à proximité</Text>
            <Button mode="text" onPress={onRefresh} textColor="#e67e22">
              Rafraîchir
            </Button>
          </View>
        }
        contentContainerStyle={suppliers.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#e67e22' },
  welcomeContainer: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  list: { padding: 16, paddingTop: 8 },
  emptyList: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginBottom: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 16, textAlign: 'center' },
});