import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { 
  Button,
  Image,
  useTheme
} from '../../design-system';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start entry animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnimation,
            transform: [{ translateY: slideAnimation }],
          }
        ]}
      >
        {/* Logo Section */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
            }
          ]}
        >
          <Image 
            source={require('../../../temp-icons/logo-1024.png')}
            width={120}
            height={120}
            shape="rounded"
            style={styles.logo}
          />
          <Text style={[styles.title, { color: theme.colors.primary[500] }]}>
            MeseriasLocal
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Connect with local craftsmen
          </Text>
        </Animated.View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            variant="primary"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
            size="large"
            fullWidth
          />
          
          <Button
            title="Create Account"
            variant="outline"
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
            size="large"
            fullWidth
          />
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
          Find verified craftsmen quickly for any home improvement project
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logo: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default WelcomeScreen;