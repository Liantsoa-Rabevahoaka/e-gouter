import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/commandes');
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur fetchOrders', error);
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async (orderId) => {
    const response = await api.get(`/commande/${orderId}/suivi`);
    return response.data;
  };

  const validateOrder = async (mode_paiement, adresse_livraison) => {
    const response = await api.post('/commande/valider', { mode_paiement, adresse_livraison });
    await fetchOrders(); // Rafraîchir l'historique
    return response.data.commande;
  };

  const simulatePayment = async (commandeId) => {
    const response = await api.post(`/paiement/simuler/${commandeId}`);
    return response.data;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        trackOrder,
        validateOrder,
        simulatePayment,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};