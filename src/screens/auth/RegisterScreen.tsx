import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, Vibration, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import { 
  Button, 
  Input, 
  Image,
  Card,
  useTheme,
  useSuccessToast,
  useErrorToast,
  useLoadingToast
} from '../../design-system';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'client' as 'client' | 'meserias',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { signUp } = useAuth();
  const { theme } = useTheme();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const { showLoading, hideLoading } = useLoadingToast();
  
  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;

  // Validation functions
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Entry animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!validateForm()) {
      Vibration.vibrate([0, 100, 50, 100]);
      return;
    }

    setLoading(true);
    showLoading('Creating your account...');
    
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        userType: formData.userType,
      });
      hideLoading();
      showSuccessToast('Account created successfully!');
    } catch (error: any) {
      hideLoading();
      showErrorToast(error.message || 'Registration failed. Please try again.');
      Vibration.vibrate([0, 100, 50, 100]);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f8fafc' }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View 
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#0f172a' }]}>
              Creează cont
            </Text>
            <Text style={[styles.subtitle, { color: '#64748b' }]}>
              Alătură-te comunității MeseriasLocal
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Nume complet"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              leftIcon="person"
              error={!!errors.name}
              errorMessage={errors.name}
              floatingLabel
              containerStyle={styles.input}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              error={!!errors.email}
              errorMessage={errors.email}
              floatingLabel
              containerStyle={styles.input}
            />

            <Input
              label="Telefon (Opțional)"
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              keyboardType="phone-pad"
              leftIcon="phone"
              floatingLabel
              containerStyle={styles.input}
            />

            <Input
              label="Parolă"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? "visibility-off" : "visibility"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={!!errors.password}
              errorMessage={errors.password}
              floatingLabel
              containerStyle={styles.input}
            />

            <Input
              label="Confirmă parola"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              floatingLabel
              containerStyle={styles.input}
            />

            {/* Account Type Selection */}
            <View style={styles.userTypeContainer}>
              <Text style={[styles.userTypeTitle, { color: '#0f172a' }]}>
                Tip de cont
              </Text>
              
              <View style={styles.userTypeOptions}>
                <TouchableOpacity
                  style={[
                    styles.userTypeOption,
                    formData.userType === 'client' && styles.userTypeOptionSelected
                  ]}
                  onPress={() => updateFormData('userType', 'client')}
                >
                  <View style={[
                    styles.userTypeIcon,
                    formData.userType === 'client' && styles.userTypeIconSelected
                  ]}>
                    <Text style={[
                      styles.userTypeIconText,
                      formData.userType === 'client' && styles.userTypeIconTextSelected
                    ]}>
                      👤
                    </Text>
                  </View>
                  <View style={styles.userTypeContent}>
                    <Text style={[
                      styles.userTypeLabel,
                      formData.userType === 'client' && styles.userTypeLabelSelected
                    ]}>
                      Client
                    </Text>
                    <Text style={[
                      styles.userTypeDescription,
                      formData.userType === 'client' && styles.userTypeDescriptionSelected
                    ]}>
                      Caut meseriași pentru proiecte
                    </Text>
                  </View>
                  <View style={[
                    styles.userTypeCheck,
                    formData.userType === 'client' && styles.userTypeCheckSelected
                  ]}>
                    <Text style={styles.userTypeCheckText}>✓</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.userTypeOption,
                    formData.userType === 'meserias' && styles.userTypeOptionSelected
                  ]}
                  onPress={() => updateFormData('userType', 'meserias')}
                >
                  <View style={[
                    styles.userTypeIcon,
                    formData.userType === 'meserias' && styles.userTypeIconSelected
                  ]}>
                    <Text style={[
                      styles.userTypeIconText,
                      formData.userType === 'meserias' && styles.userTypeIconTextSelected
                    ]}>
                      🔧
                    </Text>
                  </View>
                  <View style={styles.userTypeContent}>
                    <Text style={[
                      styles.userTypeLabel,
                      formData.userType === 'meserias' && styles.userTypeLabelSelected
                    ]}>
                      Meseriaș
                    </Text>
                    <Text style={[
                      styles.userTypeDescription,
                      formData.userType === 'meserias' && styles.userTypeDescriptionSelected
                    ]}>
                      Ofer servicii de meserie
                    </Text>
                  </View>
                  <View style={[
                    styles.userTypeCheck,
                    formData.userType === 'meserias' && styles.userTypeCheckSelected
                  ]}>
                    <Text style={styles.userTypeCheckText}>✓</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Creează cont"
              variant="primary"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              textStyle={{ color: '#0f172a', fontWeight: '600' }}
              size="large"
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: '#64748b' }]}>
              Ai deja un cont?{' '}
            </Text>
            <Button
              title="Conectează-te"
              variant="ghost"
              onPress={() => navigation.navigate('Login')}
              size="small"
              textStyle={{ color: '#fbbf24' }}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: '100%',
  },
  animatedContainer: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
  },
  userTypeContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  userTypeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  userTypeOptions: {
    flexDirection: 'column',
    gap: 12,
  },
  userTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  userTypeOptionSelected: {
    borderColor: '#fbbf24',
    backgroundColor: '#fef3c7',
  },
  userTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userTypeIconSelected: {
    backgroundColor: '#fbbf24',
  },
  userTypeIconText: {
    fontSize: 24,
  },
  userTypeIconTextSelected: {
    color: '#0f172a',
  },
  userTypeContent: {
    flex: 1,
  },
  userTypeLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
    color: '#64748b',
  },
  userTypeLabelSelected: {
    color: '#0f172a',
  },
  userTypeDescription: {
    fontSize: 14,
    letterSpacing: -0.1,
    color: '#94a3b8',
  },
  userTypeDescriptionSelected: {
    color: '#64748b',
  },
  userTypeCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  userTypeCheckSelected: {
    backgroundColor: '#fbbf24',
  },
  userTypeCheckText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  registerButton: {
    marginBottom: 16,
    backgroundColor: '#fbbf24',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 16,
    letterSpacing: -0.1,
  },
});

export default RegisterScreen;