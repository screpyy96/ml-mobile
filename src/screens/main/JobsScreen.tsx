import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl, TouchableOpacity, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { JobRequest } from '../../types';
import JobList from './components/JobList';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { Screen, Input, useTheme } from '../../design-system';

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
  const { theme } = useTheme();
  const navigation = useNavigation<JobsScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  
  // State for jobs data
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'nearby'>('all');

  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const scaleAnimation = useRef(new Animated.Value(0.95)).current;

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
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
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

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobs.filter(j => {
      const okTerm = !term || j.title.toLowerCase().includes(term) || (j.description || '').toLowerCase().includes(term) || (j.tradeType || '').toLowerCase().includes(term);
      const okUrgency = !urgentOnly || ['high', 'urgent'].includes(j.urgency || '');
      return okTerm && okUrgency;
    });
  }, [jobs, search, urgentOnly]);

  return (
    <Screen backgroundColor={theme.colors.background.secondary}>
      {/* Premium Hero Header */}
      <Animated.View 
        style={[
          styles.heroHeader,
          { 
            backgroundColor: theme.colors.primary[500],
            paddingTop: insets.top + 20,
            opacity: fadeAnimation,
            transform: [{ translateY: slideAnimation }],
          }
        ]}
      >
        <View style={styles.heroContent}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={[styles.heroTitle, { color: theme.colors.text.inverse }]}>Joburi Disponibile</Text>
              <Text style={[styles.heroSubtitle, { color: `${theme.colors.text.inverse}80` }]}>
                Găsește oportunități perfecte pentru tine
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.filterButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
              onPress={() => {}}
            >
              <Icon name="tune" size={20} color={theme.colors.text.inverse} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: fadeAnimation,
                transform: [{ scale: scaleAnimation }],
              }
            ]}
          >
            <Input
              variant="search"
              placeholder="Caută după titlu, descriere sau categorie"
              value={search}
              onChangeText={setSearch}
              containerStyle={styles.searchInput}
            />
          </Animated.View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh} 
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <Animated.View 
          style={[
            styles.filtersContainer,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            }
          ]}
        >
          <View style={[styles.filtersCard, { backgroundColor: theme.colors.background.primary }]}>
            <View style={styles.filtersHeader}>
              <Text style={[styles.filtersTitle, { color: theme.colors.text.primary }]}>Filtrează rezultatele</Text>
              <Text style={[styles.resultsCount, { color: theme.colors.text.secondary }]}>
                {filteredJobs.length} {filteredJobs.length === 1 ? 'rezultat' : 'rezultate'}
              </Text>
            </View>
            
            <View style={styles.filterTabs}>
              <TouchableOpacity
                onPress={() => {
                  setActiveFilter('all');
                  setUrgentOnly(false);
                }}
                style={[
                  styles.filterTab,
                  activeFilter === 'all' && [styles.filterTabActive, { backgroundColor: theme.colors.primary[500] }]
                ]}
              >
                <Icon 
                  name="work" 
                  size={16} 
                  color={activeFilter === 'all' ? theme.colors.text.inverse : theme.colors.text.secondary} 
                />
                <Text style={[
                  styles.filterTabText,
                  { color: activeFilter === 'all' ? theme.colors.text.inverse : theme.colors.text.secondary }
                ]}>
                  Toate
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setActiveFilter('urgent');
                  setUrgentOnly(true);
                }}
                style={[
                  styles.filterTab,
                  activeFilter === 'urgent' && [styles.filterTabActive, { backgroundColor: theme.colors.accent.red }]
                ]}
              >
                <Icon 
                  name="priority-high" 
                  size={16} 
                  color={activeFilter === 'urgent' ? theme.colors.text.inverse : theme.colors.text.secondary} 
                />
                <Text style={[
                  styles.filterTabText,
                  { color: activeFilter === 'urgent' ? theme.colors.text.inverse : theme.colors.text.secondary }
                ]}>
                  Urgente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setActiveFilter('nearby');
                  setUrgentOnly(false);
                }}
                style={[
                  styles.filterTab,
                  activeFilter === 'nearby' && [styles.filterTabActive, { backgroundColor: theme.colors.accent.green }]
                ]}
              >
                <Icon 
                  name="location-on" 
                  size={16} 
                  color={activeFilter === 'nearby' ? theme.colors.text.inverse : theme.colors.text.secondary} 
                />
                <Text style={[
                  styles.filterTabText,
                  { color: activeFilter === 'nearby' ? theme.colors.text.inverse : theme.colors.text.secondary }
                ]}>
                  Aproape
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Jobs List */}
        <Animated.View
          style={[
            styles.jobsContainer,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            }
          ]}
        >
          <JobList
            jobs={filteredJobs}
            onSave={handleSaveJob}
            onApply={handleApplyJob}
            onView={(jobId) => (navigation as any).navigate('JobDetails', { jobId })}
            onSeeAll={() => {}}
            title="În apropierea ta"
            availableJobsCount={filteredJobs.length}
            showSeeAll={false}
          />
        </Animated.View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroHeader: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContent: {
    zIndex: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  searchContainer: {
    marginTop: 4,
  },
  searchInput: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filtersCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    gap: 6,
  },
  filterTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  jobsContainer: {
    paddingHorizontal: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default JobsScreen;
