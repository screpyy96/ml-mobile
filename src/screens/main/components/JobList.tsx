import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { JobRequest } from '../../../types';
import { useTheme } from '../../../design-system';

interface JobListProps {
  jobs: JobRequest[];
  onSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
  onView?: (jobId: string) => void;
  onSeeAll: () => void;
  title: string;
  availableJobsCount: number;
  showSeeAll?: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, onSave, onApply, onView, onSeeAll, title, availableJobsCount, showSeeAll = true }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>{title}</Text>
        {showSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary[500] }]}>{`Vezi toate (${availableJobsCount})`}</Text>
          </TouchableOpacity>
        )}
      </View>
      {jobs.length > 0 ? (
        (showSeeAll ? jobs.slice(0, 3) : jobs).map((job) => (
          <View key={job.id} style={[styles.jobCard, { backgroundColor: theme.colors.background.primary }]}>
            {/* Premium Job Header */}
            <View style={styles.jobHeader}>
              <View style={styles.jobTitleContainer}>
                <Text style={[styles.jobTitle, { color: theme.colors.text.primary }]}>{job.title || 'Titlu nespecificat'}</Text>
                {(['high', 'urgent'].includes(job.urgency || '')) && (
                  <View style={[styles.urgentBadge, { backgroundColor: theme.colors.accent.red }]}>
                    <Icon name="priority-high" size={12} color={theme.colors.text.inverse} />
                    <Text style={[styles.urgentText, { color: theme.colors.text.inverse }]}>Urgent</Text>
                  </View>
                )}
              </View>
              <View style={[styles.categoryChip, { backgroundColor: `${theme.colors.primary[500]}15` }]}>
                <Text style={[styles.jobCategory, { color: theme.colors.primary[500] }]}>{job.tradeType || 'Categorie'}</Text>
              </View>
            </View>
            
            {/* Job Description */}
            <Text style={[styles.jobDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>
              {job.description || 'Descriere nespecificată'}
            </Text>
            
            {/* Job Meta Info */}
            <View style={styles.jobMeta}>
              <View style={styles.metaItem}>
                <View style={[styles.metaIcon, { backgroundColor: `${theme.colors.primary[500]}10` }]}>
                  <Icon name="location-on" size={14} color={theme.colors.primary[500]} />
                </View>
                <Text style={[styles.metaText, { color: theme.colors.text.secondary }]}>
                  {job.address?.split(',')[0] || 'Adresă nespecificată'}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <View style={[styles.metaIcon, { backgroundColor: `${theme.colors.accent.green}10` }]}>
                  <Icon name="schedule" size={14} color={theme.colors.accent.green} />
                </View>
                <Text style={[styles.metaText, { color: theme.colors.text.secondary }]}>
                  {job.created_at ? new Date(job.created_at).toLocaleDateString('ro-RO') : 'Data necunoscută'}
                </Text>
              </View>
            </View>
            
            {/* Budget Info */}
            {job.budget && (
              <View style={styles.budgetContainer}>
                <View style={[styles.budgetIcon, { backgroundColor: `${theme.colors.accent.orange}10` }]}>
                  <Icon name="payments" size={16} color={theme.colors.accent.orange} />
                </View>
                <Text style={[styles.budgetText, { color: theme.colors.text.primary }]}>{job.budget}</Text>
              </View>
            )}
            
            {/* Modern Action Buttons */}
            <View style={styles.jobActions}>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: `${theme.colors.text.secondary}08` }]}
                onPress={() => onSave(job.id)}
              >
                <Icon name="bookmark-border" size={18} color={theme.colors.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.colors.primary[500] }]}
                onPress={() => (onView ? onView(job.id) : onApply(job.id))}
              >
                <Text style={[styles.primaryButtonText, { color: theme.colors.text.inverse }]}>
                  {onView ? 'Vezi Detalii' : 'Aplică Acum'}
                </Text>
                <Icon name="arrow-forward" size={16} color={theme.colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: `${theme.colors.text.secondary}10` }]}>
            <Icon name="work-off" size={32} color={theme.colors.text.secondary} />
          </View>
          <Text style={[styles.emptyStateText, { color: theme.colors.text.primary }]}>Nu sunt joburi disponibile momentan</Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.text.secondary }]}>Revino mai târziu pentru lucrări noi</Text>
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
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  jobCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  jobHeader: {
    marginBottom: 12,
  },
  jobTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    lineHeight: 22,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  urgentText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  jobCategory: {
    fontSize: 13,
    fontWeight: '600',
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  metaIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  budgetIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetText: {
    fontSize: 15,
    fontWeight: '700',
  },
  jobActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default JobList;
