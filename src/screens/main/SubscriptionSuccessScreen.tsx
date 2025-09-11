import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SubscriptionSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Abonament activat cu succes!</Text>
      <Text style={styles.subtitle}>Ai acum acces la toate beneficiile planului ales.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Înapoi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  subtitle: { marginTop: 8, textAlign: 'center', color: '#6b7280' },
  button: { marginTop: 20, backgroundColor: '#111827', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default SubscriptionSuccessScreen;
