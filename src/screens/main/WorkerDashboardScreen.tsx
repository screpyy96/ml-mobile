import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '../../design-system';

import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import { colors } from '../../constants/colors';
import { JobRequest, Review, Notification } from '../../types';
import { useNavigation } from '@react-navigation/native';

import DashboardHeader from './components/DashboardHeader';
import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import StatusToggle from './components/StatusToggle';
import JobList from './components/JobList';
import ApplicationList from './components/ApplicationList';
import ReviewList from './components/ReviewList';
import NotificationList from './components/NotificationList';



interface DashboardStatsData {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  availableJobs: number;
  pendingApplications: number;
  savedJobs: number;
  contactUnlocks: number;
  profileViews: number;
}

const WorkerDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  
  const [stats, setStats] = useState<DashboardStatsData>({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
    availableJobs: 0,
    pendingApplications: 0,
    savedJobs: 0,
    contactUnlocks: 0,
    profileViews: 0,
  });
  const [availableJobs, setAvailableJobs] = useState<JobRequest[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobRequest[]>([]);
  const [contactUnlocks, setContactUnlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadAvailableJobs(),
        loadMyApplications(),
        loadReviews(),
        loadNotifications(),
        loadSavedJobs(),
        loadContactUnlocks(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Eroare', 'Nu s-au putut încărca datele dashboard-ului');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadStats = async () => {
    try {
      // Statistici joburi
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('worker_id', user?.id);

      const totalJobs = jobsData?.length || 0;
      const activeJobs = jobsData?.filter(job => job.status === 'in_progress').length || 0;
      const completedJobs = jobsData?.filter(job => job.status === 'completed').length || 0;

      // Statistici recenzii
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating')
        .eq('worker_id', user?.id);

      const totalReviews = reviewsData?.length || 0;
      const averageRating = reviewsData && reviewsData.length > 0
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length
        : 0;

      // Joburi disponibile pentru meseriașul curent
      const { data: availableJobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .is('worker_id', null);

      // Aplicații în așteptare
      const { data: applicationsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('worker_id', user?.id)
        .neq('status', 'completed');

      // Joburi salvate
      const { data: savedJobsData } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user?.id);

      // Contact unlocks
      const { data: contactUnlocksData } = await supabase
        .from('contact_unlocks')
        .select('*')
        .eq('user_id', user?.id);

      // Profile views (ultimele 30 de zile)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: profileViewsData } = await supabase
        .from('profile_views')
        .select('*')
        .eq('profile_id', user?.id)
        .gte('viewed_at', thirtyDaysAgo.toISOString());

      setStats({
        totalJobs,
        activeJobs,
        completedJobs,
        totalEarnings: completedJobs * 150, // Estimare câștiguri
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        availableJobs: availableJobsData?.length || 0,
        pendingApplications: applicationsData?.length || 0,
        savedJobs: savedJobsData?.length || 0,
        contactUnlocks: contactUnlocksData?.length || 0,
        profileViews: profileViewsData?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadAvailableJobs = async () => {
    try {
      // Get user's trades from worker_trades table
      const { data: userTrades } = await supabase
        .from('worker_trades')
        .select('trade_ids')
        .eq('profile_id', user?.id)
        .single();

      // Build query for available jobs
      let query = supabase
        .from('jobs')
        .select(`
          *,
          client:profiles!jobs_client_id_fkey(name, avatar_url, phone)
        `)
        .eq('status', 'open')
        .is('worker_id', null)
        .order('created_at', { ascending: false })
        .limit(20);

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

      const { data, error } = await query;

      if (error) throw error;
      setAvailableJobs(data || []);
    } catch (error) {
      console.error('Error loading available jobs:', error);
    }
  };

  const loadMyApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          client:profiles!jobs_client_id_fkey(name, avatar_url, phone)
        `)
        .eq('worker_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMyApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          client:profiles!reviews_client_id_fkey(name, avatar_url)
        `)
        .eq('worker_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          job:jobs!saved_jobs_job_id_fkey(
            *,
            client:profiles!jobs_client_id_fkey(name, avatar_url)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSavedJobs(data?.map(item => item.job).filter(Boolean) || []);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const loadContactUnlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_unlocks')
        .select(`
          *,
          job:jobs!contact_unlocks_job_id_fkey(
            *,
            client:profiles!jobs_client_id_fkey(name, avatar_url, phone)
          )
        `)
        .eq('user_id', user?.id)
        .order('unlocked_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setContactUnlocks(data || []);
    } catch (error) {
      console.error('Error loading contact unlocks:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const applyForJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          worker_id: user?.id,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('status', 'open');

      if (error) throw error;

      // Create notification for client
      await supabase
        .from('notifications')
        .insert({
          user_id: (availableJobs.find(job => job.id === jobId) as any)?.client_id,
          title: 'Aplicație nouă',
          message: `${user?.name || 'Un meseriaș'} a aplicat pentru jobul tău`,
          type: 'info',
          link: `/jobs/${jobId}`
        });

      Alert.alert('Succes', 'Aplicația a fost trimisă cu succes!');
      loadDashboardData();
    } catch (error) {
      console.error('Error applying for job:', error);
      Alert.alert('Eroare', 'Nu s-a putut trimite aplicația');
    }
  };

  const saveJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user?.id,
          job_id: jobId
        });

      if (error) throw error;

      Alert.alert('Succes', 'Jobul a fost salvat!');
      loadDashboardData();
    } catch (error) {
      console.error('Error saving job:', error);
      Alert.alert('Eroare', 'Nu s-a putut salva jobul');
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      const { error } = await supabase
        .from('profiles')
        .update({
          is_online: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      setIsOnline(newStatus);
      Alert.alert(
        'Status actualizat',
        `Ești acum ${newStatus ? 'disponibil' : 'indisponibil'} pentru lucru`
      );
    } catch (error) {
      console.error('Error updating online status:', error);
      Alert.alert('Eroare', 'Nu s-a putut actualiza statusul');
    }
  };

  const handleNavigate = (screen: string) => {
    // Navigate to nested routes within WorkerDashboard stack
    // Known screens: 'Jobs', 'Applications', 'SavedJobs', 'Settings', 'Subscription', 'Reviews'
    navigation.navigate(screen as never);
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Se încarcă dashboard-ul...</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <DashboardStats stats={stats} />
        <QuickActions onNavigate={handleNavigate} />
        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  

  

  const insets = useSafeAreaInsets();

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']} backgroundColor={colors.backgroundSecondary}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={{ paddingTop: insets.top }}>
        <DashboardHeader userName={user?.name} notifications={notifications} />
      </View>

      

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderOverview()}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 15,
  },
  tabContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  tabScrollContent: {
    paddingHorizontal: 15,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'red',
    minWidth: 70,
    justifyContent: 'center',
  },
  activeTabItem: {
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  activeTabLabel: {
    color: colors.primary,
  },
  countBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  countText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    padding: 20,
  },
});

export default WorkerDashboardScreen;
