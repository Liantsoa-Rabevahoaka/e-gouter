import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Chip, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function SupplierCard({ supplier, onPress }) {
  const theme = useTheme();
  const distance = supplier.distance ? supplier.distance.toFixed(1) : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card style={styles.card} elevation={2}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="store" size={24} color="#e67e22" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {supplier.nom}
              </Text>
              <Text style={styles.address} numberOfLines={1}>
                {supplier.adresse}
              </Text>
            </View>
            {distance && (
              <Chip icon="map-marker" style={styles.chip} textStyle={styles.chipText}>
                {distance} km
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff3e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#666',
  },
  chip: {
    backgroundColor: '#f0f0f0',
    height: 32,
  },
  chipText: {
    fontSize: 12,
    color: '#e67e22',
  },
});