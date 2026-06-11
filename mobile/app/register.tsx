import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useAuth } from '../src/context/AuthContext';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!nom || !prenom || !email || !telephone || !password) {
      setErrorMsg('Veuillez remplir tous les champs');
      setSnackbarVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas');
      setSnackbarVisible(true);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      await register({ nom, prenom, email, telephone, password });
      setSuccessMsg('Inscription réussie ! Redirection...');
      setSnackbarVisible(true);
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (error: any) {
      let message = 'Échec de l\'inscription';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        message = Object.values(errors).flat()[0];
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      setErrorMsg(message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Inscription</Text>

        <TextInput mode="outlined" label="Nom" value={nom} onChangeText={setNom} style={styles.input} />
        <TextInput mode="outlined" label="Prénom" value={prenom} onChangeText={setPrenom} style={styles.input} />
        <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        <TextInput mode="outlined" label="Téléphone" value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" style={styles.input} />

        <TextInput
          mode="outlined"
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
        />

        <TextInput
          mode="outlined"
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
          right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#e67e22"
        >
          S'inscrire
        </Button>

        <Button mode="text" onPress={() => router.push('/login')} style={styles.linkButton}>
          Déjà un compte ? Connectez-vous
        </Button>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={successMsg ? 2000 : 4000}
          action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
        >
          {errorMsg || successMsg}
        </Snackbar>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  title: { textAlign: 'center', marginBottom: 30, color: '#e67e22', fontWeight: 'bold' },
  input: { marginBottom: 12, backgroundColor: '#fff' },
  button: { marginTop: 10, paddingVertical: 6, borderRadius: 10 },
  linkButton: { marginTop: 16 },
});