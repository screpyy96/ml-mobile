import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../constants/colors';

const { width } = Dimensions.get('window');

interface QuickActionsProps {
  onNavigate: (screen: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Acțiuni rapide</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('Jobs')}>
          <Icon name="search" size={24} color={colors.primary} />
          <Text style={styles.quickActionText}>Caută joburi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('Applications')}>
          <Icon name="schedule" size={24} color={colors.success} />
          <Text style={styles.quickActionText}>Programări</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('SavedJobs')}>
          <Icon name="payment" size={24} color={colors.warning} />
          <Text style={styles.quickActionText}>Plăți</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('Subscription')}>
          <Icon name="star" size={24} color={colors.primary} />
          <Text style={styles.quickActionText}>Abonament</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('Settings')}>
          <Icon name="support-agent" size={24} color={colors.error} />
          <Text style={styles.quickActionText}>Suport</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default QuickActions;