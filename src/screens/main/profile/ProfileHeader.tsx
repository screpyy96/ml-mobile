import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-paper';

interface Props {
  name: string;
  email?: string;
  userType: 'meserias' | 'client' | string;
  topInset?: number;
  onEdit: () => void;
  onLogout: () => void;
}

export const ProfileHeader: React.FC<Props> = ({ name, email, userType, topInset = 0, onEdit, onLogout }) => {
  return (
    <View style={[styles.headerGradient, { paddingTop: topInset + 12 }]}>
      <View style={styles.headerRow}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{userType === 'meserias' ? '👨‍🔧' : '👤'}</Text>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName} numberOfLines={1}>
              {name || 'Utilizator'}
            </Text>
            {!!email && (
              <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
                {email}
              </Text>
            )}
            <View style={styles.userTypeContainer}>
              <Icon name={userType === 'meserias' ? 'build' : 'person'} size={16} color="#fff" />
              <Text style={styles.userType}>{userType === 'meserias' ? 'Meseriaș' : 'Client'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <Button mode="contained" onPress={onEdit} style={styles.roundBtn} contentStyle={styles.roundBtnContent}>
            <Icon name="edit" size={18} color="#fff" />
          </Button>
          <Button mode="outlined" onPress={onLogout} style={styles.roundBtnOutline} contentStyle={styles.roundBtnContent}>
            <Icon name="logout" size={18} color="#fff" />
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: 24,
    backgroundColor: '#667eea',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
  },
  profileInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: { fontSize: 56 },
  onlineIndicator: {
    position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#fff',
  },
  userDetails: { flex: 1, minWidth: 0 },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 2 },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.95)', marginBottom: 6 },
  userTypeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userType: { fontSize: 14, color: '#fff', fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roundBtn: { borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.25)', borderWidth: 0 },
  roundBtnOutline: { borderRadius: 12, borderColor: 'rgba(255,255,255,0.4)' },
  roundBtnContent: { width: 40, height: 40 },
});

export default ProfileHeader;

