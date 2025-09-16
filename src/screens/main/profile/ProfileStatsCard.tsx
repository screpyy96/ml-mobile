import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Stats {
  completedJobs: number;
  averageRating: number;
  satisfactionRate: number;
  postedRequests?: number;
}

interface Props {
  title: string;
  stats: Stats;
}

export const ProfileStatsCard: React.FC<Props> = ({ title, stats }) => {
  return (
    <View style={styles.cardWrap}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <View style={styles.item}>
            <View style={styles.circle}><Text style={styles.number}>{stats.completedJobs || 0}</Text></View>
            <Text style={styles.label}>Lucrări finalizate</Text>
          </View>
          <View style={styles.item}>
            <View style={styles.circle}><Text style={styles.number}>{stats.averageRating || 0}</Text></View>
            <Text style={styles.label}>Rating mediu</Text>
          </View>
          <View style={styles.item}>
            <View style={styles.circle}><Text style={styles.number}>{(stats.satisfactionRate || 0)}%</Text></View>
            <Text style={styles.label}>Rata de satisfacție</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrap: { marginTop: -24, paddingHorizontal: 20 },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#5b7cfa',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12,
  },
  title: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { alignItems: 'center', flex: 1 },
  circle: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  number: { color: '#fff', fontSize: 18, fontWeight: '800' },
  label: { color: 'rgba(255,255,255,0.95)', fontSize: 12, textAlign: 'center' },
});

export default ProfileStatsCard;

