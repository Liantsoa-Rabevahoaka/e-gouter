import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useOrders } from '../../context/OrderContext';
import OrderStatusComponent from '../../components/OrderStatus';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams();
  const { trackOrder } = useOrders();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await trackOrder(Number(id));
      setStatus(data.statut);
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 5000); // refresh toutes les 5s
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <ActivityIndicator size="large" />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivi commande #{id}</Text>
      <OrderStatusComponent status={status} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});