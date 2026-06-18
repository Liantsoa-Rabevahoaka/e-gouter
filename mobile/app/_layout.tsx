// app/_layout.tsx
import { Stack, Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import { OrderProvider } from '../src/context/OrderContext';
import { useAuth } from '../src/context/AuthContext';
import { Redirect } from 'expo-router';

// Layout conditionnel : si non authentifié, afficher les écrans d'auth
function ConditionalLayout() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null; // ou un écran de chargement
  }

  if (!user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
      </Stack>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <AuthProvider>
            <CartProvider>
              <OrderProvider>
                <ConditionalLayout />
              </OrderProvider>
            </CartProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}