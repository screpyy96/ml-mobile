import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../constants/colors';
import { JobRequest } from '../../../types';

interface JobListProps {
  jobs: JobRequest[];
  onSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
  onSeeAll: () => void;
  title: string;
  availableJobsCount: number;
  showSeeAll?: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, onSave, onApply, onSeeAll, title, availableJobsCount, showSeeAll = true }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>{`Vezi toate (${availableJobsCount})`}</Text>
          </TouchableOpacity>
        )}
      </View>
      {jobs.length > 0 ? (
        jobs.slice(0, 3).map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{job.title || 'Titlu nespecificat'}</Text>
              <Text style={styles.jobCategory}>{job.tradeType || 'Categorie'}</Text>
            </View>
            <Text style={styles.jobDescription} numberOfLines={2}>
              {job.description || 'Descriere nespecificată'}
            </Text>
            <View style={styles.jobFooter}>
              <View style={styles.jobInfo}>
                <Icon name="location-on" size={14} color={colors.textSecondary} />
                <Text style={styles.jobLocation}>{job.address || 'Adresă nespecificată'}</Text>
              </View>
              <View style={styles.jobInfo}>
                <Icon name="schedule" size={14} color={colors.textSecondary} />
                <Text style={styles.jobDate}>
                  {job.created_at ? new Date(job.created_at).toLocaleDateString('ro-RO') : 'Data necunoscută'}
                </Text>
              </View>
            </View>
            <View style={styles.jobActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => onSave(job.id)}
              >
                <Icon name="bookmark-border" size={16} color={colors.secondary} />
                <Text style={styles.saveButtonText}>Salvează</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => onApply(job.id)}
              >
                <Text style={styles.applyButtonText}>Aplică</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="work-off" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>Nu sunt joburi disponibile momentan</Text>
          <Text style={styles.emptyStateSubtext}>Revino mai târziu pentru lucrări noi</Text>
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
  jobCard: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  jobCategory: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 20,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  jobDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
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

export default JobList;
