import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Input } from '../../design-system/components/Input';
import { Button } from '../../design-system/components/Button';
import { Card } from '../../design-system/components/Card';
import { useSuccessToast, useErrorToast, useLoadingToast } from '../../design-system/components/Toast';
import { supabase } from '../../config/supabase';
import { profileManager } from '../../utils/profileManager';

type CompleteProfileScreenProps = {
  navigation: StackNavigationProp<any>;
};

export const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({ navigation }) => {
  const [accountType, setAccountType] = useState<'client' | 'worker' | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const fadeAnimation = useSharedValue(0);
  const slideAnimation = useSharedValue(50);

  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const { showLoading, hideLoading } = useLoadingToast();

  useEffect(() => {
    fadeAnimation.value = withTiming(1, { duration: 800 });
    slideAnimation.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  const validateForm = () => {
    let isValid = true;

    if (!fullName.trim()) {
      setFullNameError('Numele complet este obligatoriu');
      isValid = false;
    } else {
      setFullNameError('');
    }

    if (!phone.trim()) {
      setPhoneError('Numărul de telefon este obligatoriu');
      isValid = false;
    } else if (!/^(\+40|0)[0-9]{9}$/.test(phone.trim())) {
      setPhoneError('Numărul de telefon nu este valid');
      isValid = false;
    } else {
      setPhoneError('');
    }

    if (!accountType) {
      showErrorToast('Te rugăm să selectezi tipul de cont');
      isValid = false;
    }

    return isValid;
  };

  const handleCompleteProfile = async () => {
    if (!validateForm()) {
      Vibration.vibrate([0, 100, 50, 100]);
      return;
    }

    try {
      setLoading(true);
      showLoading('Actualizare profil...');

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilizatorul nu este autentificat');
      }

      // Update profile with user's choice
      const updatedProfile = await profileManager.updateProfile(user.id, {
        role: accountType || 'client',
        name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        bio: bio.trim(),
      });

      if (!updatedProfile) {
        throw new Error('Eroare la actualizarea profilului');
      }

      hideLoading();
      showSuccessToast('Profil completat cu succes!');

      // Navigate to main app - AuthContext will handle dashboard routing
      navigation.navigate('Home' as any);
    } catch (error: any) {
      hideLoading();
      console.error('Error completing profile:', error);
      showErrorToast('Eroare la completarea profilului. Încearcă din nou.');
      Vibration.vibrate([0, 100, 50, 100]);
    } finally {
      setLoading(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
    transform: [{ translateY: slideAnimation.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Completează profilul tău</Text>
            <Text style={styles.subtitle}>
              Spune-ne câteva lucruri despre tine pentru a-ți personaliza experiența
            </Text>
          </View>

          {/* Account Type Selection */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tip de cont</Text>
            <Text style={styles.sectionDescription}>
              Alege tipul de cont care se potrivește cel mai bine cu nevoile tale
            </Text>
            
                         <View style={styles.accountTypeContainer}>
               <View
                 style={[
                   styles.accountTypeOption,
                   accountType === 'client' && styles.selectedOption,
                 ]}
                 onTouchEnd={() => setAccountType('client')}
               >
                <Text style={styles.accountTypeEmoji}>👤</Text>
                <Text style={styles.accountTypeTitle}>Client</Text>
                <Text style={styles.accountTypeDescription}>
                  Vrei să găsești servicii și să angajezi meșteri
                </Text>
                {accountType === 'client' && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>

                             <View
                 style={[
                   styles.accountTypeOption,
                   accountType === 'worker' && styles.selectedOption,
                 ]}
                 onTouchEnd={() => setAccountType('worker')}
               >
                <Text style={styles.accountTypeEmoji}>🔧</Text>
                <Text style={styles.accountTypeTitle}>Meșter</Text>
                <Text style={styles.accountTypeDescription}>
                  Vrei să oferi servicii și să câștigi bani
                </Text>
                {accountType === 'worker' && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
                         </View>
           </View>

          {/* Personal Information */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informații personale</Text>
            
            <Input
              label="Nume complet"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (fullNameError) setFullNameError('');
              }}
              leftIcon="person"
              error={!!fullNameError}
              errorMessage={fullNameError}
              floatingLabel
              containerStyle={styles.input}
            />

            <Input
              label="Număr de telefon"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (phoneError) setPhoneError('');
              }}
              keyboardType="phone-pad"
              leftIcon="phone"
              error={!!phoneError}
              errorMessage={phoneError}
              floatingLabel
              containerStyle={styles.input}
            />

            <Input
              label="Adresă (opțional)"
              value={address}
              onChangeText={setAddress}
              leftIcon="location-on"
              floatingLabel
              containerStyle={styles.input}
            />

            <Input
              label="Despre tine (opțional)"
              value={bio}
              onChangeText={setBio}
              leftIcon="info"
              multiline
              numberOfLines={3}
              floatingLabel
              containerStyle={styles.input}
                         />
           </View>

          {/* Complete Button */}
          <Button
            title="Completează profilul"
            onPress={handleCompleteProfile}
            loading={loading}
            disabled={loading}
            style={styles.completeButton}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  card: {
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  accountTypeContainer: {
    gap: 12,
  },
  accountTypeOption: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  selectedOption: {
    borderColor: '#fbbf24',
    backgroundColor: '#fef3c7',
  },
  accountTypeEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  accountTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  accountTypeDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontSize: 18,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  completeButton: {
    marginTop: 20,
  },
});
