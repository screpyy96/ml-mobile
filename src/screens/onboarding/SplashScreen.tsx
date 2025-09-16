/**
 * Premium Splash Screen
 * Brand animations and smooth transitions
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { Screen } from '../../design-system';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  Image,
  useTheme
} from '../../design-system';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Props {
  navigation: StackNavigationProp<any>;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations sequence
    const animationSequence = Animated.sequence([
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      
      // Logo animation
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      
      // Title animation
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      
      // Hold for a moment
      Animated.delay(1000),
      
      // Fade out
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animationSequence.start(() => {
      // Navigate to next screen after animation completes
      navigation.replace('Welcome');
    });

    return () => {
      animationSequence.stop();
    };
  }, []);

  return (
    <Screen backgroundColor={theme.colors.primary[500]}>
      <Animated.View 
        style={[
          styles.background,
          { 
            backgroundColor: theme.colors.primary[500],
            opacity: backgroundOpacity,
          }
        ]}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../../temp-icons/logo-1024.png')}
            width={120}
            height={120}
            shape="rounded"
            style={styles.logo}
          />
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: theme.colors.text.inverse }
            ]}
          >
            MeseriasLocal
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.text.inverse }
            ]}
          >
            Connect with local craftsmen
          </Text>
        </Animated.View>
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    backgroundColor: 'white', // Add solid background for shadow efficiency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default SplashScreen;
