import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Screen } from '../../design-system';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { 
  Button,
  Card,
  useTheme,
} from '../../design-system';
import { Images } from '../../assets/images';

const { width: screenWidth } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <Screen backgroundColor={theme.colors.background.primary}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={Images.logo} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, { color: '#0f172a' }]}>
              Meserias Local
            </Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: '#0f172a' }]}>
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: theme.colors.text.inverse }]}>
              Găsește{' '}
              <Text style={{ color: '#fbbf24' }}>meseriașul perfect</Text>
            </Text>
            <Text style={[styles.heroSubtitle, { color: '#cbd5e1' }]}>
              Peste 850 meseriași verificați gata să îți facă oferte personalizate
            </Text>

            {/* CTA Buttons */}
            <View style={styles.ctaContainer}>
              <Button
                title="Începe acum"
                variant="primary"
                size="large"
                onPress={handleRegister}
                fullWidth
                style={{ backgroundColor: '#fbbf24' }}
                textStyle={{ color: '#0f172a', fontWeight: '600' }}
              />
              <Button
                title="Am deja cont"
                variant="outline"
                size="large"
                onPress={handleLogin}
                fullWidth
                style={{ 
                  borderColor: '#475569',
                  borderWidth: 2,
                  marginTop: 12,
                  backgroundColor: 'transparent',
                }}
                textStyle={{ color: theme.colors.text.inverse }}
              />
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View style={[styles.section, { backgroundColor: '#f8fafc' }]}>
          <Text style={[styles.sectionTitle, { color: '#0f172a' }]}>
            Cum funcționează?
          </Text>
          
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#fbbf24' }]}>
                <Text style={[styles.stepNumberText, { color: '#0f172a' }]}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: '#0f172a' }]}>
                  Descrie serviciul
                </Text>
                <Text style={[styles.stepDescription, { color: '#64748b' }]}>
                  Spune-ne ce ai nevoie și unde
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#fbbf24' }]}>
                <Text style={[styles.stepNumberText, { color: '#0f172a' }]}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: '#0f172a' }]}>
                  Primește oferte
                </Text>
                <Text style={[styles.stepDescription, { color: '#64748b' }]}>
                  Meseriașii îți trimit propuneri personalizate
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#fbbf24' }]}>
                <Text style={[styles.stepNumberText, { color: '#0f172a' }]}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: '#0f172a' }]}>
                  Alege și finalizează
                </Text>
                <Text style={[styles.stepDescription, { color: '#64748b' }]}>
                  Selectează cel mai bun meseriaș
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
    marginBottom: 40,
    paddingHorizontal: 20,
    letterSpacing: -0.2,
  },

  ctaContainer: {
    width: '100%',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.6,
  },

  stepsContainer: {
    gap: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  stepDescription: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.1,
  },



});

export default HomeScreen;
