/**
 * Design System - Navigation Transitions
 * Premium page transition configurations for React Navigation
 */

import { StackNavigationOptions } from '@react-navigation/stack';
import { CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';

// Custom transition timing
const customTransitionSpec = {
  open: {
    animation: 'timing' as const,
    config: {
      duration: 300,
      useNativeDriver: true,
    },
  },
  close: {
    animation: 'timing' as const,
    config: {
      duration: 250,
      useNativeDriver: true,
    },
  },
};

const fastTransitionSpec = {
  open: {
    animation: 'timing' as const,
    config: {
      duration: 200,
      useNativeDriver: true,
    },
  },
  close: {
    animation: 'timing' as const,
    config: {
      duration: 150,
      useNativeDriver: true,
    },
  },
};

// Premium slide transition (default)
export const premiumSlideTransition: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: customTransitionSpec,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  headerStyleInterpolator: ({ current, next }) => {
    return {
      leftLabelStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      titleStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    };
  },
};

// Fade transition for modals
export const fadeTransition: StackNavigationOptions = {
  gestureEnabled: false,
  transitionSpec: customTransitionSpec,
  cardStyleInterpolator: ({ current }) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  },
};

// Modal presentation with backdrop
export const modalTransition: StackNavigationOptions = {
  presentation: 'modal',
  gestureEnabled: true,
  gestureDirection: 'vertical',
  transitionSpec: customTransitionSpec,
  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
};

// Bottom sheet style transition
export const bottomSheetTransition: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'vertical',
  transitionSpec: customTransitionSpec,
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

// Fast slide transition for quick navigation
export const fastSlideTransition: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: fastTransitionSpec,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

// Scale transition for special screens
export const scaleTransition: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: customTransitionSpec,
  cardStyleInterpolator: ({ current, next }) => {
    return {
      cardStyle: {
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }),
          },
        ],
        opacity: current.progress,
      },
    };
  },
};

// Flip transition for special cases
export const flipTransition: StackNavigationOptions = {
  gestureEnabled: false,
  transitionSpec: customTransitionSpec,
  cardStyleInterpolator: ({ current }) => {
    return {
      cardStyle: {
        transform: [
          {
            rotateY: current.progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ['180deg', '90deg', '0deg'],
            }),
          },
        ],
      },
    };
  },
};

// No animation transition
export const noAnimationTransition: StackNavigationOptions = {
  animationEnabled: false,
};

// Custom interpolator for premium slide with shadow
export const premiumSlideWithShadow: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: customTransitionSpec,
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        shadowOpacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
        shadowRadius: 10,
        shadowOffset: {
          width: -5,
          height: 0,
        },
        shadowColor: '#000',
      },
    };
  },
};

// Transition presets for different screen types
export const transitionPresets = {
  // Default transitions
  default: premiumSlideTransition,
  slide: premiumSlideTransition,
  fade: fadeTransition,
  modal: modalTransition,
  
  // Special transitions
  bottomSheet: bottomSheetTransition,
  scale: scaleTransition,
  flip: flipTransition,
  fast: fastSlideTransition,
  shadow: premiumSlideWithShadow,
  none: noAnimationTransition,
};

// Helper function to get transition by name
export const getTransition = (name: keyof typeof transitionPresets): StackNavigationOptions => {
  return transitionPresets[name] || transitionPresets.default;
};