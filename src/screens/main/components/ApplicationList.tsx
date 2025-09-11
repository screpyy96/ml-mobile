import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../constants/colors';

interface ApplicationListProps {
  applications: any[];
  onSeeAll: () => void;
  pendingApplicationsCount: number;
  showSeeAll?: boolean;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications, onSeeAll, pendingApplicationsCount, showSeeAll = true }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Aplicațiile mele</Text>
        {showSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>{`Vezi toate (${pendingApplicationsCount})`}</Text>
          </TouchableOpacity>
        )}
      </View>
      {applications.length > 0 ? (
        applications.slice(0, 2).map((application) => (
          <View key={application.id} style={styles.applicationCard}>
            <View style={styles.applicationHeader}>
              <Text style={styles.applicationTitle}>{application.title}</Text>
              <View style={[styles.statusBadge,
              application.status === 'accepted' ? styles.statusAccepted :
                application.status === 'pending' ? styles.statusPending :
                  styles.statusRejected
              ]}>
                <Text style={styles.statusText}>
                  {application.status === 'accepted' ? 'Acceptat' :
                    application.status === 'pending' ? 'În așteptare' :
                      'Respins'}
                </Text>
              </View>
            </View>
            <Text style={styles.applicationLocation}>{application.address}</Text>
            <Text style={styles.applicationDate}>
              {new Date(application.created_at).toLocaleDateString('ro-RO')}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="assignment" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>Nu ai aplicații momentan</Text>
          <Text style={styles.emptyStateSubtext}>Aplică la joburi pentru a începe să lucrezi</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  applicationCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAccepted: {
    backgroundColor: colors.success,
  },
  statusPending: {
    backgroundColor: colors.warning,
  },
  statusRejected: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  applicationLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  applicationDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ApplicationList;
