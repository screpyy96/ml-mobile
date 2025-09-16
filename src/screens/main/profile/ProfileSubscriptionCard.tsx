import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  planId?: string;
  status?: string;
  credits?: number;
  onManage?: () => void;
  onUpgrade?: () => void;
}

export const ProfileSubscriptionCard: React.FC<Props> = ({ planId = 'basic', status = 'active', credits = 0, onManage, onUpgrade }) => {
  const isBasic = planId === 'basic';
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Abonament</Text>
      <View style={styles.row}>
        <View style={[styles.badge, isBasic ? styles.badgeBasic : styles.badgePremium]}>
          <Text style={styles.badgeText}>{isBasic ? 'BASIC' : String(planId).toUpperCase()}</Text>
        </View>
        <View style={styles.dot} />
        <Text style={styles.status}>Status: <Text style={styles.statusBold}>{status}</Text></Text>
      </View>
      <Text style={styles.credits}>Credite: <Text style={styles.statusBold}>{credits}</Text></Text>
      <View style={{ marginTop: 12, gap: 10 }}>
        {isBasic ? (
          <TouchableOpacity style={styles.ctaPrimary} onPress={onUpgrade} activeOpacity={0.9}>
            <Text style={styles.ctaPrimaryText}>Upgrade la Premium</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.ctaManage} onPress={onManage} activeOpacity={0.9}>
            <Text style={styles.ctaManageText}>Gestionează Abonamentul</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { margin: 20, borderRadius: 16, backgroundColor: '#fff', padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  badgeBasic: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  badgePremium: { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' },
  badgeText: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  status: { fontSize: 14, color: '#0f172a' },
  statusBold: { fontWeight: '700' },
  credits: { fontSize: 14, color: '#0f172a' },
  ctaPrimary: { backgroundColor: '#0F172A', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  ctaPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  ctaManage: { backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  ctaManageText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default ProfileSubscriptionCard;

