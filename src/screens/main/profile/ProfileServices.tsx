import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  services: string[];
}

export const ProfileServices: React.FC<Props> = ({ services }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>🛠️ Servicii oferite</Text>
      <View style={styles.servicesWrap}>
        {services.map((s) => (
          <View key={s} style={styles.chip}><Text style={styles.chipText}>{s}</Text></View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  servicesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#1d4ed8', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  chipText: { color: '#fff', fontWeight: '700' },
});

export default ProfileServices;

