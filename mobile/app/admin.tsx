import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Appbar, Card, Button, Chip, Menu, Divider } from 'react-native-paper';
import { useAuth } from '../src/context/AuthContext';
import api from '../src/services/api';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const STATUTS = ['en attente de paiement', 'payée', 'en préparation', 'en livraison', 'livrée', 'annulée'];

export default function AdminScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null); // commandeId

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.replace('/');
    } else {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, commandesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/commandes'),
      ]);
      setStats(statsRes.data);
      setCommandes(commandesRes.data);
    } catch (error) {
      console.error('Erreur chargement admin', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleStatusChange = async (commandeId, newStatus) => {
    try {
      await api.put(`/admin/commande/${commandeId}/statut`, { statut: newStatus });
      // Recharger les données
      await loadData();
    } catch (error) {
      console.error('Erreur changement statut', error);
    }
    setMenuVisible(null);
  };

  if (user?.role !== 'admin') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Accès non autorisé</Text>
      </View>
    );
  }

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
        <Appbar.Content title="Administration" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.content}
      >
        {/* Statistiques */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Statistiques</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.users || 0}</Text>
                <Text style={styles.statLabel}>Utilisateurs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.fournisseurs || 0}</Text>
                <Text style={styles.statLabel}>Fournisseurs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.produits || 0}</Text>
                <Text style={styles.statLabel}>Produits</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.commandes || 0}</Text>
                <Text style={styles.statLabel}>Commandes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.chiffre_affaires_total || 0} €</Text>
                <Text style={styles.statLabel}>CA total</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Liste des commandes */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Commandes récentes</Text>
            {commandes.length === 0 ? (
              <Text style={styles.emptyText}>Aucune commande</Text>
            ) : (
              commandes.map((commande) => (
                <View key={commande.id} style={styles.commandeItem}>
                  <View style={styles.commandeHeader}>
                    <Text style={styles.commandeNumber}>#{commande.numero_commande}</Text>
                    <Text style={styles.commandeUser}>{commande.user?.nom} {commande.user?.prenom}</Text>
                  </View>
                  <View style={styles.commandeRow}>
                    <Text style={styles.commandeMontant}>{commande.montant_total} €</Text>
                    <Menu
                      visible={menuVisible === commande.id}
                      onDismiss={() => setMenuVisible(null)}
                      anchor={
                        <Chip
                          style={{ backgroundColor: '#f5f5f5' }}
                          onPress={() => setMenuVisible(commande.id)}
                        >
                          {commande.statut}
                        </Chip>
                      }
                    >
                      {STATUTS.map((statut) => (
                        <Menu.Item
                          key={statut}
                          onPress={() => handleStatusChange(commande.id, statut)}
                          title={statut}
                        />
                      ))}
                    </Menu>
                  </View>
                  <Divider style={styles.divider} />
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  content: { padding: 16, paddingBottom: 30 },
  card: { marginBottom: 16, borderRadius: 16, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#1a1a2e' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statItem: { width: '48%', backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12, marginBottom: 10, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#e67e22' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  commandeItem: { marginBottom: 12 },
  commandeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  commandeNumber: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  commandeUser: { fontSize: 14, color: '#888' },
  commandeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commandeMontant: { fontSize: 16, fontWeight: 'bold', color: '#e67e22' },
  divider: { marginVertical: 12 },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
});