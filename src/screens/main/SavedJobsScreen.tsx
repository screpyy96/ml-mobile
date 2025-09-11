import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { JobRequest } from '../../types';
import JobList from './components/JobList';

type RootStackParamList = {
  WorkerDashboard: undefined;
  SavedJobs: { jobs: JobRequest[], onSave: (jobId: string) => void, onApply: (jobId: string) => void, availableJobsCount: number };
};

type SavedJobsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SavedJobs'
>;

interface SavedJobsScreenProps {
  route?: {
    params?: {
      jobs?: JobRequest[];
      onSave?: (jobId: string) => void;
      onApply?: (jobId: string) => void;
      availableJobsCount?: number;
    };
  };
}

const SavedJobsScreen: React.FC<SavedJobsScreenProps> = ({ route }) => {
  // Safely extract params with defaults
  const params = route?.params || {};
  const { 
    jobs = [], 
    onSave = () => {}, 
    onApply = () => {}, 
    availableJobsCount = 0 
  } = params;
  
  const navigation = useNavigation<SavedJobsScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <JobList
        jobs={jobs}
        onSave={onSave}
        onApply={onApply}
        onSeeAll={() => {}}
        title="Joburi salvate"
        availableJobsCount={availableJobsCount}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: 20,
  },
});

export default SavedJobsScreen;
