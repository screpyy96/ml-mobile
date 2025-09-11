import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../constants/colors';

const { width } = Dimensions.get('window');

interface DashboardStatsProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    averageRating: number;
    totalEarnings: number;
    profileViews: number;
    savedJobs: number;
    contactUnlocks: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <>
      {/* Statistici principale */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="work" size={28} color={colors.primary} />
          <Text style={styles.statNumber}>{String(stats.totalJobs || 0)}</Text>
          <Text style={styles.statLabel}>Total lucrări</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="trending-up" size={28} color={colors.success} />
          <Text style={styles.statNumber}>{String(stats.activeJobs || 0)}</Text>
          <Text style={styles.statLabel}>În progres</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="star" size={28} color={colors.warning} />
          <Text style={styles.statNumber}>{(stats.averageRating || 0).toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating mediu</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="euro" size={28} color={colors.success} />
          <Text style={styles.statNumber}>{`${stats.totalEarnings || 0}€`}</Text>
          <Text style={styles.statLabel}>Câștiguri est.</Text>
        </View>
      </View>

      {/* Statistici secundare */}
      <View style={styles.secondaryStatsGrid}>
        <View style={styles.secondaryStatCard}>
          <Icon name="visibility" size={20} color={colors.info} />
          <Text style={styles.secondaryStatNumber}>{String(stats.profileViews || 0)}</Text>
          <Text style={styles.secondaryStatLabel}>Vizualizări (30z)</Text>
        </View>
        <View style={styles.secondaryStatCard}>
          <Icon name="bookmark" size={20} color={colors.secondary} />
          <Text style={styles.secondaryStatNumber}>{String(stats.savedJobs || 0)}</Text>
          <Text style={styles.secondaryStatLabel}>Joburi salvate</Text>
        </View>
        <View style={styles.secondaryStatCard}>
          <Icon name="contact-phone" size={20} color={colors.error} />
          <Text style={styles.secondaryStatNumber}>{String(stats.contactUnlocks || 0)}</Text>
          <Text style={styles.secondaryStatLabel}>Contacte deblocate</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
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
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  secondaryStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  secondaryStatCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  secondaryStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default DashboardStats;
