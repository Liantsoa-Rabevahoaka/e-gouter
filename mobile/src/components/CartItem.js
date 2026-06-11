import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function CartItem({ item, onUpdate, onRemove }) {
  const theme = useTheme();
  const product = item.produit;

  const handleIncrement = () => {
    onUpdate(item.id, item.quantite + 1);
  };

  const handleDecrement = () => {
    if (item.quantite > 1) {
      onUpdate(item.id, item.quantite - 1);
    } else {
      onRemove(item.id);
    }
  };

  return (
    <Card style={styles.card} elevation={1}>
      <Card.Content style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{product.nom}</Text>
          <Text style={styles.price}>{product.prix} €</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleDecrement} style={styles.qtyButton}>
            <MaterialIcons name="remove" size={20} color="#e67e22" />
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantite}</Text>
          <TouchableOpacity onPress={handleIncrement} style={styles.qtyButton}>
            <MaterialIcons name="add" size={20} color="#e67e22" />
          </TouchableOpacity>
          <IconButton
            icon="delete"
            iconColor="#ff4444"
            size={20}
            onPress={() => onRemove(item.id)}
            style={styles.deleteButton}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  info: {
    flex: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e67e22',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff3e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  qty: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 4,
    marginRight: -8,
  },
});