import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  Modal
} from 'react-native';
import { Text, Card, Button, Chip, Divider, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';
import { useTheme, ImageGallery } from '../../design-system';
import { supabase } from '../../config/supabase';

const { width } = Dimensions.get('window');

interface RouteParams {
  meseriasId: string;
  meseriasData?: any;
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  jobType: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  description: string;
}

const MeseriasProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { meseriasId, meseriasData } = route.params as RouteParams;

  const [meserias, setMeserias] = useState(meseriasData || null);
  const [loading, setLoading] = useState(!meseriasData);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews' | 'certifications'>('about');

  useEffect(() => {
    if (!meseriasData) {
      fetchMeseriasProfile();
    }
    fetchReviews();
    fetchPortfolio();
    fetchCertifications();
    trackProfileView();
  }, [meseriasId]);

  const fetchMeseriasProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', meseriasId)
        .single();

      if (error) throw error;

      // Fetch trades
      const { data: tradesData } = await supabase
        .from('worker_trades')
        .select('trade_ids')
        .eq('profile_id', meseriasId)
        .single();

      if (tradesData?.trade_ids) {
        const { data: tradeDetails } = await supabase
          .from('trades')
          .select('id, name, slug')
          .in('id', tradesData.trade_ids);

        data.trades = tradeDetails || [];
      }

      setMeserias(data);
    } catch (error) {
      console.error('Error fetching meserias profile:', error);
      Alert.alert('Eroare', 'Nu s-a putut încărca profilul');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // First get reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, client_id, job_id')
        .eq('worker_id', meseriasId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        return;
      }

      // Get client names
      const clientIds = reviewsData.map(r => r.client_id).filter(Boolean);
      const { data: clientsData } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', clientIds);

      // Get job titles
      const jobIds = reviewsData.map(r => r.job_id).filter(Boolean);
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('id, title')
        .in('id', jobIds);

      // Create maps for quick lookup
      const clientsMap = new Map(clientsData?.map(c => [c.id, c.name]) || []);
      const jobsMap = new Map(jobsData?.map(j => [j.id, j.title]) || []);

      const formattedReviews = reviewsData.map((review: any) => ({
        id: review.id,
        clientName: clientsMap.get(review.client_id) || 'Client anonim',
        rating: review.rating,
        comment: review.comment || '',
        date: new Date(review.created_at).toLocaleDateString('ro-RO'),
        jobType: jobsMap.get(review.job_id) || 'Serviciu'
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('id, title, description, images, client_name, location, completion_date')
        .eq('profile_id', meseriasId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPortfolio = data?.map(item => ({
        id: item.id,
        title: item.title,
        image: item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400',
        images: item.images || [], // Keep all images for gallery
        description: item.description || `Lucrare pentru ${item.client_name || 'client'} în ${item.location || 'București'}`,
        client_name: item.client_name,
        location: item.location,
        completion_date: item.completion_date
      })) || [];

      setPortfolio(formattedPortfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      // Fallback cu imagini demo dacă nu există portofoliu
      setPortfolio([
        {
          id: 'demo-1',
          title: 'Lucrări anterioare',
          image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400',
          description: 'Exemple din portofoliul meseriaşului'
        }
      ]);
    }
  };

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('id, name, issuer, issue_date, expiry_date, certificate_url')
        .eq('profile_id', meseriasId)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      setCertifications([]);
    }
  };

  const trackProfileView = async () => {
    try {
      // Track profile view
      await supabase
        .from('profile_views')
        .insert({
          profile_id: meseriasId,
          viewer_id: null, // Will be set by RLS if user is authenticated
          viewed_at: new Date().toISOString()
        });

      // Get total profile views
      const { count } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', meseriasId);

      setProfileViews(count || 0);
    } catch (error) {
      console.error('Error tracking profile view:', error);
    }
  };

  const handleCall = async () => {
    if (meserias?.phone) {
      try {
        // Track phone reveal event
        await supabase
          .from('phone_reveal_events')
          .insert({
            profile_id: meseriasId,
            viewer_id: null, // Will be set by RLS if user is authenticated
            revealed_at: new Date().toISOString()
          });

        Linking.openURL(`tel:${meserias.phone}`);
      } catch (error) {
        console.error('Error tracking phone reveal:', error);
        // Still allow the call even if tracking fails
        Linking.openURL(`tel:${meserias.phone}`);
      }
    }
  };

  const handleMessage = () => {
    Alert.alert('Mesaj', 'Funcția de mesagerie va fi disponibilă în curând');
  };

  const handleContact = () => {
    Alert.alert(
      'Contact',
      'Alege modalitatea de contact:',
      [
        { text: 'Anulează', style: 'cancel' },
        { text: 'Telefon', onPress: handleCall },
        { text: 'Mesaj', onPress: handleMessage }
      ]
    );
  };

  const renderTabButton = (tabKey: typeof activeTab, label: string, count?: number) => (
    <TouchableOpacity
      key={tabKey}
      style={[
        styles.tabButton,
        activeTab === tabKey && { backgroundColor: theme.colors.primary[500] }
      ]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text
        style={[
          styles.tabButtonText,
          { color: activeTab === tabKey ? '#ffffff' : theme.colors.text.secondary }
        ]}
      >
        {label}
        {count !== undefined && count > 0 && ` (${count})`}
      </Text>
    </TouchableOpacity>
  );

  const renderAboutTab = () => (
    <View>
      {/* About section */}
      {meserias.bio && (
        <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Despre mine
            </Text>
            <Text style={[styles.bio, { color: theme.colors.text.secondary }]}>
              {meserias.bio}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Services section */}
      {meserias.trades && meserias.trades.length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Servicii oferite
            </Text>
            <View style={styles.servicesContainer}>
              {meserias.trades.map((trade: any, index: number) => (
                <Chip 
                  key={index} 
                  style={[styles.serviceChip, { backgroundColor: theme.colors.primary[50] }]}
                  textStyle={{ color: theme.colors.primary[700] }}
                >
                  {trade.name}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Contact info */}
      <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Informații contact
          </Text>
          {meserias.phone && (
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Icon name="phone" size={20} color={theme.colors.primary[500]} />
              <Text style={[styles.contactText, { color: theme.colors.text.primary }]}>
                {meserias.phone}
              </Text>
            </TouchableOpacity>
          )}
          {meserias.email && (
            <View style={styles.contactItem}>
              <Icon name="email" size={20} color={theme.colors.primary[500]} />
              <Text style={[styles.contactText, { color: theme.colors.text.primary }]}>
                {meserias.email}
              </Text>
            </View>
          )}
          {meserias.address && (
            <View style={styles.contactItem}>
              <Icon name="location-on" size={20} color={theme.colors.primary[500]} />
              <Text style={[styles.contactText, { color: theme.colors.text.primary }]}>
                {meserias.address}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const openImageModal = (image: any, title: string, description: string) => {
    setSelectedImage({ uri: image, title, description });
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };

  const renderPortfolioTab = () => {
    return (
      <View>
        {portfolio.length > 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Portofoliu ({portfolio.length} lucrări)
              </Text>
              <View style={styles.portfolioGrid}>
                {portfolio.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.portfolioGridItem}
                    onPress={() => openImageModal(item.image, item.title, item.description)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.image }} style={styles.portfolioGridImage} />
                    <Text style={[styles.portfolioGridTitle, { color: theme.colors.text.primary }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.portfolioGridDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card.Content>
          </Card>
        ) : (
          <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
            <Card.Content>
              <View style={styles.emptyState}>
                <Icon name="work" size={48} color={theme.colors.text.tertiary} />
                <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
                  Meseriașul nu a adăugat încă lucrări în portofoliu
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Image Modal */}
        <Modal
          visible={imageModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeImageModal}
        >
          <View style={styles.imageModalContainer}>
            <TouchableOpacity
              style={styles.imageModalOverlay}
              onPress={closeImageModal}
              activeOpacity={1}
            >
              <View style={styles.imageModalContent}>
                <TouchableOpacity
                  style={styles.imageModalCloseButton}
                  onPress={closeImageModal}
                >
                  <Icon name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
                
                {selectedImage && (
                  <>
                    <Image
                      source={{ uri: selectedImage.uri }}
                      style={styles.imageModalImage}
                      resizeMode="contain"
                    />
                    
                    {(selectedImage.title || selectedImage.description) && (
                      <View style={styles.imageModalInfo}>
                        {selectedImage.title && (
                          <Text style={styles.imageModalTitle}>
                            {selectedImage.title}
                          </Text>
                        )}
                        {selectedImage.description && (
                          <Text style={styles.imageModalDescription}>
                            {selectedImage.description}
                          </Text>
                        )}
                      </View>
                    )}
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  };

  const renderReviewsTab = () => (
    <View>
      {reviews.length > 0 ? (
        <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Recenzii ({reviews.length})
            </Text>
            {reviews.map((review: any) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewerName, { color: theme.colors.text.primary }]}>
                    {review.clientName}
                  </Text>
                  <View style={styles.reviewRating}>
                    <Text style={styles.reviewStars}>
                      {'⭐'.repeat(review.rating)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.reviewComment, { color: theme.colors.text.secondary }]}>
                  {review.comment}
                </Text>
                <Text style={[styles.reviewDate, { color: theme.colors.text.tertiary }]}>
                  {review.jobType} • {review.date}
                </Text>
                {review.id !== reviews[reviews.length - 1].id && <Divider style={styles.reviewDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      ) : (
        <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
          <Card.Content>
            <View style={styles.emptyState}>
              <Icon name="star-border" size={48} color={theme.colors.text.tertiary} />
              <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
                Meseriașul nu are încă recenzii
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const renderCertificationsTab = () => (
    <View>
      {certifications.length > 0 ? (
        <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Certificări și calificări ({certifications.length})
            </Text>
            {certifications.map((cert: any) => (
              <View key={cert.id} style={styles.certificationItem}>
                <View style={styles.certificationHeader}>
                  <Icon name="verified" size={20} color={theme.colors.primary[500]} />
                  <Text style={[styles.certificationName, { color: theme.colors.text.primary }]}>
                    {cert.name}
                  </Text>
                </View>
                {cert.issuer && (
                  <Text style={[styles.certificationIssuer, { color: theme.colors.text.secondary }]}>
                    Emis de: {cert.issuer}
                  </Text>
                )}
                {cert.issue_date && (
                  <Text style={[styles.certificationDate, { color: theme.colors.text.tertiary }]}>
                    Data emiterii: {new Date(cert.issue_date).toLocaleDateString('ro-RO')}
                  </Text>
                )}
                {cert.expiry_date && (
                  <Text style={[styles.certificationDate, { color: theme.colors.text.tertiary }]}>
                    Expiră: {new Date(cert.expiry_date).toLocaleDateString('ro-RO')}
                  </Text>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      ) : (
        <Card style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
          <Card.Content>
            <View style={styles.emptyState}>
              <Icon name="school" size={48} color={theme.colors.text.tertiary} />
              <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
                Meseriașul nu a adăugat încă certificări
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return renderAboutTab();
      case 'portfolio':
        return renderPortfolioTab();
      case 'reviews':
        return renderReviewsTab();
      case 'certifications':
        return renderCertificationsTab();
      default:
        return renderAboutTab();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <View style={styles.loadingContainer}>
          <Text>Se încarcă profilul...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!meserias) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <View style={styles.errorContainer}>
          <Text>Nu s-a putut încărca profilul</Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Înapoi
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with avatar and basic info */}
        <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
          <View style={styles.avatarSection}>
            {meserias.avatar_url ? (
              <Image source={{ uri: meserias.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: theme.colors.primary[500] }]}>
                <Text style={styles.avatarText}>
                  {meserias.name?.charAt(0)?.toUpperCase() || 'M'}
                </Text>
              </View>
            )}
            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: theme.colors.text.primary }]}>
                  {meserias.name || 'Meseriaș'}
                </Text>
                {meserias.is_verified && (
                  <Icon name="verified" size={20} color={theme.colors.primary[500]} />
                )}
                {meserias.is_online && (
                  <View style={[styles.onlineIndicator, { backgroundColor: '#4CAF50' }]} />
                )}
              </View>
              <Text style={[styles.category, { color: theme.colors.primary[500] }]}>
                {meserias.trades?.map((trade: any) => trade.name).join(', ') || 'Meseriaș'}
              </Text>
              <View style={styles.ratingRow}>
                <Text style={[styles.rating, { color: theme.colors.text.primary }]}>
                  ⭐ {meserias.rating ? meserias.rating.toFixed(1) : '4.5'}
                </Text>
                <Text style={[styles.reviewCount, { color: theme.colors.text.secondary }]}>
                  ({reviews.length} recenzii)
                </Text>
              </View>
              <Text style={[styles.location, { color: theme.colors.text.secondary }]}>
                📍 {meserias.address || 'București'}
              </Text>

              {/* Stats row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>
                    {profileViews}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                    vizualizări
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>
                    {reviews.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                    recenzii
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>
                    {portfolio.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                    lucrări
                  </Text>
                </View>
                {meserias.is_pro && (
                  <View style={styles.statItem}>
                    <Icon name="star" size={16} color={theme.colors.accent.yellow} />
                    <Text style={[styles.statLabel, { color: theme.colors.accent.yellow }]}>
                      PRO
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.colors.primary[500] }]}
              onPress={handleContact}
            >
              <Icon name="phone" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.colors.primary[500] }]}
              onPress={handleMessage}
            >
              <Icon name="message" size={20} color={theme.colors.primary[500]} />
              <Text style={[styles.secondaryButtonText, { color: theme.colors.primary[500] }]}>
                Mesaj
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs Navigation */}
        <View style={[styles.tabsContainer, { backgroundColor: theme.colors.background.primary }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContainer}>
            {renderTabButton('about', 'Despre')}
            {renderTabButton('portfolio', 'Portofoliu', portfolio.length)}
            {renderTabButton('reviews', 'Recenzii', reviews.length)}
            {renderTabButton('certifications', 'Calificări', certifications.length)}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        <View style={styles.bottomSpacing} />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  avatarSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  category: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    marginBottom: 8,
  },
  portfolioContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  portfolioItem: {
    width: 200,
  },
  portfolioImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  portfolioDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewStars: {
    fontSize: 16,
  },
  reviewComment: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewDivider: {
    marginTop: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: colors.text,
  },
  certificationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  certificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  certificationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  certificationIssuer: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  certificationDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Tabs styles
  tabsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tabsScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    minWidth: 80,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  // Portfolio grid styles
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  portfolioGridItem: {
    width: '48%',
    marginBottom: 16,
  },
  portfolioGridImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  portfolioGridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  portfolioGridDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  // Image modal styles
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContent: {
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageModalImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  imageModalInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  imageModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  imageModalDescription: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default MeseriasProfileScreen;