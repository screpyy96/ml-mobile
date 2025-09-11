import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { JobRequest } from '../../types';
import JobList from './components/JobList';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

type RootStackParamList = {
  WorkerDashboard: undefined;
  Jobs: { jobs: JobRequest[], onSave: (jobId: string) => void, onApply: (jobId: string) => void, availableJobsCount: number };
};

type JobsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Jobs'
>;

interface JobsScreenProps {
  route?: {
    params?: {
      jobs?: JobRequest[];
      onSave?: (jobId: string) => void;
      onApply?: (jobId: string) => void;
      availableJobsCount?: number;
    };
  };
}

const JobsScreen: React.FC<JobsScreenProps> = ({ route }) => {
  const { user } = useAuth();
  const navigation = useNavigation<JobsScreenNavigationProp>();
  
  // State for jobs data
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load jobs from database
  const loadJobs = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      let query = supabase
        .from('jobs')
        .select(`
          *,
          client:profiles!jobs_client_id_fkey(name, avatar_url, phone)
        `)
        .eq('status', 'open')
        .is('worker_id', null)
        .order('created_at', { ascending: false });

      // If user is a worker, filter by their trades
      if (user.userType === 'meserias') {
        // Get user's trades from worker_trades table
        const { data: userTrades } = await supabase
          .from('worker_trades')
          .select('trade_ids')
          .eq('profile_id', user.id)
          .single();

        // Filter by user's trades if available
        if (userTrades?.trade_ids && userTrades.trade_ids.length > 0) {
          // Get trade names from trade IDs
          const { data: tradesData } = await supabase
            .from('trades')
            .select('name')
            .in('id', userTrades.trade_ids);

          if (tradesData && tradesData.length > 0) {
            const tradeNames = tradesData.map(trade => trade.name);
            query = query.in('tradeType', tradeNames);
          }
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading jobs:', error);
        Alert.alert('Eroare', 'Nu s-au putut încărca joburile');
        return;
      }

      // Transform data to match JobRequest interface
      const transformedJobs: JobRequest[] = (data || []).map(job => ({
        id: job.id,
        clientId: job.client_id,
        title: job.title,
        description: job.description,
        category: job.tradeType || '',
        city: job.address?.split(',')[0] || '',
        address: job.address || '',
        tradeType: job.tradeType || '',
        budget: job.budget,
        urgency: job.urgency || 'medium',
        status: job.status,
        createdAt: job.created_at,
        created_at: job.created_at,
        deadline: job.deadline,
        offers: [],
        images: job.images || [],
        worker: undefined, // We don't need worker info for job listings
      }));

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert('Eroare', 'Nu s-au putut încărca joburile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, [user?.id]);

  // Handle job save
  const handleSaveJob = async (jobId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          job_id: jobId,
        });

      if (error) throw error;
      
      Alert.alert('Succes', 'Job salvat cu succes!');
    } catch (error) {
      console.error('Error saving job:', error);
      Alert.alert('Eroare', 'Nu s-a putut salva jobul');
    }
  };

  // Handle job apply
  const handleApplyJob = async (jobId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          worker_id: user.id,
          status: 'pending',
        });

      if (error) throw error;
      
      Alert.alert('Succes', 'Aplicație trimisă cu succes!');
    } catch (error) {
      console.error('Error applying to job:', error);
      Alert.alert('Eroare', 'Nu s-a putut trimite aplicația');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
        />
      }
    >
      <JobList
        jobs={jobs}
        onSave={handleSaveJob}
        onApply={handleApplyJob}
        onSeeAll={() => {}}
        title="Joburi disponibile"
        availableJobsCount={jobs.length}
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

export default JobsScreen;
