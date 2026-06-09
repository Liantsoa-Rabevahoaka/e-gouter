import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  produit_id: number;
  quantite: number;
  prix_unitaire: number;
  produit: {
    id: number;
    nom: string;
    prix: number;
    image: string;
  };
}

interface Cart {
  id: number;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (produitId: number, quantite: number) => Promise<void>;
  updateItem: (itemId: number, quantite: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/panier');
      setCart(res.data);
    } catch (error) {
      console.error('Erreur chargement panier', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (produitId: number, quantite: number) => {
    await api.post('/panier/ajouter', { produit_id: produitId, quantite });
    await fetchCart();
  };

  const updateItem = async (itemId: number, quantite: number) => {
    await api.put(`/panier/item/${itemId}`, { quantite });
    await fetchCart();
  };

  const removeItem = async (itemId: number) => {
    await api.delete(`/panier/item/${itemId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/panier/vider');
    await fetchCart();
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};