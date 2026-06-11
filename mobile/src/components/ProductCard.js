import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onAdd }) => {
  return (
    <View>
      <Text>{product.nom}</Text>
      <Text>{product.prix} €</Text>
      <TouchableOpacity onPress={() => onAdd(product.id)}>
        <Text>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard; // ← AJOUTER CETTE LIGNE