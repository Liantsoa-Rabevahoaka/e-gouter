import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Snackbar, IconButton } from 'react-native-paper';
import { useAuth } from '../src/context/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Veuillez remplir tous les champs');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.email?.[0] || 'Échec de connexion';
      setErrorMsg(message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text variant="displaySmall" style={styles.title}>E-Goûter</Text>
        <Text variant="headlineSmall" style={styles.subtitle}>Connexion</Text>

        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />

        <TextInput
          mode="outlined"
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#e67e22"
        >
          Se connecter
        </Button>

        <Button
          mode="text"
          onPress={() => router.push('/register')}
          style={styles.linkButton}
        >
          Pas de compte ? Inscrivez-vous
        </Button>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
        >
          {errorMsg}
        </Snackbar>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  title: { textAlign: 'center', marginBottom: 8, color: '#e67e22', fontWeight: 'bold' },
  subtitle: { textAlign: 'center', marginBottom: 30, color: '#555' },
  input: { marginBottom: 16, backgroundColor: '#fff' },
  button: { marginTop: 10, paddingVertical: 6, borderRadius: 10 },
  linkButton: { marginTop: 16 },
});