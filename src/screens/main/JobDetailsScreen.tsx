import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../design-system';

type JobDetailsRouteProp = RouteProp<{ JobDetails: { jobId: string } }, 'JobDetails'>;

const JobDetailsScreen: React.FC = () => {
  const route = useRoute<JobDetailsRouteProp>();
  const { jobId } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [jobId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Se încarcă...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Jobul nu a fost găsit</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{job.title}</Text>
            <View style={[
              styles.urgencyChip,
              { backgroundColor: getUrgencyColor(job.urgency) + '20' }
            ]}>
              <Text style={[styles.urgencyText, { color: getUrgencyColor(job.urgency) }]}>
                {getUrgencyText(job.urgency)}
              </Text>
            </View>
          </View>
            
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{job.description}</Text>
            
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>📋 Categorie:</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>{job.category}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>📍 Locație:</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>{job.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>💰 Buget:</Text>
                <Text style={[styles.detailValue, { color: theme.colors.primary[500], fontWeight: '600' }]}>{job.budget}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>📅 Postată:</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                  {job.createdAt}
                </Text>
              </View>
            </View>

            {job.images && job.images.length > 0 && (
              <View style={styles.imagesContainer}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Imagini</Text>
                <View style={styles.images}>
                  {job.images.map((image: string, index: number) => (
                    <View key={index} style={[styles.imageContainer, { backgroundColor: theme.colors.background.secondary }]}>
                      <Text style={styles.imageIcon}>📷</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
       

        {user?.userType === 'meserias' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Client</Text>
              <View style={styles.clientInfo}>
                <Text style={styles.clientAvatar}>👤</Text>
                <View style={styles.clientDetails}>
                  <Text style={styles.clientName}>{job.client.name}</Text>
                  <Text style={styles.clientRating}>
                    ⭐ {job.client.rating} ({job.client.reviewCount} recenzii)
                  </Text>
                </View>
                <Button mode="outlined" compact>
                  Vezi profil
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {user?.userType === 'meserias' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                Alți meseriași interesați ({job.unlockCount || 0})
              </Text>
              
              {job.unlockCount > 0 ? (
                <Text style={styles.competitionText}>
                  {job.unlockCount} meseriași au deja acces la contactul clientului.
                </Text>
              ) : (
                <Text style={styles.noOffersText}>
                  Încă nu există alți meseriași interesați pentru această cerere.
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {user?.userType === 'client' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                Statistici cerere
              </Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{job.unlockCount || 0}</Text>
                  <Text style={styles.statLabel}>Contacte deblocate</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Oferte primite</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Vizualizări</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.bottomActions}>
          {user?.userType === 'client' ? (
            // Butoane pentru client (proprietarul jobului)
            <>
              <Button mode="outlined" style={styles.bottomButton}>
                Editează cererea
              </Button>
              <Button mode="contained" style={styles.bottomButton}>
                Contactează meșteșugari
              </Button>
            </>
          ) : user?.userType === 'meserias' ? (
            // Butoane pentru meseriaș
            <>
              <Button mode="outlined" style={styles.bottomButton}>
                Salvează cererea
              </Button>
              <Button mode="contained" style={styles.bottomButton}>
                Aplică pentru job
              </Button>
            </>
          ) : (
            // Butoane pentru utilizatori neautentificați
            <>
              <Button mode="outlined" style={styles.bottomButton}>
                Vezi mai multe detalii
              </Button>
              <Button mode="contained" style={styles.bottomButton}>
                Autentifică-te pentru a aplica
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  urgencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noOffersText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  competitionText: {
    fontSize: 14,
    color: colors.warning,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  detailLabel: {
    fontSize: 15,
    width: 100,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    flex: 1,
    fontWeight: '400',
  },
  imagesContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  images: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 24,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    fontSize: 40,
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  clientRating: {
    fontSize: 14,
    color: colors.textSecondary,
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
  bottomActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
  },
});

export default JobDetailsScreen;