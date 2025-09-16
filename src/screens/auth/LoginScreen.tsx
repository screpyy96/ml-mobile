import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Vibration } from 'react-native';
import { Text } from 'react-native';
import { Screen } from '../../design-system';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import {
  Button,
  GoogleIcon,
  Input,
  Image,
  useTheme,
  useSuccessToast,
  useErrorToast,
  useLoadingToast
} from '../../design-system';
import { debugAuth } from '../../utils/authDebug';
import { configureGoogleSignIn, googleSignIn } from '../../config/googleAuth';
import { profileManager } from '../../utils/profileManager';
import { supabase } from '../../config/supabase';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signIn } = useAuth();
  const { theme } = useTheme();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const { showLoading, hideLoading } = useLoadingToast();

  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;

  // Validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Emailul este obligatoriu';
    }
    if (!emailRegex.test(email)) {
      return 'Te rugăm să introduci un email valid';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Parola este obligatorie';
    }
    if (password.length < 6) {
      return 'Parola trebuie să aibă minim 6 caractere';
    }
    return '';
  };

  // Handle form validation
  const validateForm = () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    return !emailErr && !passwordErr;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Vibration.vibrate([0, 100, 50, 100]);
      return;
    }

    setLoading(true);
    showLoading('Signing in...');

    try {
      await signIn(email, password);
      hideLoading();
      showSuccessToast('Welcome back!');
    } catch (error: any) {
      hideLoading();
      showErrorToast(error.message || 'Login failed. Please try again.');
      Vibration.vibrate([0, 100, 50, 100]);
    } finally {
      setLoading(false);
    }
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

    // Configure Google Sign-In
    try {
      configureGoogleSignIn();
      console.log('✅ Google Sign-In configured successfully');
    } catch (error) {
      console.error('❌ Google Sign-In configuration failed:', error);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      showLoading('Conectare cu Google...');
      
      // Sign in with Google
      const userInfo = await googleSignIn.signIn();
      console.log('Google Sign-In successful:', userInfo);
      
      // Get the ID token for Supabase
      const tokens = await googleSignIn.getTokens();
      console.log('🔑 Google tokens received:', {
        idToken: tokens.idToken ? 'Present' : 'Missing',
        accessToken: tokens.accessToken ? 'Present' : 'Missing'
      });
      
      if (!tokens.idToken) {
        throw new Error('ID token not received from Google');
      }
      
      // Sign in to Supabase with Google ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: tokens.idToken,
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Supabase Google Sign-In successful:', data);
      
      // Ensure user profile exists in profiles table
      let userProfile = null;
      if (data.user) {
        userProfile = await profileManager.ensureProfile(data.user);
        
        if (userProfile) {
          console.log('✅ User profile ensured:', userProfile);
        } else {
          console.error('❌ Failed to ensure user profile');
          showErrorToast('Eroare la gestionarea profilului. Contactează suportul.');
        }
      }
      
      hideLoading();
      showSuccessToast('Conectare reușită cu Google!');
      
      // Check role and navigate accordingly
      if (!userProfile?.role || userProfile.role === 'guest') {
        // User needs to complete profile setup
        console.log('👤 User needs to complete profile setup');
        navigation.navigate('CompleteProfile' as any);
      } else {
        // Navigate to main app - AuthContext will handle dashboard routing
        console.log('🚀 Navigating to main app');
        navigation.navigate('Home' as any);
      }
    } catch (error: any) {
      hideLoading();
      console.error('Google Sign-In Error:', error);
      showErrorToast('Conectarea cu Google a eșuat. Încearcă din nou.');
      Vibration.vibrate([0, 100, 50, 100]);
    } finally {
      setLoading(false);
    }
  };

  const handleDebug = async () => {
    console.log('🔧 Pornire debug autentificare...');
    await debugAuth.checkProfilesTable();
    await debugAuth.listUsers();
  };

  const testGoogleSignIn = async () => {
    try {
      console.log('🧪 Testing Google Sign-In module...');
      
      // Test if module is available
      const isAvailable = await googleSignIn.isSignedIn();
      console.log('✅ Google Sign-In module is available');
      console.log('📊 Is signed in:', isAvailable);
      
      // Test get current user
      const currentUser = await googleSignIn.getCurrentUser();
      console.log('👤 Current user:', currentUser);
      
      showSuccessToast('Google Sign-In module funcționează!');
    } catch (error) {
      console.error('❌ Google Sign-In test failed:', error);
      showErrorToast('Google Sign-In module nu funcționează');
    }
  };

  return (
    <Screen backgroundColor={'#f8fafc'}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnimation,
            transform: [{ translateY: slideAnimation }],
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#0f172a' }]}>
            Bine ai revenit!
          </Text>
          <Text style={[styles.subtitle, { color: '#64748b' }]}>
            Conectează-te la contul tău
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email"
            error={!!emailError}
            errorMessage={emailError}
            floatingLabel
            containerStyle={styles.input}
          />

          <Input
            label="Parolă"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            secureTextEntry={!showPassword}
            leftIcon="lock"
            rightIcon={showPassword ? "visibility-off" : "visibility"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={!!passwordError}
            errorMessage={passwordError}
            floatingLabel
            containerStyle={styles.input}
          />

          <Button
            title="Ai uitat parola?"
            variant="ghost"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}
            textStyle={{ color: '#fbbf24' }}
          />

          <Button
            title="Conectează-te"
            variant="primary"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            textStyle={{ color: '#0f172a', fontWeight: '600' }}
            size="large"
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[styles.dividerText, { color: '#64748b' }]}>
              sau
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In Button */}
          <Button
            title="Conectează-te cu Google"
            variant="outline"
            onPress={handleGoogleSignIn}
            disabled={loading}
            style={styles.googleButton}
            textStyle={{ color: '#3c4043', fontWeight: '500' }}
            leftIcon={<GoogleIcon size={18} />}
            size="large"
          />

          {__DEV__ && (
            <Button
              title="Debug Auth"
              variant="outline"
              onPress={handleDebug}
              style={styles.debugButton}
            />
          )}

          {__DEV__ && (
            <Button
              title="Test Google Sign-In"
              variant="outline"
              onPress={testGoogleSignIn}
              style={styles.debugButton}
            />
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: '#64748b' }]}>
            Nu ai un cont?{' '}
          </Text>
          <Button
            title="Înregistrează-te"
            variant="ghost"
            onPress={() => navigation.navigate('Register')}
            size="small"
            textStyle={{ color: '#fbbf24' }}
          />
        </View>
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
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
    marginBottom: 32,
  },
  input: {
    marginBottom: 20,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  loginButton: {
    marginBottom: 16,
    backgroundColor: '#fbbf24',
  },
  debugButton: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 16,
    letterSpacing: -0.1,
  },
  googleButton: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: 16,
    letterSpacing: -0.1,
  },
});

export default LoginScreen;
