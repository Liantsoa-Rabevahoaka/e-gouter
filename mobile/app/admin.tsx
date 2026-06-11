import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function AdminScreen() {
  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text>Accès non autorisé</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administration</Text>
      <Text>Statistiques à venir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});