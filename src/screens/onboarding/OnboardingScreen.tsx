/**
 * Premium Onboarding Screen
 * Smooth transitions between steps with progress indicators
 */

import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  Button,
  Image,
  useTheme
} from '../../design-system';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: any;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Find Local Craftsmen',
    subtitle: 'Connect with skilled professionals',
    description: 'Discover trusted craftsmen in your area for all your home improvement needs.',
    image: require('../../../temp-icons/logo-1024.png'),
  },
  {
    id: '2',
    title: 'Book Services Easily',
    subtitle: 'Simple and secure booking',
    description: 'Schedule appointments with just a few taps and track your service requests.',
    image: require('../../../temp-icons/logo-1024.png'),
  },
  {
    id: '3',
    title: 'Quality Guaranteed',
    subtitle: 'Verified professionals only',
    description: 'All craftsmen are verified and rated by the community for your peace of mind.',
    image: require('../../../temp-icons/logo-1024.png'),
  },
];

interface Props {
  navigation: StackNavigationProp<any>;
}

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Animation values
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Handle next step
  const goToNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      // Animate to next step
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        slideAnimation.setValue(screenWidth);
        
        Animated.parallel([
          Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
      
      // Update progress
      Animated.timing(progressAnimation, {
        toValue: (currentStep + 1) / onboardingSteps.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Navigate to auth
      navigation.replace('Auth');
    }
  };

  // Handle previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      // Animate to previous step
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        slideAnimation.setValue(-screenWidth);
        
        Animated.parallel([
          Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
      
      // Update progress
      Animated.timing(progressAnimation, {
        toValue: (currentStep - 1) / onboardingSteps.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Handle skip
  const handleSkip = () => {
    navigation.replace('Auth');
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.secondary[200] }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.primary[500],
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.text.secondary }]}>
          {currentStep + 1} of {onboardingSteps.length}
        </Text>
      </View>
    );
  };

  // Render step dots
  const renderStepDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentStep 
                  ? theme.colors.primary[500] 
                  : theme.colors.secondary[300],
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Skip button */}
      <View style={styles.header}>
        <Button
          title="Skip"
          variant="ghost"
          onPress={handleSkip}
          size="small"
        />
      </View>

      {/* Progress indicator */}
      {renderProgressIndicator()}

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnimation,
            transform: [{ translateX: slideAnimation }],
          },
        ]}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={currentStepData.image}
            width={200}
            height={200}
            shape="rounded"
            style={styles.image}
          />
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {currentStepData.title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.primary[500] }]}>
            {currentStepData.subtitle}
          </Text>
          <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
            {currentStepData.description}
          </Text>
        </View>
      </Animated.View>

      {/* Step dots */}
      {renderStepDots()}

      {/* Navigation buttons */}
      <View style={styles.footer}>
        {currentStep > 0 && (
          <Button
            title="Previous"
            variant="outline"
            onPress={goToPreviousStep}
            style={styles.previousButton}
          />
        )}
        
        <Button
          title={currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
          variant="primary"
          onPress={goToNextStep}
          style={styles.nextButton}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 40,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  image: {
    backgroundColor: 'white', // Add solid background for shadow efficiency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  previousButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

export default OnboardingScreen;