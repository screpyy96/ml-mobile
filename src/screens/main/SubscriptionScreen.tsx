import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { supabase } from '../../config/supabase';

interface SubscriptionPlan {
  plan_id: string;
  name: string;
  description: string;
  price_monthly: number;
  credits_granted: number;
  stripe_price_id_monthly: string;
  display_order: number;
}

interface UserSubscription {
  plan_id: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
}

interface UserCredits {
  balance: number;
  total_earned: number;
  total_spent: number;
}

const SubscriptionScreen: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSubscriptionData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadPlans(),
        loadUserSubscription(),
        loadUserCredits(),
      ]);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      Alert.alert('Eroare', 'Nu s-au putut încărca datele abonamentului');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSubscriptionData();
  }, [loadSubscriptionData]);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setUserSubscription(data);
    } catch (error) {
      console.error('Error loading user subscription:', error);
    }
  };

  const loadUserCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setUserCredits(data);
    } catch (error) {
      console.error('Error loading user credits:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSubscriptionData();
    setRefreshing(false);
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    Alert.alert(
      'Upgrade la Premium',
      `Dorești să te abonezi la planul ${plan.name} pentru ${plan.price_monthly} RON/lună?`,
      [
        { text: 'Anulează', style: 'cancel' },
        { 
          text: 'Abonează-te', 
          onPress: () => {
            // TODO: Implement Stripe checkout
            Alert.alert('Info', 'Funcționalitatea de plată va fi implementată în curând.');
          }
        },
      ]
    );
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Gestionează Abonamentul',
      'Dorești să accesezi portalul de gestionare a abonamentului?',
      [
        { text: 'Anulează', style: 'cancel' },
        { 
          text: 'Accesează', 
          onPress: () => {
            // TODO: Implement customer portal redirect
            Alert.alert('Info', 'Portalul de gestionare va fi implementat în curând.');
          }
        },
      ]
    );
  };

  const renderSubscriptionStatus = () => {
    const subscription = userSubscription || { plan_id: 'basic', status: 'active' };
    const credits = userCredits || { balance: 0 };
    
    return (
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={[
            styles.statusIcon,
            { backgroundColor: subscription.plan_id === 'basic' ? '#10b981' : '#f59e0b' }
          ]}>
            <Icon 
              name={subscription.plan_id === 'basic' ? 'check-circle' : 'star'} 
              size={24} 
              color="#fff" 
            />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {subscription.plan_id === 'basic' ? 'Planul Tău Basic' : 'Abonamentul Tău Premium'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {subscription.plan_id === 'basic' 
                ? 'Plan gratuit cu funcționalități de bază' 
                : 'Acces complet la toate funcționalitățile'
              }
            </Text>
          </View>
        </View>

        <View style={styles.statusDetails}>
          <View style={styles.statusItem}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.statusText}>
              Plan: <Text style={styles.statusBold}>
                {subscription.plan_id === 'basic' ? 'Basic' : subscription.plan_id}
              </Text>
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[
              styles.statusDot,
              { backgroundColor: subscription.status === 'active' ? '#10b981' : '#ef4444' }
            ]} />
            <Text style={styles.statusText}>
              Status: <Text style={styles.statusBold}>
                {subscription.status}
              </Text>
            </Text>
          </View>

          {subscription.plan_id === 'basic' && (
            <>
              <View style={styles.statusItem}>
                <Icon name="star" size={16} color="#f59e0b" />
                <Text style={styles.statusText}>
                  <Text style={styles.statusBold}>Gratuit</Text> - Fără costuri lunare
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Icon name="account-balance-wallet" size={16} color="#10b981" />
                <Text style={styles.statusText}>
                  <Text style={styles.statusBold}>{credits.balance} credite</Text> - Se reînnoiesc lunar automat
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.statusActions}>
          {subscription.plan_id !== 'basic' && subscription.status === 'active' ? (
            <TouchableOpacity 
              style={styles.manageButton}
              onPress={handleManageSubscription}
            >
              <Icon name="settings" size={20} color="#fff" />
              <Text style={styles.manageButtonText}>Gestionează Abonamentul</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => {
                // TODO: Navigate to pricing screen
                Alert.alert('Info', 'Pagina de prețuri va fi implementată în curând.');
              }}
            >
              <Icon name="star" size={20} color="#fff" />
              <Text style={styles.upgradeButtonText}>Upgrade la Premium</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isCurrentPlan = userSubscription?.plan_id === plan.plan_id;
    
    return (
      <View key={plan.plan_id} style={[
        styles.planCard,
        isCurrentPlan && styles.currentPlanCard
      ]}>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{plan.price_monthly} RON/lună</Text>
        </View>
        
        <Text style={styles.planDescription}>{plan.description}</Text>
        
        <View style={styles.planFeatures}>
          <View style={styles.planFeature}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.planFeatureText}>
              {plan.credits_granted} credite lunar
            </Text>
          </View>
          <View style={styles.planFeature}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.planFeatureText}>
              Acces la contacte meseriași
            </Text>
          </View>
          <View style={styles.planFeature}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.planFeatureText}>
              Notificări prioritare
            </Text>
          </View>
        </View>

        {!isCurrentPlan && (
          <TouchableOpacity 
            style={styles.planButton}
            onPress={() => handleUpgrade(plan)}
          >
            <Text style={styles.planButtonText}>
              {plan.plan_id === 'basic' ? 'Planul Actual' : 'Alege Planul'}
            </Text>
          </TouchableOpacity>
        )}

        {isCurrentPlan && (
          <View style={styles.currentPlanBadge}>
            <Text style={styles.currentPlanText}>Planul Actual</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Se încarcă...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Abonament</Text>
          <Text style={styles.headerSubtitle}>
            Prezentare generală a planului tău și opțiuni de upgrade
          </Text>
        </View>

        {userSubscription ? (
          <>
            {renderSubscriptionStatus()}
            
            <View style={styles.plansSection}>
              <Text style={styles.sectionTitle}>Planuri Disponibile</Text>
              <View style={styles.plansGrid}>
                {plans.map(renderPlanCard)}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noSubscriptionContainer}>
            <View style={styles.noSubscriptionIcon}>
              <Icon name="star" size={48} color="#f59e0b" />
            </View>
            <Text style={styles.noSubscriptionTitle}>
              Alege Planul Premium Potrivit
            </Text>
            <Text style={styles.noSubscriptionSubtitle}>
              Deblochează accesul la contacte, primește alerte despre joburi noi și crește-ți afacerea cu un abonament premium.
            </Text>
            
            <View style={styles.plansGrid}>
              {plans.map(renderPlanCard)}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusCard: {
    backgroundColor: colors.white,
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusDetails: {
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  statusBold: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 15,
  },
  manageButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  plansSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  plansGrid: {
    gap: 15,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: '#10b981',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  planFeatures: {
    marginBottom: 20,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  planButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  planButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentPlanBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  currentPlanText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noSubscriptionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noSubscriptionIcon: {
    marginBottom: 20,
  },
  noSubscriptionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  noSubscriptionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
});

export default SubscriptionScreen;
