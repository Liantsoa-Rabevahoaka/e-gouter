// src/components/MapView.js
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

const MapComponent = ({ suppliers, userLocation }) => {
  const mapRef = useRef(null);
  const router = useRouter();
  const [region, setRegion] = useState(null);

  // Centrer la carte sur la position utilisateur dès qu'elle est disponible
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const newRegion = {
        latitude: userLocation.lat,
        longitude: userLocation.lon,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [userLocation]);

  const handleMarkerPress = (supplierId) => {
    router.push(`/supplier/${supplierId}`);
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      const newRegion = {
        latitude: userLocation.lat,
        longitude: userLocation.lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(newRegion, 500);
    }
  };

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.lat,
          longitude: userLocation.lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        zoomEnabled={true}
        rotateEnabled={false}
      >
        {suppliers.map((supplier) => (
          <Marker
            key={supplier.id}
            coordinate={{
              latitude: parseFloat(supplier.latitude),
              longitude: parseFloat(supplier.longitude),
            }}
            title={supplier.nom}
            description={supplier.adresse}
            onPress={() => handleMarkerPress(supplier.id)}
          >
            {/* Icône personnalisée */}
            <View style={styles.markerContainer}>
              <Ionicons name="storefront" size={30} color="#e67e22" />
              <View style={styles.markerBadge}>
                <Text style={styles.markerText}>{supplier.nom.charAt(0)}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Bouton centrage sur la position */}
      <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
        <Ionicons name="navigate" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  markerContainer: { alignItems: 'center' },
  markerBadge: {
    backgroundColor: '#e67e22',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  markerText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  centerButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#e67e22',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#999' },
});

export default MapComponent;