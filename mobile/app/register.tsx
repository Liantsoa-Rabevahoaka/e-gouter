import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [nom, setNom] = React.useState('');
  const [prenom, setPrenom] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [telephone, setTelephone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register({ nom, prenom, email, telephone, password });
      router.replace('/');
    } catch (error) {
      Alert.alert('Erreur', 'Inscription échouée');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
      <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Téléphone" value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#e67e22' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#e67e22', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 16, color: '#e67e22' },
});