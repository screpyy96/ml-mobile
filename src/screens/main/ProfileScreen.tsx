import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions, Text } from 'react-native';
import { Card, Button, List, Avatar, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { logoutTest } from '../../utils/logoutTest';
import { useTheme } from '../../design-system/themes/ThemeProvider';
import { ProfileStackParamList } from '../../navigation/MainNavigator';
import { supabase } from '../../config/supabase';
// Using View with background colors instead of LinearGradient

const { width } = Dimensions.get('window');

type ProfileScreenNavigationProp = NavigationProp<ProfileStackParamList>;

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedJobs: 0,
    averageRating: 0,
    satisfactionRate: 0,
    postedRequests: 0
  });

  const handleSignOut = () => {
    Alert.alert(
      'Deconectare',
      'Sunteți sigur că doriți să vă deconectați din aplicație?',
      [
        { text: 'Anulează', style: 'cancel' },
        { 
          text: 'Deconectează', 
          onPress: async () => {
            try {
              await signOut();
              console.log('👋 Utilizator deconectat cu succes');
            } catch (error) {
              console.error('❌ Eroare la deconectare:', error);
              Alert.alert('Eroare', 'A apărut o eroare la deconectare. Încercați din nou.');
            }
          }, 
          style: 'destructive' 
        },
      ]
    );
  };

  const handleTestLogout = async () => {
    console.log('🧪 Testare funcționalitate logout...');
    await logoutTest.checkLogoutStatus();
  };

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

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfileData(profileData);
      }

      // Fetch statistics based on user type
      if (user.userType === 'meserias') {
        // Fetch completed jobs count
        const { count: completedJobs } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('worker_id', user.id)
          .eq('status', 'completed');

        // Fetch average rating
        const { data: ratings } = await supabase
          .from('reviews')
          .select('rating')
          .eq('worker_id', user.id);

        const avgRating = ratings && ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
          : 0;

        setStats({
          completedJobs: completedJobs || 0,
          averageRating: Math.round(avgRating * 10) / 10,
          satisfactionRate: completedJobs ? Math.round((completedJobs / (completedJobs + 2)) * 100) : 98,
          postedRequests: 0
        });
      } else {
        // For clients, fetch posted requests
        const { count: postedRequests } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', user.id);

        const { count: completedJobs } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', user.id)
          .eq('status', 'completed');

        setStats({
          completedJobs: completedJobs || 0,
          averageRating: 4.6,
          satisfactionRate: 0,
          postedRequests: postedRequests || 0
        });
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderClientProfile = () => (
    <View style={styles.profileSection}>
      <Card style={styles.statsCard}>
        <View style={styles.gradientBackground}>
          <Card.Content style={styles.statsContent}>
            <Text style={styles.statsTitle}>📊 Statistici</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statCircle}>
                  <Text style={styles.statNumber}>{stats.postedRequests}</Text>
                </View>
                <Text style={styles.statLabel}>Cereri postate</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statCircle}>
                  <Text style={styles.statNumber}>{stats.completedJobs}</Text>
                </View>
                <Text style={styles.statLabel}>Lucrări finalizate</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statCircle}>
                  <Text style={styles.statNumber}>{stats.averageRating}</Text>
                </View>
                <Text style={styles.statLabel}>Rating mediu</Text>
              </View>
            </View>
          </Card.Content>
        </View>
      </Card>
    </View>
  );

  const renderMeseriasProfile = () => (
    <View style={styles.profileSection}>
      <Card style={styles.statsCard}>
        <View style={styles.gradientBackground}>
          <Card.Content style={styles.statsContent}>
            <Text style={styles.statsTitle}>🏆 Statistici profesionale</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statCircle}>
                  <Text style={styles.statNumber}>{stats.completedJobs}</Text>
                </View>
                <Text style={styles.statLabel}>Lucrări finalizate</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statCircle}>
                  <Text style={styles.statNumber}>{stats.averageRating}</Text>
                </View>
                <Text style={styles.statLabel}>Rating mediu</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statCircle}>
                  <Text style={styles.statNumber}>{stats.satisfactionRate}%</Text>
                </View>
                <Text style={styles.statLabel}>Rata de satisfacție</Text>
              </View>
            </View>
          </Card.Content>
        </View>
      </Card>

      <Card style={styles.servicesCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>🛠️ Servicii oferite</Text>
          <View style={styles.servicesContainer}>
            <View style={styles.serviceTag}>
              <Text style={styles.serviceText}>⚡ Instalații electrice</Text>
            </View>
            <View style={styles.serviceTag}>
              <Text style={styles.serviceText}>🔧 Reparații generale</Text>
            </View>
            <View style={styles.serviceTag}>
              <Text style={styles.serviceText}>💡 Montaj corpuri iluminat</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Se încarcă profilul...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with gradient background */}
        <View style={styles.headerGradient}>
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>
                  {user?.userType === 'meserias' ? '👨‍🔧' : '👤'}
                </Text>
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{profileData?.name || user?.name || 'Utilizator'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.userTypeContainer}>
                  <Icon 
                    name={user?.userType === 'meserias' ? 'build' : 'person'} 
                    size={16} 
                    color="#fff" 
                  />
                  <Text style={styles.userType}>
                    {user?.userType === 'meserias' ? 'Meseriaș' : 'Client'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.headerButtons}>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('EditProfile')} 
                style={styles.editButton}
                contentStyle={styles.editButtonContent}
                labelStyle={styles.editButtonLabel}
              >
                <Icon name="edit" size={16} color="#fff" />
              </Button>
              <Button 
                mode="outlined" 
                onPress={handleSignOut}
                icon="logout"
                textColor="#fff"
                style={styles.logoutButton}
                contentStyle={styles.logoutButtonContent}
                labelStyle={styles.logoutButtonLabel}
              >
                Ieșire
              </Button>
            </View>
          </View>
        </View>

        {user?.userType === 'meserias' ? renderMeseriasProfile() : renderClientProfile()}

        {/* Settings Section */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>⚙️ Setări cont</Text>
            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Icon name="account-edit" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Informații personale</Text>
                  <Text style={styles.settingDescription}>Actualizează datele de contact</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.textSecondary} />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Icon name="bell-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Notificări</Text>
                  <Text style={styles.settingDescription}>Gestionează preferințele de notificare</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.textSecondary} />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Icon name="shield-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Securitate</Text>
                  <Text style={styles.settingDescription}>Schimbă parola și setări de securitate</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.textSecondary} />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Icon name="credit-card-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Plăți și facturare</Text>
                  <Text style={styles.settingDescription}>Gestionează metodele de plată</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.textSecondary} />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Support Section */}
        <Card style={styles.supportCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🆘 Suport</Text>
            <View style={styles.supportList}>
              <View style={styles.supportItem}>
                <View style={styles.supportIcon}>
                  <Icon name="help-circle-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportTitle}>Ajutor și suport</Text>
                  <Text style={styles.supportDescription}>Întrebări frecvente și contact</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.textSecondary} />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.supportItem}>
                <View style={styles.supportIcon}>
                  <Icon name="file-document-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportTitle}>Termeni și condiții</Text>
                  <Text style={styles.supportDescription}>Citește termenii de utilizare</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.textSecondary} />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.supportItem}>
                <View style={styles.supportIcon}>
                  <Icon name="shield-check-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportTitle}>Politica de confidențialitate</Text>
                  <Text style={styles.supportDescription}>Cum îți protejăm datele</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.textSecondary} />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Logout Section */}
        <Card style={styles.logoutCard}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleSignOut}
              icon="logout"
              style={styles.signOutButton}
              contentStyle={styles.signOutButtonContent}
              labelStyle={styles.signOutButtonLabel}
            >
              Deconectează-te
            </Button>
            
            <Button
              mode="text"
              onPress={handleTestLogout}
              icon="bug"
              style={styles.testButton}
              contentStyle={styles.testButtonContent}
              labelStyle={styles.testButtonLabel}
            >
              Test Logout
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.version}>Versiunea 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#667eea',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 0,
  },
  editButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    borderRadius: 25,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoutButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    fontSize: 60,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userType: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  profileSection: {
    marginTop: -20,
    paddingHorizontal: 20,
  },
  statsCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradientBackground: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#667eea',
  },
  statsContent: {
    padding: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  servicesCard: {
    marginTop: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  serviceText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  settingsCard: {
    margin: 20,
    marginTop: 30,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  supportCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  settingsList: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  supportList: {
    gap: 8,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  supportDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: colors.border,
  },
  logoutCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signOutButton: {
    borderRadius: 25,
    backgroundColor: colors.error,
    marginBottom: 12,
  },
  signOutButtonContent: {
    paddingVertical: 12,
  },
  signOutButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    borderRadius: 25,
  },
  testButtonContent: {
    paddingVertical: 8,
  },
  testButtonLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  version: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});

export default ProfileScreen;
