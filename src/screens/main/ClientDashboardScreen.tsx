import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import { colors } from '../../constants/colors';
import { JobRequest, Notification } from '../../types';

const { width } = Dimensions.get('window');

interface ClientDashboardStats {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalSpent: number;
  savedWorkers: number;
  pendingOffers: number;
}

const ClientDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'history' | 'workers' | 'profile' | 'settings'>('overview');
  const [stats, setStats] = useState<ClientDashboardStats>({
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    totalSpent: 0,
    savedWorkers: 0,
    pendingOffers: 0,
  });
  const [myRequests, setMyRequests] = useState<JobRequest[]>([]);
  const [savedWorkers, setSavedWorkers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadMyRequests(),
        loadSavedWorkers(),
        loadNotifications(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Eroare', 'Nu s-au putut încărca datele dashboard-ului');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Statistici cereri
      const { data: requestsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user?.id);

      const totalRequests = requestsData?.length || 0;
      const activeRequests = requestsData?.filter(request => request.status === 'in_progress').length || 0;
      const completedRequests = requestsData?.filter(request => request.status === 'completed').length || 0;

      // Joburi salvate
      const { data: savedJobsData } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user?.id);

      // Contacte deblocate
      const { data: contactUnlocksData } = await supabase
        .from('contact_unlocks')
        .select('*')
        .eq('user_id', user?.id);

      setStats({
        totalRequests,
        activeRequests,
        completedRequests,
        totalSpent: 0, // TODO: Implementare calcul cheltuieli
        savedWorkers: contactUnlocksData?.length || 0,
        pendingOffers: activeRequests,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadMyRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          worker:profiles!jobs_worker_id_fkey(name, avatar_url)
        `)
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMyRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const loadSavedWorkers = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_unlocks')
        .select(`
          *,
          worker:profiles!contact_unlocks_job_id_fkey(name, avatar_url, rating)
        `)
        .eq('user_id', user?.id)
        .order('unlocked_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSavedWorkers(data || []);
    } catch (error) {
      console.error('Error loading saved workers:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const createNewRequest = () => {
    // Navigare către crearea unei cereri noi
    Alert.alert('Info', 'Navigare către crearea unei cereri noi');
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* Statistici principale */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="assignment" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{stats.totalRequests}</Text>
          <Text style={styles.statLabel}>Total cereri</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="trending-up" size={24} color={colors.success} />
          <Text style={styles.statNumber}>{stats.activeRequests}</Text>
          <Text style={styles.statLabel}>În progres</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color={colors.success} />
          <Text style={styles.statNumber}>{stats.completedRequests}</Text>
          <Text style={styles.statLabel}>Finalizate</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="euro" size={24} color={colors.warning} />
          <Text style={styles.statNumber}>{stats.totalSpent}€</Text>
          <Text style={styles.statLabel}>Cheltuieli</Text>
        </View>
      </View>

      {/* Buton creare cerere nouă */}
      <TouchableOpacity style={styles.createRequestButton} onPress={createNewRequest}>
        <Icon name="add" size={24} color={colors.white} />
        <Text style={styles.createRequestText}>Creează o cerere nouă</Text>
      </TouchableOpacity>

      {/* Cererile mele recente */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cererile mele recente</Text>
          <TouchableOpacity onPress={() => setActiveTab('requests')}>
            <Text style={styles.seeAllText}>Vezi toate</Text>
          </TouchableOpacity>
        </View>
        {myRequests.slice(0, 3).map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestTitle}>{request.title}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{request.status}</Text>
              </View>
            </View>
            <Text style={styles.requestDescription} numberOfLines={2}>
              {request.description}
            </Text>
            <View style={styles.requestFooter}>
              <Text style={styles.requestLocation}>{request.address}</Text>
              <Text style={styles.requestDate}>
                {new Date(request.created_at).toLocaleDateString('ro-RO')}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Meseriași salvați */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meseriași salvați</Text>
          <TouchableOpacity onPress={() => setActiveTab('workers')}>
            <Text style={styles.seeAllText}>Vezi toți</Text>
          </TouchableOpacity>
        </View>
        {savedWorkers.map((savedWorker) => (
          <View key={savedWorker.id} style={styles.workerCard}>
            <View style={styles.workerHeader}>
              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>{savedWorker.worker?.name || 'Meseriaș'}</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name={star <= (savedWorker.worker?.rating || 0) ? 'star' : 'star-border'}
                      size={16}
                      color={colors.warning}
                    />
                  ))}
                </View>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contactează</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderRequests = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toate cererile mele</Text>
        {myRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestTitle}>{request.title}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{request.status}</Text>
              </View>
            </View>
            <Text style={styles.requestDescription} numberOfLines={3}>
              {request.description}
            </Text>
            <View style={styles.requestFooter}>
              <View style={styles.requestInfo}>
                <Icon name="location-on" size={16} color={colors.textSecondary} />
                <Text style={styles.requestLocation}>{request.address}</Text>
              </View>
              <View style={styles.requestInfo}>
                <Icon name="schedule" size={16} color={colors.textSecondary} />
                <Text style={styles.requestDate}>
                  {new Date(request.created_at).toLocaleDateString('ro-RO')}
                </Text>
              </View>
            </View>
            {request.worker && (
              <View style={styles.assignedWorker}>
                <Text style={styles.assignedWorkerText}>
                  Meseriaș: {request.worker.name}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderHistory = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Istoric cereri</Text>
        {myRequests.filter(request => request.status === 'completed').map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestTitle}>{request.title}</Text>
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>Finalizat</Text>
              </View>
            </View>
            <Text style={styles.requestDescription} numberOfLines={2}>
              {request.description}
            </Text>
            <View style={styles.requestFooter}>
              <Text style={styles.requestLocation}>{request.address}</Text>
              <Text style={styles.requestDate}>
                {new Date(request.created_at).toLocaleDateString('ro-RO')}
              </Text>
            </View>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>Lasă o recenzie</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderWorkers = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meseriași salvați</Text>
        {savedWorkers.map((savedWorker) => (
          <View key={savedWorker.id} style={styles.workerCard}>
            <View style={styles.workerHeader}>
              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>{savedWorker.worker?.name || 'Meseriaș'}</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name={star <= (savedWorker.worker?.rating || 0) ? 'star' : 'star-border'}
                      size={20}
                      color={colors.warning}
                    />
                  ))}
                </View>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contactează</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.workerDate}>
              Salvat pe {new Date(savedWorker.unlocked_at).toLocaleDateString('ro-RO')}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profilul meu</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Icon name="person" size={40} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.profilePhone}>{user?.phone || 'Telefon necompletat'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editează profilul</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistici</Text>
        <View style={styles.statsList}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total cereri</Text>
            <Text style={styles.statValue}>{stats.totalRequests}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Cereri finalizate</Text>
            <Text style={styles.statValue}>{stats.completedRequests}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Meseriași salvați</Text>
            <Text style={styles.statValue}>{stats.savedWorkers}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Setări</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="notifications" size={24} color={colors.textPrimary} />
            <Text style={styles.settingText}>Notificări</Text>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="security" size={24} color={colors.textPrimary} />
            <Text style={styles.settingText}>Securitate</Text>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="payment" size={24} color={colors.textPrimary} />
            <Text style={styles.settingText}>Plăți</Text>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="help" size={24} color={colors.textPrimary} />
            <Text style={styles.settingText}>Ajutor</Text>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'requests':
        return renderRequests();
      case 'history':
        return renderHistory();
      case 'workers':
        return renderWorkers();
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Client</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications" size={24} color={colors.white} />
          {notifications.filter(n => !n.is_read).length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {notifications.filter(n => !n.is_read).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabNavigation}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Cereri ({stats.totalRequests})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Istoric ({stats.completedRequests})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workers' && styles.activeTab]}
          onPress={() => setActiveTab('workers')}
        >
          <Text style={[styles.tabText, activeTab === 'workers' && styles.activeTabText]}>
            Meseriași ({stats.savedWorkers})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Setări
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabNavigation: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  createRequestButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createRequestText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  section: {
    marginBottom: 30,
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
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestTitle: {
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
  statusText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  completedBadge: {
    backgroundColor: colors.info,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  requestDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 20,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  requestDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  assignedWorker: {
    backgroundColor: colors.primaryLight,
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  assignedWorkerText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  reviewButton: {
    backgroundColor: colors.warning,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  reviewButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  workerCard: {
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
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  contactButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  workerDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  profileCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  statsList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  settingsList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 15,
    flex: 1,
  },
});

export default ClientDashboardScreen;
