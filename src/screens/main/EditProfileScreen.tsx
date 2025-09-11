import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, Button, Card, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import { useNavigation } from '@react-navigation/native';

// Premium color scheme
const premiumColors = {
  darkBlue: '#0F172A',
  darkBlueSecondary: '#1E293B',
  darkBlueTertiary: '#334155',
  goldenYellow: '#F59E0B',
  goldenYellowLight: '#FBBF24',
  grayText: '#94A3B8',
  grayTextLight: '#CBD5E1',
  white: '#FFFFFF',
  success: '#10B981',
  error: '#EF4444',
  border: '#475569',
};

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar_url?: string;
  trade_ids?: string[];
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  client_name?: string;
  location?: string;
  budget_range?: string;
  completion_date?: string;
  tags?: string[];
  images?: string[];
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  certificate_url?: string;
}

interface Trade {
  id: string;
  name: string;
}

const EditProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'certifications'>('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch portfolio items
      const { data: portfolioData, error: portfolioError } = await supabase
        .rpc('get_portfolio_items', { p_profile_id: user.id });

      // Fetch certifications
      const { data: certificationsData, error: certificationsError } = await supabase
        .from('certifications')
        .select('*')
        .eq('profile_id', user.id);

      // Fetch worker trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('worker_trades')
        .select('trade_ids')
        .eq('profile_id', user.id)
        .single();

      // Fetch all available trades
      const { data: allTradesData, error: allTradesError } = await supabase
        .from('trades')
        .select('*')
        .order('name', { ascending: true });

      if (profileData) {
        setProfile(profileData);
        setName(profileData.name || '');
        setPhone(profileData.phone || '');
        setAddress(profileData.address || '');
        setBio(profileData.bio || '');
        setSelectedTrades(tradesData?.trade_ids || []);
      }

      if (portfolioData) {
        const parsedPortfolio = typeof portfolioData === 'string' 
          ? JSON.parse(portfolioData) 
          : portfolioData;
        setPortfolioItems(parsedPortfolio || []);
      }

      if (certificationsData) {
        setCertifications(certificationsData);
      }

      if (allTradesData) {
        setAllTrades(allTradesData);
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Eroare', 'Nu s-au putut încărca datele profilului');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      const updateData = {
        name,
        phone,
        address,
        bio,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update worker trades if user is a meserias
      if (user.userType === 'meserias' && selectedTrades.length > 0) {
        const { error: tradesError } = await supabase
          .from('worker_trades')
          .upsert({ 
            profile_id: user.id, 
            trade_ids: selectedTrades 
          }, { 
            onConflict: 'profile_id' 
          });

        if (tradesError) throw tradesError;
      }

      Alert.alert('Succes', 'Profilul a fost actualizat cu succes!');
      fetchProfileData(); // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Eroare', 'Nu s-a putut actualiza profilul');
    } finally {
      setLoading(false);
    }
  };

  const toggleTrade = (tradeId: string) => {
    setSelectedTrades(prev => 
      prev.includes(tradeId)
        ? prev.filter(id => id !== tradeId)
        : [...prev, tradeId]
    );
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/100' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.avatarEditButton}>
                <Icon name="camera" size={16} color={premiumColors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarText}>Apasă pentru a schimba foto</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nume complet</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Introduceți numele complet"
              placeholderTextColor={premiumColors.grayText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Telefon</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Introduceți numărul de telefon"
              placeholderTextColor={premiumColors.grayText}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresă</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Introduceți adresa"
              placeholderTextColor={premiumColors.grayText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Despre mine</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Spuneți câteva cuvinte despre experiența și specializarea dvs."
              placeholderTextColor={premiumColors.grayText}
              multiline
              numberOfLines={4}
            />
          </View>

          {user?.userType === 'meserias' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Meserii</Text>
              <View style={styles.tradesContainer}>
                {allTrades.map((trade) => (
                  <TouchableOpacity
                    key={trade.id}
                    style={[
                      styles.tradeChip,
                      selectedTrades.includes(trade.id) && styles.tradeChipSelected
                    ]}
                    onPress={() => toggleTrade(trade.id)}
                  >
                    <Text style={[
                      styles.tradeChipText,
                      selectedTrades.includes(trade.id) && styles.tradeChipTextSelected
                    ]}>
                      {trade.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleUpdateProfile}
            loading={loading}
            disabled={loading}
            style={styles.updateButton}
            labelStyle={styles.updateButtonText}
          >
            Actualizează profilul
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  const renderPortfolioTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.tabHeader}>
            <Text style={styles.tabTitle}>Portofoliul meu</Text>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="plus" size={16} color={premiumColors.white} />
              <Text style={styles.addButtonText}>Adaugă proiect</Text>
            </TouchableOpacity>
          </View>

          {portfolioItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="folder-open" size={48} color={premiumColors.grayText} />
              <Text style={styles.emptyStateTitle}>Nu ai proiecte încă</Text>
              <Text style={styles.emptyStateText}>
                Adaugă primul tău proiect pentru a-ți construi portofoliul
              </Text>
            </View>
          ) : (
            portfolioItems.map((item) => (
              <View key={item.id} style={styles.portfolioItem}>
                <View style={styles.portfolioHeader}>
                  <Text style={styles.portfolioTitle}>{item.title}</Text>
                  <TouchableOpacity style={styles.editIcon}>
                    <Icon name="edit" size={16} color={premiumColors.goldenYellow} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.portfolioDescription}>{item.description}</Text>
                <View style={styles.portfolioTags}>
                  <Chip style={styles.tag} textStyle={styles.tagText}>
                    {item.category}
                  </Chip>
                  {item.tags?.map((tag, index) => (
                    <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const renderCertificationsTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.tabHeader}>
            <Text style={styles.tabTitle}>Certificările mele</Text>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="plus" size={16} color={premiumColors.white} />
              <Text style={styles.addButtonText}>Adaugă certificare</Text>
            </TouchableOpacity>
          </View>

          {certifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="certificate" size={48} color={premiumColors.grayText} />
              <Text style={styles.emptyStateTitle}>Nu ai certificări încă</Text>
              <Text style={styles.emptyStateText}>
                Adaugă certificările tale pentru a-ți crește credibilitatea
              </Text>
            </View>
          ) : (
            certifications.map((cert) => (
              <View key={cert.id} style={styles.certificationItem}>
                <View style={styles.certificationHeader}>
                  <View style={styles.certificationInfo}>
                    <Text style={styles.certificationName}>{cert.name}</Text>
                    <Text style={styles.certificationIssuer}>{cert.issuer}</Text>
                  </View>
                  <TouchableOpacity style={styles.editIcon}>
                    <Icon name="edit" size={16} color={premiumColors.goldenYellow} />
                  </TouchableOpacity>
                </View>
                <View style={styles.certificationDates}>
                  {cert.issue_date && (
                    <Text style={styles.certificationDate}>
                      Emisă: {new Date(cert.issue_date).toLocaleDateString()}
                    </Text>
                  )}
                  {cert.expiry_date && (
                    <Text style={styles.certificationDate}>
                      Expiră: {new Date(cert.expiry_date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={20} color={premiumColors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editare Profil</Text>
            <View style={styles.headerSpacer} />
          </View>
          <Text style={styles.headerSubtitle}>
            Gestionează informațiile tale personale și profesionale
          </Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
            onPress={() => setActiveTab('profile')}
          >
            <Icon 
              name="user" 
              size={16} 
              color={activeTab === 'profile' ? premiumColors.goldenYellow : premiumColors.grayText} 
            />
            <Text style={[styles.tabButtonText, activeTab === 'profile' && styles.tabButtonTextActive]}>
              Profil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'portfolio' && styles.tabButtonActive]}
            onPress={() => setActiveTab('portfolio')}
          >
            <Icon 
              name="briefcase" 
              size={16} 
              color={activeTab === 'portfolio' ? premiumColors.goldenYellow : premiumColors.grayText} 
            />
            <Text style={[styles.tabButtonText, activeTab === 'portfolio' && styles.tabButtonTextActive]}>
              Portofoliu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'certifications' && styles.tabButtonActive]}
            onPress={() => setActiveTab('certifications')}
          >
            <Icon 
              name="certificate" 
              size={16} 
              color={activeTab === 'certifications' ? premiumColors.goldenYellow : premiumColors.grayText} 
            />
            <Text style={[styles.tabButtonText, activeTab === 'certifications' && styles.tabButtonTextActive]}>
              Certificări
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
          {activeTab === 'certifications' && renderCertificationsTab()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: premiumColors.darkBlue,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: premiumColors.white,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  headerSubtitle: {
    fontSize: 16,
    color: premiumColors.grayText,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: premiumColors.darkBlueSecondary,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: premiumColors.darkBlueTertiary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: premiumColors.grayText,
  },
  tabButtonTextActive: {
    color: premiumColors.goldenYellow,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: premiumColors.darkBlueSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: premiumColors.border,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: premiumColors.goldenYellow,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: premiumColors.goldenYellow,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    color: premiumColors.grayText,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: premiumColors.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: premiumColors.darkBlueTertiary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: premiumColors.white,
    borderWidth: 1,
    borderColor: premiumColors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  tradesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tradeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: premiumColors.border,
    backgroundColor: premiumColors.darkBlueTertiary,
  },
  tradeChipSelected: {
    backgroundColor: premiumColors.goldenYellow,
    borderColor: premiumColors.goldenYellow,
  },
  tradeChipText: {
    fontSize: 14,
    color: premiumColors.grayText,
  },
  tradeChipTextSelected: {
    color: premiumColors.darkBlue,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: premiumColors.goldenYellow,
    borderRadius: 12,
    marginTop: 8,
  },
  updateButtonText: {
    color: premiumColors.darkBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: premiumColors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premiumColors.goldenYellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: premiumColors.darkBlue,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: premiumColors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: premiumColors.grayText,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  portfolioItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: premiumColors.darkBlueTertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: premiumColors.border,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: premiumColors.white,
  },
  editIcon: {
    padding: 4,
  },
  portfolioDescription: {
    fontSize: 14,
    color: premiumColors.grayText,
    marginBottom: 12,
  },
  portfolioTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: premiumColors.darkBlue,
    borderColor: premiumColors.border,
  },
  tagText: {
    color: premiumColors.grayText,
    fontSize: 12,
  },
  certificationItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: premiumColors.darkBlueTertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: premiumColors.border,
  },
  certificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  certificationInfo: {
    flex: 1,
  },
  certificationName: {
    fontSize: 16,
    fontWeight: '600',
    color: premiumColors.white,
    marginBottom: 4,
  },
  certificationIssuer: {
    fontSize: 14,
    color: premiumColors.grayText,
  },
  certificationDates: {
    flexDirection: 'row',
    gap: 16,
  },
  certificationDate: {
    fontSize: 12,
    color: premiumColors.grayText,
  },
});

export default EditProfileScreen;
