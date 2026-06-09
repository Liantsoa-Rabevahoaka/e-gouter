import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface Order {
  id: number;
  numero_commande: string;
  montant_total: number;
  statut: string;
  mode_paiement: string;
  adresse_livraison: string;
  created_at: string;
  details: any[];
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  trackOrder: (orderId: number) => Promise<{ statut: string }>;
  validateOrder: (mode_paiement: string, adresse_livraison: string) => Promise<Order>;
  simulatePayment: (commandeId: number) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/commandes');
      setOrders(res.data);
    } catch (error) {
      console.error('Erreur historique', error);
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async (orderId: number) => {
    const res = await api.get(`/commande/${orderId}/suivi`);
    return res.data;
  };

  const validateOrder = async (mode_paiement: string, adresse_livraison: string) => {
    const res = await api.post('/commande/valider', { mode_paiement, adresse_livraison });
    await fetchOrders();
    return res.data;
  };

  const simulatePayment = async (commandeId: number) => {
    await api.post(`/paiement/simuler/${commandeId}`);
    await fetchOrders();
  };

  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders, trackOrder, validateOrder, simulatePayment }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};