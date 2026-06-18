// src/components/SupplierBottomSheet.js
import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';

export default function SupplierBottomSheet({ suppliers, onSupplierPress }) {
  const bottomSheetRef = useRef(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['15%', '40%', '70%']}
      enablePanDownToClose={false}
      index={1}
      style={styles.bottomSheet}
      backgroundStyle={styles.bottomSheetBackground}
      containerStyle={styles.containerStyle} // ← Ajout d’un style de conteneur
    >
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
        <Text style={styles.title}>Fournisseurs proches</Text>
      </View>
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => onSupplierPress(item.id)}
          >
            <View style={styles.itemContent}>
              <Ionicons name="storefront" size={20} color="#e67e22" />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nom}</Text>
                <Text style={styles.itemAddress} numberOfLines={1}>{item.adresse}</Text>
              </View>
              {item.distance !== undefined && (
                <Text style={styles.itemDistance}>{item.distance.toFixed(1)} km</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    zIndex: 10, // ← Priorité sur la carte
  },
  bottomSheet: {
    marginHorizontal: 0,
  },
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  itemAddress: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  itemDistance: {
    fontSize: 12,
    color: '#e67e22',
    fontWeight: '500',
  },
});