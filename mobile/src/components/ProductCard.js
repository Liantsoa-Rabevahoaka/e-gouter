import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Button, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProductCard({ product, onAddToCart }) {
  const theme = useTheme();

  return (
    <Card style={styles.card} elevation={1}>
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            {product.image ? (
              <Image source={{ uri: product.image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="fastfood" size={32} color="#ccc" />
              </View>
            )}
          </View>
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1}>
              {product.nom}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {product.description || 'Délicieuse préparation maison'}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{product.prix} €</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddToCart(product.id)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
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
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e67e22',
  },
  addButton: {
    backgroundColor: '#e67e22',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});