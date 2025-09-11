import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const JobSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.title}>Cererea ta a fost trimisă!</Text>
      <Text style={styles.subtitle}>Meseriașii potriviți vor fi notificați în scurt timp.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DashboardStack' as never)}>
        <Text style={styles.buttonText}>Mergi la Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('HomeStack' as never)}>
        <Text style={styles.linkText}>Înapoi acasă</Text>
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
  linkBtn: { marginTop: 12 },
  linkText: { color: '#6b7280' },
});

export default JobSuccessScreen;
