import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}