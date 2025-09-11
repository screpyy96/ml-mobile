import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, TouchableOpacity, Text, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../constants/categories';
import { supabase } from '../../config/supabase';
import {
  Button,
  Card,
  JobCard,
  CompactJobCard,
  Input,
  Avatar,
  SkeletonCard,
  SkeletonList,
  useTheme,
  useSuccessToast
} from '../../design-system';
import {
  createFadeAnimation,
  createSlideAnimation,
  createStaggerAnimation,
  createScaleAnimation
} from '../../design-system/utils/animations';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const showSuccessToast = useSuccessToast();
  const navigation = useNavigation();

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  
  // Real jobs data from database
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const heroScaleAnimation = useRef(new Animated.Value(0.95)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Category animations
  const categoryAnimations = useRef(
    categories.slice(0, 6).map(() => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Azi';
    if (diffDays === 2) return 'Ieri';
    if (diffDays <= 7) return `Acum ${diffDays - 1} zile`;
    return date.toLocaleDateString('ro-RO');
  };

  // Fetch recent jobs from database
  const fetchRecentJobs = async () => {
    try {
      setJobsLoading(true);
      
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          description,
          status,
          address,
          tradeType,
          created_at,
          client_id,
          budget,
          urgency,
          jobType
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      // Get client names for the jobs
      const clientIds = jobs?.map(job => job.client_id).filter(Boolean) || [];
      let clientNames: { [key: string]: string } = {};
      
      if (clientIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', clientIds);
        
        if (!profilesError && profiles) {
          clientNames = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.name || 'Anonim';
            return acc;
          }, {} as { [key: string]: string });
        }
      }

      // Get contact unlock counts for jobs
      const jobIds = jobs?.map(job => job.id) || [];
      let contactUnlockCounts: { [key: string]: number } = {};
      
      if (jobIds.length > 0) {
        try {
          const { data: contactUnlocks, error: contactUnlocksError } = await supabase
            .from('contact_unlocks')
            .select('job_id')
            .in('job_id', jobIds);

          if (!contactUnlocksError && contactUnlocks) {
            contactUnlockCounts = contactUnlocks.reduce((acc, unlock) => {
              acc[unlock.job_id] = (acc[unlock.job_id] || 0) + 1;
              return acc;
            }, {} as { [key: string]: number });
          }
        } catch (error) {
          // If contact_unlocks table doesn't exist, default to 0 and log in dev
          if (__DEV__) {
            console.warn('contact_unlocks table unavailable; defaulting unlock counts to 0');
          }
          jobIds.forEach(jobId => {
            contactUnlockCounts[jobId] = 0;
          });
        }
      }

      // Transform data for the UI
      const transformedJobs = jobs?.map(job => {
        return {
          id: job.id,
          title: job.title,
          description: job.description,
          category: job.tradeType,
          status: job.status,
          budget: job.budget || '100-500 RON',
          location: job.address,
          createdAt: formatDate(job.created_at),
          offers: contactUnlockCounts[job.id] || 0,
          client: clientNames[job.client_id] || 'Anonim',
          isUrgent: job.urgency === 'urgent' || job.urgency === 'high',
        };
      }) || [];

      setRecentJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch real data
    fetchRecentJobs();
    
    // Simulate loading with staggered completion
    const categoriesTimer = setTimeout(() => {
      setCategoriesLoading(false);
    }, 800);

    const mainTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Hero entrance animation
    const heroAnimation = Animated.parallel([
      createFadeAnimation(fadeAnimation, 1, 800),
      createSlideAnimation(slideAnimation, 0, 600),
      Animated.timing(heroScaleAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // Staggered category animations
    const categoryStaggerAnimation = createStaggerAnimation(
      categoryAnimations.map(({ scale, opacity }) =>
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          createFadeAnimation(opacity, 1, 400),
        ])
      ),
      150
    );

    // Start animations
    heroAnimation.start(() => {
      categoryStaggerAnimation.start();
    });

    return () => {
      clearTimeout(categoriesTimer);
      clearTimeout(mainTimer);
    };
  }, []);

  const renderClientHome = () => (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
    >
      {/* Hero Section */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            backgroundColor: theme.colors.primary[500],
            opacity: fadeAnimation,
            transform: [
              { translateY: slideAnimation },
              { scale: heroScaleAnimation }
            ],
          }
        ]}
      >
        <View style={styles.heroContent}>
          {/* Compact Header */}
          <View style={styles.heroHeader}>
            <View style={styles.userInfo}>
              <Avatar
                name={user?.name || 'User'}
                size="medium"
                style={styles.avatar}
              />
              <View style={styles.greetingText}>
                <Animated.Text
                  style={[
                    styles.greeting,
                    {
                      color: theme.colors.text.inverse,
                      opacity: fadeAnimation,
                    }
                  ]}
                >
                  Bună, {user?.name?.split(' ')[0] || 'User'}!
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.subtitle,
                    {
                      color: theme.colors.text.inverse,
                      opacity: fadeAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.8],
                      }),
                    }
                  ]}
                >
                  Gata să creezi o cerere nouă?
                </Animated.Text>
              </View>
            </View>
            
            {/* Quick Create Button */}
            <TouchableOpacity
              style={styles.quickCreateButton}
              onPress={() => showSuccessToast('Create job pressed')}
            >
              <Icon name="add" size={20} color={theme.colors.primary[500]} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: fadeAnimation,
                transform: [{ translateY: slideAnimation }],
              }
            ]}
          >
            <Input
              variant="search"
              placeholder="Caută servicii sau meseriași..."
              containerStyle={styles.searchInput}
            />
          </Animated.View>
        </View>

        {/* Subtle Background Pattern */}
        <View style={styles.heroPattern} />
      </Animated.View>



      {/* Categories Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Categorii Populare
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: theme.colors.primary[500] }]}>
              Vezi Toate
            </Text>
          </TouchableOpacity>
        </View>

        {categoriesLoading ? (
          <View style={styles.categoriesList}>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard
                key={index}
                showImage={false}
                showTitle={true}
                showSubtitle={false}
                showDescription={false}
                titleLines={1}
                style={styles.categorySkeletonCard}
              />
            ))}
          </View>
        ) : (
          <View style={styles.categoriesList}>
            {categories.slice(0, 6).map((category, index) => (
              <Animated.View
                key={category.id}
                style={[
                  styles.categoryCardContainer,
                  {
                    opacity: categoryAnimations[index]?.opacity || 1,
                    transform: [{ scale: categoryAnimations[index]?.scale || 1 }],
                  }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: theme.colors.background.primary,
                      borderColor: `${category.color}15`,
                      borderWidth: 1,
                      ...theme.shadows.sm,
                    }
                  ]}
                  activeOpacity={0.8}
                  onPress={() => showSuccessToast(`Selected ${category.name}`)}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}10` }]}>
                    <Text style={[styles.categoryIcon, { color: category.color }]}>
                      {category.icon}
                    </Text>
                  </View>
                  <View style={styles.categoryTextContainer}>
                    <Text style={[styles.categoryName, { color: theme.colors.text.primary }]}>
                      {category.name}
                    </Text>
                    <Text style={[styles.categoryCount, { color: theme.colors.text.secondary }]}>
                      {Math.floor(Math.random() * 50) + 10} servicii
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={16} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      {/* Recent Requests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Cererile Mele Recente
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: theme.colors.primary[500] }]}>
              Vezi Toate
            </Text>
          </TouchableOpacity>
        </View>

        {jobsLoading ? (
          <SkeletonList
            itemCount={2}
            itemHeight={120}
            showAvatar={false}
            showTitle={true}
            showSubtitle={true}
            titleLines={2}
          />
        ) : (
          <>
            <CompactJobCard
              jobTitle="Reparație Robinet Bucătărie"
              companyName="În Așteptare"
              location="Sector 1, București"
              salary="150-200 RON"
              jobType="Urgent"
              postedDate="Ieri"
              description="Robinet care curge, necesită înlocuirea garniturii"
              onPress={() => showSuccessToast('Job details pressed')}
              containerStyle={styles.jobCard}
            />

            <CompactJobCard
              jobTitle="Instalare Plăci Baie"
              companyName="În Progres"
              location="Sector 2, București"
              salary="800-1200 RON"
              jobType="Normal"
              postedDate="Acum 3 zile"
              description="Instalare plăci ceramice în baia principală"
              onPress={() => showSuccessToast('Job details pressed')}
              containerStyle={styles.jobCard}
            />
          </>
        )}
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderMeseriasHome = () => (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
    >
      {/* Hero Section */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            backgroundColor: theme.colors.primary[500],
            opacity: fadeAnimation,
            transform: [
              { translateY: slideAnimation },
              { scale: heroScaleAnimation }
            ],
          }
        ]}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroHeader}>
            <View style={styles.userInfo}>
              <Avatar
                name={user?.name || 'User'}
                size="medium"
                online={true}
                style={styles.avatar}
              />
              <View style={styles.greetingText}>
                <Animated.Text
                  style={[
                    styles.greeting,
                    {
                      color: theme.colors.text.inverse,
                      opacity: fadeAnimation,
                    }
                  ]}
                >
                  Bună, {user?.name?.split(' ')[0] || 'User'}!
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.subtitle,
                    {
                      color: theme.colors.text.inverse,
                      opacity: fadeAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.8],
                      }),
                    }
                  ]}
                >
                  Lucrări noi în zona ta
                </Animated.Text>
              </View>
            </View>
            
            {/* Quick Stats Button */}
            <TouchableOpacity
              style={styles.quickCreateButton}
              onPress={() => showSuccessToast('View stats pressed')}
            >
              <Icon name="analytics" size={20} color={theme.colors.primary[500]} />
            </TouchableOpacity>
          </View>

          {/* Status Badge */}
          <Animated.View
            style={[
              styles.statusBadge,
              {
                backgroundColor: theme.colors.accent.green,
                opacity: fadeAnimation,
                transform: [{ scale: heroScaleAnimation }],
              }
            ]}
          >
            <Icon name="check-circle" size={16} color={theme.colors.text.inverse} />
            <Text style={[styles.statusText, { color: theme.colors.text.inverse }]}>
              Disponibil pentru lucru
            </Text>
          </Animated.View>
        </View>

        {/* Hero Background Pattern */}
        <View style={styles.heroPattern} />
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnimation,
            transform: [{ translateY: slideAnimation }],
          }
        ]}
      >
        <Card
          title=""
          subtitle=""
          variant="premium"
          size="small"
          containerStyle={{
            ...styles.statCard,
            backgroundColor: theme.colors.background.primary,
            marginRight: 6,
          }}
        >
          <View style={styles.statContent}>
            <Icon name="work" size={24} color={theme.colors.primary[500]} />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statTitle, { color: theme.colors.text.primary }]}>12</Text>
              <Text style={[styles.statSubtitle, { color: theme.colors.text.secondary }]}>Lucrări Active</Text>
            </View>
          </View>
        </Card>
        <Card
          title=""
          subtitle=""
          variant="premium"
          size="small"
          containerStyle={{
            ...styles.statCard,
            backgroundColor: theme.colors.background.primary,
            marginHorizontal: 6,
          }}
        >
          <View style={styles.statContent}>
            <Icon name="star" size={24} color={theme.colors.accent.orange} />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statTitle, { color: theme.colors.text.primary }]}>4.8</Text>
              <Text style={[styles.statSubtitle, { color: theme.colors.text.secondary }]}>Rating Mediu</Text>
            </View>
          </View>
        </Card>
        <Card
          title=""
          subtitle=""
          variant="premium"
          size="small"
          containerStyle={{
            ...styles.statCard,
            backgroundColor: theme.colors.background.primary,
            marginLeft: 6,
          }}
        >
          <View style={styles.statContent}>
            <Icon name="done-all" size={24} color={theme.colors.accent.green} />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statTitle, { color: theme.colors.text.primary }]}>156</Text>
              <Text style={[styles.statSubtitle, { color: theme.colors.text.secondary }]}>Lucrări Finalizate</Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* New Requests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Cereri Noi
          </Text>
          <TouchableOpacity onPress={() => {
            // Navigate to Jobs tab using React Navigation
            (navigation as any).navigate('JobsStack');
          }}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary[500] }]}>
              {user?.userType === 'meserias' ? 'Vezi Joburi' : 'Vezi Toate'}
            </Text>
          </TouchableOpacity>
        </View>

        {jobsLoading ? (
          <SkeletonList
            itemCount={3}
            itemHeight={140}
            showAvatar={false}
            showTitle={true}
            showSubtitle={true}
            titleLines={2}
          />
        ) : (
          <>
            {recentJobs.slice(0, 3).map((job) => (
              <CompactJobCard
                key={job.id}
                jobTitle={job.title}
                companyName={job.isUrgent ? "Urgent" : "Normal"}
                location={job.location}
                salary={job.budget}
                jobType={job.isUrgent ? "Urgent" : "Normal"}
                postedDate={job.createdAt}
                description={job.description}
                featured={job.isUrgent}
                onPress={() => (navigation as any).navigate('JobDetails', { jobId: job.id })}
                containerStyle={styles.jobCard}
              />
            ))}
          </>
        )}
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background.secondary }]}>
      {user?.userType === 'meserias' ? renderMeseriasHome() : renderClientHome()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    zIndex: 2,
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
  },
  quickCreateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    marginTop: 0,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 5,
  },

  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '500',
  },
  categoriesList: {
    flexDirection: 'column',
  },
  categoryCardContainer: {
    marginBottom: 8,
  },
  categoryCard: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  categorySkeletonCard: {
    marginBottom: 8,
    minHeight: 56,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    lineHeight: 18,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: '400',
  },
  jobCard: {
    marginBottom: 6,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    minHeight: 70,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  statTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 12,
  },
});

export default HomeScreen;
