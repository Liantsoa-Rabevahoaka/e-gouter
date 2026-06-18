import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const STATUS_STEPS = [
  { key: 'en attente de paiement', label: 'En attente', icon: 'payment' },
  { key: 'payée', label: 'Payée', icon: 'check-circle' },
  { key: 'en préparation', label: 'Préparation', icon: 'restaurant' },
  { key: 'en livraison', label: 'Livraison', icon: 'local-shipping' },
  { key: 'livrée', label: 'Livrée', icon: 'done-all' },
  { key: 'annulée', label: 'Annulée', icon: 'cancel' },
];

const getStepIndex = (status) => {
  const index = STATUS_STEPS.findIndex(s => s.key === status);
  return index === -1 ? 0 : index;
};

export default function OrderStatus({ status }) {
  const currentStep = getStepIndex(status);
  const totalSteps = STATUS_STEPS.length - 1; // exclure "annulée" du total
  const progress = status === 'annulée' ? 0 : currentStep / totalSteps;

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {STATUS_STEPS.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          const isAnnuled = status === 'annulée';

          return (
            <View key={step.key} style={styles.stepItem}>
              <View style={[styles.iconCircle, isActive && !isAnnuled ? styles.activeCircle : null, isAnnuled && index === 0 ? styles.cancelCircle : null]}>
                <MaterialIcons
                  name={step.icon}
                  size={20}
                  color={isActive && !isAnnuled ? '#fff' : '#999'}
                />
              </View>
              {index < STATUS_STEPS.length - 1 && (
                <View style={[styles.line, isActive && !isAnnuled ? styles.activeLine : null]} />
              )}
              <Text style={[styles.stepLabel, isActive && !isAnnuled ? styles.activeLabel : null]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
      <ProgressBar progress={progress} color="#e67e22" style={styles.progressBar} />
      <Text style={styles.statusText}>Statut : {status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 16, paddingHorizontal: 8 },
  stepsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stepItem: { alignItems: 'center', flex: 1 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeCircle: { backgroundColor: '#e67e22' },
  cancelCircle: { backgroundColor: '#ff4444' },
  line: { flex: 1, height: 2, backgroundColor: '#ddd', marginHorizontal: 4, alignSelf: 'center' },
  activeLine: { backgroundColor: '#e67e22' },
  stepLabel: { fontSize: 10, color: '#999', textAlign: 'center' },
  activeLabel: { color: '#333', fontWeight: 'bold' },
  progressBar: { height: 6, borderRadius: 3, marginVertical: 8 },
  statusText: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 4 },
});