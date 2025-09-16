import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Linking,
  Dimensions,
  Animated,
} from 'react-native';
import { Card, Chip, Button, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../../config/supabase';
import { colors } from '../../constants/colors';
import Layout from '../../design-system/components/Layout/Screen';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

interface Trade {
  id: string;
  name: string;
  slug: string;
}

interface Profile {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  address?: string;
  avatar_url?: string;
  rating?: number;
  is_verified: boolean;
  is_pro: boolean;
  phone?: string;
  review_count?: number;
  trades?: Trade[];
}

interface MeseriasProfileScreenProps {
  route: {
    params: RouteParams;
  };
  navigation: any;
}

interface SelectedImage {
  uri: string;
  title: string;
  description: string;
}

const MeseriasProfileScreen = ({ route, navigation }: MeseriasProfileScreenProps) => {
  const { meseriasId } = route.params;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('despre');
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  const [reviews, setReviews] = useState<Review[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [profileViews, setProfileViews] = useState(0);

  useEffect(() => {
    fetchMeseriasProfile();
  }, [meseriasId]);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

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

      setProfile(data);
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
        jobType: jobsMap.get(review.job_id) || 'Serviciu',
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
        completion_date: item.completion_date,
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
          description: 'Exemple din portofoliul meseriaşului',
        },
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
          viewed_at: new Date().toISOString(),
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
    if (profile?.phone) {
      try {
        // Track phone reveal event
        await supabase
          .from('phone_reveal_events')
          .insert({
            profile_id: meseriasId,
            viewer_id: null, // Will be set by RLS if user is authenticated
            revealed_at: new Date().toISOString(),
          });

        Linking.openURL(`tel:${profile.phone}`);
      } catch (error) {
        console.error('Error tracking phone reveal:', error);
        // Still allow the call even if tracking fails
        Linking.openURL(`tel:${profile.phone}`);
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
        { text: 'Mesaj', onPress: handleMessage },
      ],
    );
  };

  const renderTabButton = (tabKey: string, label: string, count?: number) => (
    <TouchableOpacity
      key={tabKey}
      style={[
        styles.tabButton,
        activeTab === tabKey && { backgroundColor: colors.primary },
      ]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text
        style={[
          styles.tabButtonText,
          { color: activeTab === tabKey ? '#ffffff' : colors.text },
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
      {profile?.bio && (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Despre mine
            </Text>
            <Text style={[styles.bio, { color: colors.textSecondary }]}>
              {profile.bio}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Services section */}
      {profile?.trades && profile.trades.length > 0 && (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Servicii oferite
            </Text>
            <View style={styles.servicesContainer}>
              {profile.trades.map((trade: Trade, index: number) => (
                <Chip
                  key={index}
                  style={[styles.serviceChip, { backgroundColor: colors.primaryLight }]}
                  textStyle={{ color: colors.primary }}
                >
                  {trade.name}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Contact info */}
      <Card style={[styles.card, { backgroundColor: colors.background }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informații contact
          </Text>
          {profile?.phone && (
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Icon name="phone" size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                {profile.phone}
              </Text>
            </TouchableOpacity>
          )}
          {profile?.email && (
            <View style={styles.contactItem}>
              <Icon name="email" size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                {profile.email}
              </Text>
            </View>
          )}
          {profile?.address && (
            <View style={styles.contactItem}>
              <Icon name="location-on" size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                {profile.address}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const renderPortfolioTab = () => (
    <View>
      {portfolio.length > 0 ? (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Portofoliu ({portfolio.length} lucrări)
            </Text>
            <View style={styles.portfolioGrid}>
              {portfolio.map((item: PortfolioItem) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.portfolioGridItem}
                  onPress={() => openImageModal(item.image, item.title, item.description)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.image }} style={styles.portfolioGridImage} />
                  <Text style={[styles.portfolioGridTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.portfolioGridDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>
      ) : (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
          <Card.Content>
            <View style={styles.emptyState}>
              <Icon name="work" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                Meseriașul nu a adăugat încă lucrări în portofoliu
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const renderReviewsTab = () => (
    <View>
      {reviews.length > 0 ? (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recenzii ({reviews.length})
            </Text>
            {reviews.map((review: Review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewerName, { color: colors.text }]}>
                    {review.clientName}
                  </Text>
                  <View style={styles.reviewRating}>
                    <Text style={styles.reviewStars}>
                      {'⭐'.repeat(review.rating)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
                  {review.comment}
                </Text>
                <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
                  {review.jobType} • {review.date}
                </Text>
                {review.id !== reviews[reviews.length - 1].id && <Divider style={styles.reviewDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      ) : (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
          <Card.Content>
            <View style={styles.emptyState}>
              <Icon name="star-border" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
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
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Certificări și calificări ({certifications.length})
            </Text>
            {certifications.map((cert: any) => (
              <View key={cert.id} style={styles.certificationItem}>
                <View style={styles.certificationHeader}>
                  <Icon name="verified" size={20} color={colors.primary} />
                  <Text style={[styles.certificationName, { color: colors.text }]}>
                    {cert.name}
                  </Text>
                </View>
                {cert.issuer && (
                  <Text style={[styles.certificationIssuer, { color: colors.textSecondary }]}>
                    Emis de: {cert.issuer}
                  </Text>
                )}
                {cert.issue_date && (
                  <Text style={[styles.certificationDate, { color: colors.textSecondary }]}>
                    Data emiterii: {new Date(cert.issue_date).toLocaleDateString('ro-RO')}
                  </Text>
                )}
                {cert.expiry_date && (
                  <Text style={[styles.certificationDate, { color: colors.textSecondary }]}>
                    Expiră: {new Date(cert.expiry_date).toLocaleDateString('ro-RO')}
                  </Text>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      ) : (
        <Card style={[styles.card, { backgroundColor: colors.background }]}>
          <Card.Content>
            <View style={styles.emptyState}>
              <Icon name="school" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
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
      case 'despre':
        return renderAboutTab();
      case 'portofoliu':
        return renderPortfolioTab();
      case 'recenzii':
        return renderReviewsTab();
      case 'calificari':
        return renderCertificationsTab();
      default:
        return renderAboutTab();
    }
  };

  const tabs = [
    { id: 'despre', label: 'Despre' },
    { id: 'portofoliu', label: 'Portofoliu' },
    { id: 'recenzii', label: 'Recenzii' },
    { id: 'calificari', label: 'Calificări' },
  ];

  const openImageModal = (image: string, title: string, description: string) => {
    setSelectedImage({ uri: image, title, description });
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Layout backgroundColor={colors.backgroundSecondary}>
        <View style={styles.loadingContainer}>
          <Text>Se încarcă profilul...</Text>
        </View>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout backgroundColor={colors.backgroundSecondary}>
        <View style={styles.errorContainer}>
          <Text>Nu s-a putut încărca profilul</Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Înapoi
          </Button>
        </View>
      </Layout>
    );
  }

  return (
    <Layout backgroundColor={colors.backgroundSecondary}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{
                      uri: profile.avatar_url || 'https://via.placeholder.com/120',
                    }}
                    style={styles.avatar}
                  />
                  {profile.is_verified && (
                    <View style={styles.verifiedBadge}>
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={28}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile.name}</Text>
                <View style={styles.locationContainer}>
                  <MaterialCommunityIcons name="map-marker" size={16} color={colors.textSecondary} />
                  <Text style={styles.address}>{profile.address}</Text>
                </View>
                
                {/* Rating */}
                {profile.rating && (
                  <View style={styles.ratingContainer}>
                    <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
                    <Text style={styles.ratingText}>{profile.rating.toFixed(1)}</Text>
                    <Text style={styles.ratingCount}>({profile.review_count || 0} recenzii)</Text>
                  </View>
                )}

                {/* Trades */}
                {profile.trades && profile.trades.length > 0 && (
                  <View style={styles.tradesContainer}>
                    {profile.trades.slice(0, 3).map((trade: Trade, index: number) => (
                      <Chip key={index} style={styles.tradeChip} textStyle={styles.tradeChipText}>
                        {trade.name}
                      </Chip>
                    ))}
                    {profile.trades.length > 3 && (
                      <Chip style={styles.tradeChip} textStyle={styles.tradeChipText}>
                        +{profile.trades.length - 3}
                      </Chip>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Contact Buttons */}
            <View style={styles.contactButtons}>
              <Button
                mode="contained"
                onPress={handleCall}
                style={styles.callButton}
                labelStyle={styles.callButtonText}
                icon="phone"
                contentStyle={styles.buttonContent}
              >
                Sună
              </Button>
              <Button
                mode="outlined"
                onPress={handleMessage}
                style={styles.messageButton}
                labelStyle={styles.messageButtonText}
                icon="message"
                contentStyle={styles.buttonContent}
              >
                Mesaj
              </Button>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScrollContainer}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tabButton,
                    activeTab === tab.id && styles.activeTabButton,
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === tab.id && styles.activeTabButtonText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {renderTabContent()}
          </View>

          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
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
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  animatedContainer: {
    flex: 1,
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
  heroSection: {
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  heroCard: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  tradesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tradeChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
  },
  tradeChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  callButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  callButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  messageButton: {
    flex: 1,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  messageButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
    letterSpacing: -0.3,
  },
  bio: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.textSecondary,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceChip: {
    marginBottom: 8,
    borderRadius: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text,
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewStars: {
    fontSize: 14,
  },
  reviewComment: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    color: colors.textSecondary,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewDivider: {
    marginTop: 16,
  },
  certificationItem: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  certificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  certificationName: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
    color: colors.text,
    flex: 1,
  },
  certificationIssuer: {
    fontSize: 14,
    marginLeft: 32,
    marginBottom: 4,
    color: colors.textSecondary,
  },
  certificationDate: {
    fontSize: 12,
    marginLeft: 32,
    color: colors.textSecondary,
  },
  tabsContainer: {
    backgroundColor: colors.background,
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  tabsScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  portfolioGridItem: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  portfolioGridImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  portfolioGridTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  portfolioGridDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
    paddingHorizontal: 20,
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
    height: 40,
  },
});

export default MeseriasProfileScreen;
