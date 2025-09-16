import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { Button } from '../../../../design-system';
import { useTheme } from '../../../../design-system';

interface MeseriasCardProps {
  meserias: any;
  onPress: () => void;
}

export const MeseriasCard: React.FC<MeseriasCardProps> = ({ meserias, onPress }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const renderTradeChips = (trades: any[] = []) => {
    if (!trades || trades.length === 0) return null;
    const visible = trades.slice(0, 3);
    const extra = trades.length - visible.length;
    
    return (
      <View style={styles.tradeChipsRow}>
        {visible.map((t: any) => (
          <View key={t.id || t.name} style={styles.tradeChip}>
            <Text style={styles.tradeChipText}>{t.name}</Text>
          </View>
        ))}
        {extra > 0 && (
          <View style={[styles.tradeChip, styles.tradeChipExtra]}>
            <Text style={[styles.tradeChipText, { color: '#0f172a' }]}>+{extra}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.meseriasCard, { backgroundColor: theme.colors.background.primary }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Header: Avatar mare + Nume + badge verificat */}
      <View style={styles.headerRow}>
        {meserias.avatar_url ? (
          <Image source={{ uri: meserias.avatar_url }} style={styles.avatarLarge} />
        ) : (
          <View style={[styles.avatarLarge, styles.avatarLargeFallback, { backgroundColor: theme.colors.primary[500] }]}>
            <Text style={styles.avatarLargeText}>{meserias.name?.charAt(0)?.toUpperCase() || 'M'}</Text>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.meseriasNameLarge, { color: theme.colors.text.primary }]} numberOfLines={1}>
            {meserias.name || 'Meseriaș'}
          </Text>
          {meserias.is_verified && (
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedIcon}>✔︎</Text>
              <Text style={styles.verifiedText}>VERIFICAT</Text>
            </View>
          )}
        </View>
      </View>

      {/* Address pill */}
      {meserias.address ? (
        <View style={styles.addressPill}>
          <Text style={styles.addressIcon}>📍</Text>
          <Text style={styles.addressText} numberOfLines={1}>{meserias.address}</Text>
        </View>
      ) : null}

      {/* Bio bubble */}
      {meserias.bio ? (
        <View style={styles.bioBubble}>
          <Text style={styles.bioText} numberOfLines={3}>{meserias.bio}</Text>
        </View>
      ) : null}

      {/* Trades chips */}
      {renderTradeChips(meserias.trades)}

      {/* Footer: Meta (rating, recenzii, locație) + Vezi profil */}
      <View style={styles.meseriasFooter}>
        <View style={styles.meseriasMetaRow}>
          <Text style={[styles.ratingText, { color: theme.colors.text.primary }]}>
            ⭐ {meserias.rating ? Number(meserias.rating).toFixed(1) : '4.5'}
          </Text>
          <Text style={[styles.reviewCount, { color: theme.colors.text.secondary }]}>• 0 recenzii</Text>
          <Text style={[styles.meseriasLocation, { color: theme.colors.text.secondary }]}>• 📍 {meserias.address || 'București'}</Text>
        </View>
      </View>

      {/* CTA buttons full-width */}
      <View style={styles.ctaColumn}>
        <Button
          title="Vezi Profilul"
          fullWidth
          size="large"
          onPress={onPress}
          style={{ backgroundColor: '#0F172A', borderRadius: 20 }}
          textStyle={{ color: '#fff', fontWeight: '700' }}
        />
        <Button
          title="Sună Acum"
          fullWidth
          size="large"
          leftIcon="phone"
          onPress={() => meserias.phone && Linking.openURL(`tel:${meserias.phone}`)}
          style={{ backgroundColor: theme.colors.accent.green, borderRadius: 20 }}
          textStyle={{ color: '#fff', fontWeight: '700' }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  meseriasCard: {
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  headerRow: { 
    flexDirection: 'row' as const, 
    alignItems: 'center' as const, 
    marginBottom: 16 
  },
  avatarLarge: { 
    width: 76, 
    height: 76, 
    borderRadius: 20 
  },
  avatarLargeFallback: { 
    justifyContent: 'center' as const, 
    alignItems: 'center' as const 
  },
  avatarLargeText: { 
    color: '#fff', 
    fontSize: 30, 
    fontWeight: '800' as const 
  },
  meseriasNameLarge: { 
    fontSize: 24, 
    fontWeight: '800' as const 
  },
  verifiedPill: {
    marginTop: 8,
    alignSelf: 'flex-start' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verifiedIcon: { 
    color: '#059669', 
    fontSize: 14 
  },
  verifiedText: { 
    color: '#065F46', 
    fontWeight: '700' as const, 
    fontSize: 12, 
    letterSpacing: 0.3 
  },
  addressPill: {
    marginTop: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'flex-start' as const,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressIcon: { 
    fontSize: 12, 
    marginRight: 6 
  },
  addressText: { 
    fontSize: 13, 
    color: '#0f172a', 
    fontWeight: '600' as const 
  },
  bioBubble: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bioText: { 
    fontSize: 14, 
    color: '#0f172a' 
  },
  meseriasFooter: {
    marginTop: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  meseriasMetaRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
  },
  meseriasLocation: {
    fontSize: 12,
  },
  tradeChipsRow: { 
    flexDirection: 'row' as const, 
    flexWrap: 'wrap' as const, 
    gap: 6, 
    marginBottom: 6 
  },
  tradeChip: { 
    backgroundColor: '#EEF2FF', 
    borderWidth: 1, 
    borderColor: '#C7D2FE', 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 18, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    elevation: 1 
  },
  tradeChipText: { 
    fontSize: 13, 
    color: '#1e293b', 
    fontWeight: '600' as const 
  },
  tradeChipExtra: { 
    backgroundColor: '#E2E8F0', 
    borderColor: '#CBD5E1' 
  },
  ctaColumn: { 
    marginTop: 16, 
    gap: 14 
  },
};
