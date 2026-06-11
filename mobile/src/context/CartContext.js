import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/panier');
      setCart(response.data);
    } catch (error) {
      console.error('Erreur fetchCart', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (produitId, quantite = 1) => {
    try {
      await api.post('/panier/ajouter', { produit_id: produitId, quantite });
      await fetchCart();
    } catch (error) {
      console.error('Erreur addItem', error);
      throw error;
    }
  };

  const updateItem = async (itemId, quantite) => {
    try {
      await api.put(`/panier/item/${itemId}`, { quantite });
      await fetchCart();
    } catch (error) {
      console.error('Erreur updateItem', error);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/panier/item/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error('Erreur removeItem', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/panier/vider');
      await fetchCart();
    } catch (error) {
      console.error('Erreur clearCart', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const total = cart?.items?.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        total,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};