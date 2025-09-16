import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Item { icon: string; title: string; subtitle: string; }
interface Props { title: string; items: Item[]; }

export const ProfileSettings: React.FC<Props> = ({ title, items }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.list}>
        {items.map((it) => (
          <View key={it.title} style={styles.item}>
            <View style={styles.iconWrap}><MCIcon name={it.icon} size={22} color="#1d4ed8" /></View>
            <View style={styles.content}>
              <Text style={styles.itemTitle}>{it.title}</Text>
              <Text style={styles.itemSubtitle}>{it.subtitle}</Text>
            </View>
            <MCIcon name="chevron-right" size={22} color="#64748b" />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginBottom: 20, borderRadius: 16, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#c7d2fe' },
  content: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  itemSubtitle: { fontSize: 13, color: '#64748b' },
});

export default ProfileSettings;

