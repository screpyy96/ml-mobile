import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../design-system/themes/ThemeProvider';
import Screen from '../../design-system/components/Layout/Screen';


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
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Animation refs
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const scaleAnimation = useRef(new Animated.Value(0.95)).current;
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'certifications'>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [availableTrades, setAvailableTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
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

      // Fetch portfolio items (handle if RPC doesn't exist)
      let portfolioData = null;
      try {
        const { data, error } = await supabase
          .rpc('get_portfolio_items', { p_profile_id: user.id });
        if (!error) portfolioData = data;
      } catch (error) {
        console.log('Portfolio RPC not available, skipping...');
      }

      // Fetch certifications (handle if table doesn't exist)
      let certificationsData = null;
      try {
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .eq('profile_id', user.id);
        if (!error) certificationsData = data;
      } catch (error) {
        console.log('Certifications table not available, skipping...');
      }

      // Fetch worker trades (handle if table doesn't exist)
      let tradesData = null;
      try {
        const { data, error } = await supabase
          .from('worker_trades')
          .select('trade_ids')
          .eq('profile_id', user.id)
          .single();
        if (!error) tradesData = data;
      } catch (error) {
        console.log('Worker trades table not available, skipping...');
      }

      // Fetch all available trades (handle if table doesn't exist)
      let allTradesData = null;
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .order('name', { ascending: true });
        if (!error) allTradesData = data;
      } catch (error) {
        console.log('Trades table not available, using default trades...');
        // Provide some default trades if table doesn't exist
        allTradesData = [
          { id: '1', name: 'Electrician' },
          { id: '2', name: 'Plumber' },
          { id: '3', name: 'Carpenter' },
          { id: '4', name: 'Painter' },
          { id: '5', name: 'Mason' }
        ];
      }

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
        try {
          const { error: tradesError } = await supabase
            .from('worker_trades')
            .upsert({ 
              profile_id: user.id, 
              trade_ids: selectedTrades 
            }, { 
              onConflict: 'profile_id' 
            });

          if (tradesError) {
            console.log('Worker trades update failed:', tradesError.message);
            // Continue without failing the entire update
          }
        } catch (error) {
          console.log('Worker trades table not available, skipping trades update...');
        }
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

  const handleAvatarPress = () => {
    Alert.alert(
      'Schimbă poza de profil',
      'Alege o opțiune',
      [
        {
          text: 'Camera',
          onPress: () => openCamera()
        },
        {
          text: 'Galerie',
          onPress: () => openGallery()
        },
        {
          text: 'Anulează',
          style: 'cancel'
        }
      ]
    );
  };

  const uploadImageToSupabase = async (imageUri: string): Promise<string | null> => {
    try {
      if (!user) return null;

      // Convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Create unique filename
      const fileExt = imageUri.split('.').pop() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profileImages')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        Alert.alert('Eroare', 'Nu s-a putut încărca imaginea');
        return null;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profileImages')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Eroare', 'Nu s-a putut încărca imaginea');
      return null;
    }
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as any,
    };

    launchCamera(options, async (response: ImagePickerResponse) => {
      console.log('Camera response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }
      
      if (response.errorMessage) {
        console.error('Camera error:', response.errorMessage);
        Alert.alert('Eroare', `Camera error: ${response.errorMessage}`);
        return;
      }
      
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setAvatarUri(imageUri);
          
          // Upload to Supabase
          const publicUrl = await uploadImageToSupabase(imageUri);
          if (publicUrl && profile) {
            // Update profile with new avatar URL
            const { error } = await supabase
              .from('profiles')
              .update({ avatar_url: publicUrl })
              .eq('id', user?.id);
            
            if (!error) {
              setProfile({ ...profile, avatar_url: publicUrl });
            }
          }
        }
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as any,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      console.log('Gallery response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled gallery');
        return;
      }
      
      if (response.errorMessage) {
        console.error('Gallery error:', response.errorMessage);
        Alert.alert('Eroare', `Gallery error: ${response.errorMessage}`);
        return;
      }
      
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setAvatarUri(imageUri);
          
          // Upload to Supabase
          const publicUrl = await uploadImageToSupabase(imageUri);
          if (publicUrl && profile) {
            // Update profile with new avatar URL
            const { error } = await supabase
              .from('profiles')
              .update({ avatar_url: publicUrl })
              .eq('id', user?.id);
            
            if (!error) {
              setProfile({ ...profile, avatar_url: publicUrl });
            }
          }
        }
      }
    });
  };

  const handleAddProject = () => {
    Alert.alert(
      'Adaugă proiect nou',
      'Completează detaliile proiectului',
      [
        {
          text: 'Adaugă manual',
          onPress: () => {
            Alert.alert('Info', 'Formularul pentru adăugare proiect va fi implementat în curând');
          }
        },
        {
          text: 'Încarcă imagini',
          onPress: () => {
            Alert.alert('Info', 'Funcționalitatea de încărcare imagini va fi implementată în curând');
          }
        },
        {
          text: 'Anulează',
          style: 'cancel'
        }
      ]
    );
  };

  const handleAddCertification = () => {
    Alert.alert(
      'Adaugă certificare nouă',
      'Completează detaliile certificării',
      [
        {
          text: 'Adaugă manual',
          onPress: () => {
            Alert.alert('Info', 'Formularul pentru adăugare certificare va fi implementat în curând');
          }
        },
        {
          text: 'Scanează certificat',
          onPress: () => {
            Alert.alert('Info', 'Funcționalitatea de scanare va fi implementată în curând');
          }
        },
        {
          text: 'Anulează',
          style: 'cancel'
        }
      ]
    );
  };

  const renderProfileTab = () => (
    <Animated.View 
      style={[
        styles.tabContent,
        {
          opacity: fadeAnimation,
          transform: [{ translateY: slideAnimation }, { scale: scaleAnimation }],
        },
      ]}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.cardContent}>
          <TouchableOpacity style={styles.avatarSection} onPress={handleAvatarPress}>
            <View style={styles.avatarContainer}>
              {avatarUri || profile?.avatar_url ? (
                <Image source={{ uri: avatarUri || profile?.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: `${theme.colors.primary[500]}20` }]}>
                  <Icon name="person" size={50} color={theme.colors.primary[500]} />
                </View>
              )}
              <TouchableOpacity style={[styles.avatarEditButton, { backgroundColor: theme.colors.primary[500] }]} onPress={handleAvatarPress}>
                <Icon name="camera-alt" size={16} color={theme.colors.text.inverse} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.avatarText, { color: theme.colors.text.secondary }]}>Apasă pentru a schimba foto</Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Nume complet</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                borderColor: `${theme.colors.primary[500]}20`,
              }]}
              value={name}
              onChangeText={setName}
              placeholder="Introduceți numele complet"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Telefon</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                borderColor: `${theme.colors.primary[500]}20`,
              }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Introduceți numărul de telefon"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Adresă</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                borderColor: `${theme.colors.primary[500]}20`,
              }]}
              value={address}
              onChangeText={setAddress}
              placeholder="Introduceți adresa"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Despre mine</Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                borderColor: `${theme.colors.primary[500]}20`,
              }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Spuneți câteva cuvinte despre experiența și specializarea dvs."
              placeholderTextColor={theme.colors.text.secondary}
              multiline
              numberOfLines={4}
            />
          </View>

          {user?.userType === 'meserias' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Meserii</Text>
              <View style={styles.tradesContainer}>
                {allTrades.map((trade) => (
                  <TouchableOpacity
                    key={trade.id}
                    style={[
                      styles.tradeChip,
                      { 
                        backgroundColor: selectedTrades.includes(trade.id) ? theme.colors.primary[500] : theme.colors.background.secondary,
                        borderColor: selectedTrades.includes(trade.id) ? theme.colors.primary[500] : `${theme.colors.primary[500]}30`,
                      }
                    ]}
                    onPress={() => toggleTrade(trade.id)}
                  >
                    <Text style={[
                      styles.tradeChipText,
                      { 
                        color: selectedTrades.includes(trade.id) ? theme.colors.text.inverse : theme.colors.text.secondary,
                        fontWeight: selectedTrades.includes(trade.id) ? '600' : '400',
                      }
                    ]}>
                      {trade.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: theme.colors.primary[500] }]}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={[styles.updateButtonText, { color: theme.colors.text.inverse }]}>
              {loading ? 'Se actualizează...' : 'Actualizează profilul'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderPortfolioTab = () => (
    <Animated.View 
      style={[
        styles.tabContent,
        {
          opacity: fadeAnimation,
          transform: [{ translateY: slideAnimation }, { scale: scaleAnimation }],
        },
      ]}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.cardContent}>
          <View style={styles.tabHeader}>
            <Text style={[styles.tabTitle, { color: theme.colors.text.primary }]}>Portofoliul meu</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary[500] }]} onPress={handleAddProject}>
              <Icon name="add" size={16} color={theme.colors.text.inverse} />
              <Text style={[styles.addButtonText, { color: theme.colors.text.inverse }]}>Adaugă proiect</Text>
            </TouchableOpacity>
          </View>

          {portfolioItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="folder-open" size={48} color={theme.colors.text.secondary} />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>Nu ai proiecte încă</Text>
              <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
                Adaugă primul tău proiect pentru a-ți construi portofoliul
              </Text>
            </View>
          ) : (
            portfolioItems.map((item) => (
              <View key={item.id} style={[styles.portfolioItem, { backgroundColor: theme.colors.background.secondary, borderColor: `${theme.colors.primary[500]}20` }]}>
                <View style={styles.portfolioHeader}>
                  <Text style={[styles.portfolioTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
                  <TouchableOpacity style={styles.editIcon}>
                    <Icon name="edit" size={16} color={theme.colors.primary[500]} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.portfolioDescription, { color: theme.colors.text.secondary }]}>{item.description}</Text>
                <View style={styles.portfolioTags}>
                  <View style={[styles.tag, { backgroundColor: `${theme.colors.primary[500]}20` }]}>
                    <Text style={[styles.tagText, { color: theme.colors.primary[500] }]}>{item.category}</Text>
                  </View>
                  {item.tags?.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: `${theme.colors.secondary[500]}20` }]}>
                      <Text style={[styles.tagText, { color: theme.colors.secondary[500] }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </Animated.View>
  );

  const renderCertificationsTab = () => (
    <Animated.View 
      style={[
        styles.tabContent,
        {
          opacity: fadeAnimation,
          transform: [{ translateY: slideAnimation }, { scale: scaleAnimation }],
        },
      ]}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.cardContent}>
          <View style={styles.tabHeader}>
            <Text style={[styles.tabTitle, { color: theme.colors.text.primary }]}>Certificările mele</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary[500] }]} onPress={handleAddCertification}>
              <Icon name="add" size={16} color={theme.colors.text.inverse} />
              <Text style={[styles.addButtonText, { color: theme.colors.text.inverse }]}>Adaugă certificare</Text>
            </TouchableOpacity>
          </View>

          {certifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="verified" size={48} color={theme.colors.text.secondary} />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>Nu ai certificări încă</Text>
              <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
                Adaugă certificările tale pentru a-ți crește credibilitatea
              </Text>
            </View>
          ) : (
            certifications.map((cert) => (
              <View key={cert.id} style={[styles.certificationItem, { backgroundColor: theme.colors.background.secondary, borderColor: `${theme.colors.primary[500]}20` }]}>
                <View style={styles.certificationHeader}>
                  <View style={styles.certificationInfo}>
                    <Text style={[styles.certificationName, { color: theme.colors.text.primary }]}>{cert.name}</Text>
                    <Text style={[styles.certificationIssuer, { color: theme.colors.text.secondary }]}>{cert.issuer}</Text>
                  </View>
                  <TouchableOpacity style={styles.editIcon}>
                    <Icon name="edit" size={16} color={theme.colors.primary[500]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.certificationDates}>
                  {cert.issue_date && (
                    <Text style={[styles.certificationDate, { color: theme.colors.text.secondary }]}>
                      Emisă: {new Date(cert.issue_date).toLocaleDateString()}
                    </Text>
                  )}
                  {cert.expiry_date && (
                    <Text style={[styles.certificationDate, { color: theme.colors.text.secondary }]}>
                      Expiră: {new Date(cert.expiry_date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </Animated.View>
  );

  return (
    <Screen backgroundColor={theme.colors.background.primary}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Hero Header */}
        <Animated.View 
          style={[
            styles.header,
            { 
              backgroundColor: theme.colors.primary[500],
              paddingTop: insets.top + 20,
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            }
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={theme.colors.text.inverse} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text.inverse }]}>Editare Profil</Text>
            <View style={styles.headerSpacer} />
          </View>
          <Text style={[styles.headerSubtitle, { color: `${theme.colors.text.inverse}90` }]}>
            Gestionează informațiile tale personale și profesionale
          </Text>
        </Animated.View>

        {/* Modern Tab Bar */}
        <Animated.View 
          style={[
            styles.tabBar,
            { 
              backgroundColor: theme.colors.background.secondary,
              opacity: fadeAnimation,
              transform: [{ scale: scaleAnimation }],
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tabButton, 
              activeTab === 'profile' && [styles.tabButtonActive, { backgroundColor: theme.colors.primary[500] }]
            ]}
            onPress={() => setActiveTab('profile')}
          >
            <Icon 
              name="person" 
              size={18} 
              color={activeTab === 'profile' ? theme.colors.text.inverse : theme.colors.text.secondary} 
            />
            <Text style={[
              styles.tabButtonText, 
              { color: activeTab === 'profile' ? theme.colors.text.inverse : theme.colors.text.secondary }
            ]}>
              Profil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton, 
              activeTab === 'portfolio' && [styles.tabButtonActive, { backgroundColor: theme.colors.primary[500] }]
            ]}
            onPress={() => setActiveTab('portfolio')}
          >
            <Icon 
              name="work" 
              size={18} 
              color={activeTab === 'portfolio' ? theme.colors.text.inverse : theme.colors.text.secondary} 
            />
            <Text style={[
              styles.tabButtonText, 
              { color: activeTab === 'portfolio' ? theme.colors.text.inverse : theme.colors.text.secondary }
            ]}>
              Portofoliu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton, 
              activeTab === 'certifications' && [styles.tabButtonActive, { backgroundColor: theme.colors.primary[500] }]
            ]}
            onPress={() => setActiveTab('certifications')}
          >
            <Icon 
              name="verified" 
              size={18} 
              color={activeTab === 'certifications' ? theme.colors.text.inverse : theme.colors.text.secondary} 
            />
            <Text style={[
              styles.tabButtonText, 
              { color: activeTab === 'certifications' ? theme.colors.text.inverse : theme.colors.text.secondary }
            ]}>
              Certificări
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
          {activeTab === 'certifications' && renderCertificationsTab()}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 6,
    marginTop: -10,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  tabButtonActive: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 0,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  cardContent: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  avatarText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  tradesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tradeChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  tradeChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  updateButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  portfolioItem: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  portfolioTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  editIcon: {
    padding: 8,
  },
  portfolioDescription: {
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
  },
  portfolioTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  certificationItem: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: '#fff', // Added for shadow optimization
  },
  certificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  certificationInfo: {
    flex: 1,
  },
  certificationName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  certificationIssuer: {
    fontSize: 15,
  },
  certificationDates: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  certificationDate: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default EditProfileScreen;
