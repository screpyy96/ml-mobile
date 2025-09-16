import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text, Card, Button, Chip, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Screen } from '../../design-system';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

type JobDetailsRouteProp = RouteProp<{ JobDetails: { jobId: string } }, 'JobDetails'>;

const JobDetailsScreen: React.FC = () => {
  const route = useRoute<JobDetailsRouteProp>();
  const { jobId } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(30)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return colors.textSecondary;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Urgent';
      case 'medium': return 'Normal';
      case 'low': return 'Fără grabă';
      default: return urgency;
    }
  };

  // Fetch job details from database
  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: jobData, error: jobError } = await supabase
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
          jobType,
          projectSize,
          materialsNeeded,
          images
        `)
        .eq('id', jobId)
        .single();

      if (jobError) {
        console.error('Error fetching job:', jobError);
        setError('Nu s-a putut încărca jobul');
        return;
      }

      if (!jobData) {
        setError('Jobul nu a fost găsit');
        return;
      }

      // Get client details
      let clientName = 'Anonim';
      if (jobData.client_id) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, rating')
          .eq('id', jobData.client_id)
          .single();

        if (!profileError && profile) {
          clientName = profile.name || 'Anonim';
        }
      }

      // Get contact unlock count
      const { data: contactUnlocks, error: contactUnlocksError } = await supabase
        .from('contact_unlocks')
        .select('id')
        .eq('job_id', jobId);

      const unlockCount = contactUnlocks?.length || 0;

      // Transform data for UI
      const transformedJob = {
        id: jobData.id,
        title: jobData.title,
        description: jobData.description,
        category: jobData.tradeType,
        status: jobData.status,
        budget: jobData.budget || 'Buget negociabil',
        location: jobData.address,
        createdAt: new Date(jobData.created_at).toLocaleDateString('ro-RO'),
        urgency: jobData.urgency || 'medium',
        client: {
          name: clientName,
          rating: 4.5, // Default rating
          reviewCount: 0,
        },
        images: jobData.images || [],
        unlockCount,
        projectSize: jobData.projectSize,
        materialsNeeded: jobData.materialsNeeded,
      };

      setJob(transformedJob);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('A apărut o eroare la încărcarea jobului');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [jobId]);

  if (loading) {
    return (
      <Screen backgroundColor={theme.colors.background.secondary} edges={['bottom']}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top + 60 }]}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Se încarcă...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen backgroundColor={theme.colors.background.secondary} edges={['bottom']}>
        <View style={[styles.errorContainer, { paddingTop: insets.top + 60 }]}>
          <Icon name="error-outline" size={48} color={theme.colors.status.error} style={styles.errorIcon} />
          <Text style={[styles.errorText, { color: theme.colors.text.primary }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.colors.primary[500] }]} onPress={fetchJobDetails}>
            <Text style={[styles.retryButtonText, { color: theme.colors.text.inverse }]}>Încearcă din nou</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  if (!job) {
    return (
      <Screen backgroundColor={theme.colors.background.secondary} edges={['bottom']}>
        <View style={[styles.errorContainer, { paddingTop: insets.top + 60 }]}>
          <Icon name="work-off" size={48} color={theme.colors.text.secondary} style={styles.errorIcon} />
          <Text style={[styles.errorText, { color: theme.colors.text.primary }]}>Jobul nu a fost găsit</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.colors.background.secondary} edges={['bottom']}>
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        style={{ opacity: fadeAnimation }}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              backgroundColor: theme.colors.primary[500],
              paddingTop: 16 + insets.top,
              transform: [{ translateY: slideAnimation }],
            }
          ]}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View style={styles.jobTitleContainer}>
                <Text style={[styles.heroTitle, { color: theme.colors.text.inverse }]}>{job.title}</Text>
                <View style={styles.heroMetaRow}>
                  <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(job.urgency) }]}>
                    <Text style={[styles.urgencyText, { color: theme.colors.text.inverse }]}>{getUrgencyText(job.urgency)}</Text>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                    <Text style={[styles.categoryText, { color: theme.colors.text.inverse }]}>{job.category}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={[styles.heroPrice, { color: theme.colors.text.inverse }]}>{job.budget}</Text>
                <Text style={[styles.priceLabel, { color: theme.colors.text.inverse }]}>RON</Text>
              </View>
            </View>
            
            <View style={styles.heroInfoGrid}>
              <View style={styles.heroInfoItem}>
                <View style={[styles.heroInfoIcon, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                  <Icon name="location-on" size={14} color={theme.colors.text.inverse} />
                </View>
                <Text style={[styles.heroInfoText, { color: theme.colors.text.inverse }]}>{job.location}</Text>
              </View>
              <View style={styles.heroInfoItem}>
                <View style={[styles.heroInfoIcon, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                  <Icon name="schedule" size={14} color={theme.colors.text.inverse} />
                </View>
                <Text style={[styles.heroInfoText, { color: theme.colors.text.inverse }]}>{job.createdAt}</Text>
              </View>
              <View style={styles.heroInfoItem}>
                <View style={[styles.heroInfoIcon, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                  <Icon name="people" size={14} color={theme.colors.text.inverse} />
                </View>
                <Text style={[styles.heroInfoText, { color: theme.colors.text.inverse }]}>{job.unlockCount || 0} interesați</Text>
              </View>
            </View>
          </View>
          
          {/* Hero Background Pattern */}
          <View style={styles.heroPattern} />
        </Animated.View>
        
        {/* Job Description Card */}
        <Animated.View
          style={[
            styles.descriptionCard,
            {
              backgroundColor: theme.colors.background.primary,
              transform: [{ translateY: slideAnimation }],
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Descriere</Text>
          <Text style={[styles.jobDescription, { color: theme.colors.text.secondary }]}>{job.description}</Text>
        </Animated.View>
        
        {/* Job Details Card */}
        <Animated.View
          style={[
            styles.detailsCard,
            {
              backgroundColor: theme.colors.background.primary,
              transform: [{ translateY: slideAnimation }],
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Detalii Proiect</Text>
          <View style={styles.detailsGrid}>
            <View style={[styles.detailItem, { backgroundColor: `${theme.colors.primary[500]}10` }]}>
              <Icon name="business" size={20} color={theme.colors.primary[500]} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Tip proiect</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>{job.projectSize || 'Nespecificat'}</Text>
              </View>
            </View>
            
            <View style={[styles.detailItem, { backgroundColor: `${theme.colors.secondary[500]}10` }]}>
              <Icon name="build" size={20} color={theme.colors.secondary[500]} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Materiale</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>{job.materialsNeeded || 'Nespecificat'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Images Section */}
        {job.images && job.images.length > 0 && (
          <Animated.View
            style={[
              styles.imagesCard,
              {
                backgroundColor: theme.colors.background.primary,
                transform: [{ translateY: slideAnimation }],
              }
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Imagini Proiect</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              {job.images.map((image: string, index: number) => (
                <TouchableOpacity key={index} style={[styles.imageContainer, { backgroundColor: theme.colors.background.secondary }]}>
                  <Icon name="photo" size={32} color={theme.colors.text.secondary} />
                  <Text style={[styles.imageLabel, { color: theme.colors.text.secondary }]}>Imagine {index + 1}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
          
       

        {/* Client Info Card */}
        {user?.userType === 'meserias' && (
          <Animated.View
            style={[
              styles.clientCard,
              {
                backgroundColor: theme.colors.background.primary,
                transform: [{ translateY: slideAnimation }],
              }
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Informații Client</Text>
            <View style={styles.clientInfo}>
              <View style={[styles.clientAvatar, { backgroundColor: `${theme.colors.primary[500]}20` }]}>
                <Icon name="person" size={24} color={theme.colors.primary[500]} />
              </View>
              <View style={styles.clientDetails}>
                <Text style={[styles.clientName, { color: theme.colors.text.primary }]}>{job.client.name}</Text>
                <View style={styles.clientRating}>
                  <Icon name="star" size={16} color={theme.colors.accent.yellow} />
                  <Text style={[styles.ratingText, { color: theme.colors.text.secondary }]}>
                    {job.client.rating} ({job.client.reviewCount} recenzii)
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.colors.primary[500] }]}>
                <Text style={[styles.profileButtonText, { color: theme.colors.text.inverse }]}>Vezi profil</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Competition Info Card */}
        {user?.userType === 'meserias' && (
          <Animated.View
            style={[
              styles.competitionCard,
              {
                backgroundColor: theme.colors.background.primary,
                transform: [{ translateY: slideAnimation }],
              }
            ]}
          >
            <View style={styles.competitionHeader}>
              <Icon name="group" size={24} color={theme.colors.primary[500]} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, marginLeft: 8 }]}>
                Concurență ({job.unlockCount || 0})
              </Text>
            </View>
            
            <View style={[styles.competitionStats, { backgroundColor: job.unlockCount > 0 ? `${theme.colors.status.warning}10` : `${theme.colors.status.success}10` }]}>
              <Icon 
                name={job.unlockCount > 0 ? "trending-up" : "trending-down"} 
                size={20} 
                color={job.unlockCount > 0 ? theme.colors.status.warning : theme.colors.status.success} 
              />
              <Text style={[styles.competitionText, { 
                color: job.unlockCount > 0 ? theme.colors.status.warning : theme.colors.status.success,
                marginLeft: 8 
              }]}>
                {job.unlockCount > 0 
                  ? `${job.unlockCount} meseriași au acces la contact` 
                  : 'Fii primul care aplică pentru acest job!'
                }
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Client Stats Card */}
        {user?.userType === 'client' && (
          <Animated.View
            style={[
              styles.statsCard,
              {
                backgroundColor: theme.colors.background.primary,
                transform: [{ translateY: slideAnimation }],
              }
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Statistici Cerere</Text>
            
            <View style={styles.statsGrid}>
              <View style={[styles.statItem, { backgroundColor: `${theme.colors.primary[500]}10` }]}>
                <Icon name="contact-phone" size={24} color={theme.colors.primary[500]} />
                <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>{job.unlockCount || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Contacte deblocate</Text>
              </View>
              
              <View style={[styles.statItem, { backgroundColor: `${theme.colors.status.success}10` }]}>
                <Icon name="local-offer" size={24} color={theme.colors.status.success} />
                <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>0</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Oferte primite</Text>
              </View>
              
              <View style={[styles.statItem, { backgroundColor: `${theme.colors.primary[500]}10` }]}>
                <Icon name="visibility" size={24} color={theme.colors.primary[500]} />
                <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>0</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Vizualizări</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Bottom Actions */}
        <Animated.View
          style={[
            styles.bottomActions,
            {
              backgroundColor: theme.colors.background.primary,
              transform: [{ translateY: slideAnimation }],
            }
          ]}
        >
          {user?.userType === 'client' ? (
            // Butoane pentru client (proprietarul jobului)
            <>
              <TouchableOpacity style={[styles.secondaryButton, { borderColor: theme.colors.primary[500] }]}>
                <Icon name="edit" size={20} color={theme.colors.primary[500]} />
                <Text style={[styles.secondaryButtonText, { color: theme.colors.primary[500] }]}>Editează cererea</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.colors.primary[500] }]}>
                <Icon name="message" size={20} color={theme.colors.text.inverse} />
                <Text style={[styles.primaryButtonText, { color: theme.colors.text.inverse }]}>Contactează meșteșugari</Text>
              </TouchableOpacity>
            </>
          ) : user?.userType === 'meserias' ? (
            // Butoane pentru meseriaș
            <>
              <TouchableOpacity style={[styles.secondaryButton, { borderColor: theme.colors.primary[500] }]}>
                <Icon name="bookmark-border" size={20} color={theme.colors.primary[500]} />
                <Text style={[styles.secondaryButtonText, { color: theme.colors.primary[500] }]}>Salvează</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.colors.primary[500] }]}>
                <Icon name="work" size={20} color={theme.colors.text.inverse} />
                <Text style={[styles.primaryButtonText, { color: theme.colors.text.inverse }]}>Aplică pentru job</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Butoane pentru utilizatori neautentificați
            <>
              <TouchableOpacity style={[styles.secondaryButton, { borderColor: theme.colors.primary[500] }]}>
                <Icon name="info-outline" size={20} color={theme.colors.primary[500]} />
                <Text style={[styles.secondaryButtonText, { color: theme.colors.primary[500] }]}>Mai multe detalii</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.colors.primary[500] }]}>
                <Icon name="login" size={20} color={theme.colors.text.inverse} />
                <Text style={[styles.primaryButtonText, { color: theme.colors.text.inverse }]}>Autentifică-te</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  errorIcon: {
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: '#fff', // Added for shadow optimization
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
    opacity: 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  heroHeader: {
    flexDirection: 'column',
    marginBottom: 24,
  },
  jobTitleContainer: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 12,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 4,
  },
  heroPrice: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  heroInfoGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  heroInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroInfoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInfoText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  
  // Card Styles
  descriptionCard: {
    margin: 20,
    marginTop: -16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  detailsCard: {
    margin: 20,
    marginBottom: 0,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  imagesCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  clientCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  competitionCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  statsCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  
  // Content Styles
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  jobDescription: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  
  // Details Grid
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Images
  imagesScroll: {
    marginTop: 8,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  
  // Client Info
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  clientRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  profileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  profileButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Competition Info
  competitionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  competitionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  competitionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    margin: 20,
    marginBottom: 0,
    padding: 24,
    borderRadius: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  
  // Legacy styles (keeping for compatibility)
  heroCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    margin: 16,
    padding: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 16, 
    elevation: 3,
  },
  urgencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  noOffersText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: { 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 12, 
    marginRight: 8 
  },
  badgeText: { 
    fontWeight: '700' 
  },
  price: { 
    fontSize: 18, 
    fontWeight: '800' 
  },
  infoItem: { 
    fontSize: 13 
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  details: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  imagesContainer: {
    marginTop: 8,
  },
  detailPill: { 
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  detailPillText: { 
    color: '#0f172a', 
    fontWeight: '600' 
  },
  images: {
    flexDirection: 'row',
    gap: 8,
  },
  imageIcon: {
    fontSize: 24,
  },
  offer: {
    paddingVertical: 12,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meseriasInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  meseriasAvatar: {
    fontSize: 32,
    marginRight: 8,
  },
  meseriasDetails: {
    flex: 1,
  },
  meseriasName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  meseriasRating: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  offerPrice: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  duration: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  offerDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 18,
  },
  offerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  bottomButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
});

export default JobDetailsScreen;
