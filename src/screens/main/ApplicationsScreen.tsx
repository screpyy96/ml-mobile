import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import ApplicationList from './components/ApplicationList';

type RootStackParamList = {
  WorkerDashboard: undefined;
  Applications: { applications: any[], pendingApplicationsCount: number };
};

type ApplicationsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Applications'
>;

interface ApplicationsScreenProps {
  route?: {
    params?: {
      applications?: any[];
      pendingApplicationsCount?: number;
    };
  };
}

const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({ route }) => {
  // Safely extract params with defaults
  const params = route?.params || {};
  const { 
    applications = [], 
    pendingApplicationsCount = 0 
  } = params;
  
  const navigation = useNavigation<ApplicationsScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <ApplicationList
        applications={applications}
        onSeeAll={() => {}}
        pendingApplicationsCount={pendingApplicationsCount}
        showSeeAll={false}
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

export default ApplicationsScreen;
