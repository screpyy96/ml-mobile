/**
 * Design System - Animation Utilities
 * Helper functions and utilities for animations
 */

import { Animated, Easing } from 'react-native';
import { animations, easingCurves, springConfigs, interactionTimings } from '../tokens/animations';

// Create animated value with initial value
export const createAnimatedValue = (initialValue: number = 0): Animated.Value => {
  return new Animated.Value(initialValue);
};

// Create animated XY value
export const createAnimatedXY = (initialX: number = 0, initialY: number = 0): Animated.ValueXY => {
  return new Animated.ValueXY({ x: initialX, y: initialY });
};

// Timing animation with preset configurations
export const createTimingAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  preset: keyof typeof animations = 'standard',
  useNativeDriver: boolean = true
): Animated.CompositeAnimation => {
  const config = animations[preset];
  
  return Animated.timing(animatedValue, {
    toValue,
    duration: config.duration,
    easing: getEasingFunction(config.easing),
    useNativeDriver
  });
};

// Spring animation with preset configurations
export const createSpringAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  preset: keyof typeof springConfigs = 'gentle',
  useNativeDriver: boolean = true
): Animated.CompositeAnimation => {
  const config = springConfigs[preset];
  
  return Animated.spring(animatedValue, {
    toValue,
    tension: config.tension,
    friction: config.friction,
    useNativeDriver
  });
};

// Get easing function from string
export const getEasingFunction = (easingName: string): ((value: number) => number) => {
  switch (easingName) {
    case 'linear':
      return Easing.linear;
    case 'ease-in':
      return Easing.in(Easing.ease);
    case 'ease-out':
      return Easing.out(Easing.ease);
    case 'ease-in-out':
      return Easing.inOut(Easing.ease);
    default:
      return Easing.inOut(Easing.ease);
  }
};

// Button press animation
export const createButtonPressAnimation = (
  scaleValue: Animated.Value,
  onPressIn?: () => void,
  onPressOut?: () => void
) => {
  const pressIn = () => {
    onPressIn?.();
    createTimingAnimation(scaleValue, 0.95, 'quick').start();
  };

  const pressOut = () => {
    onPressOut?.();
    createTimingAnimation(scaleValue, 1, 'quick').start();
  };

  return { pressIn, pressOut };
};

// Card press animation
export const createCardPressAnimation = (
  scaleValue: Animated.Value,
  onPressIn?: () => void,
  onPressOut?: () => void
) => {
  const pressIn = () => {
    onPressIn?.();
    createTimingAnimation(scaleValue, 0.98, 'quick').start();
  };

  const pressOut = () => {
    onPressOut?.();
    createTimingAnimation(scaleValue, 1, 'quick').start();
  };

  return { pressIn, pressOut };
};

// Fade animation
export const createFadeAnimation = (
  opacityValue: Animated.Value,
  toValue: number,
  duration: number = animations.standard.duration
): Animated.CompositeAnimation => {
  return Animated.timing(opacityValue, {
    toValue,
    duration,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true
  });
};

// Slide animation
export const createSlideAnimation = (
  translateValue: Animated.Value,
  toValue: number,
  duration: number = animations.standard.duration
): Animated.CompositeAnimation => {
  return Animated.timing(translateValue, {
    toValue,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true
  });
};

// Scale animation
export const createScaleAnimation = (
  scaleValue: Animated.Value,
  toValue: number,
  preset: keyof typeof springConfigs = 'gentle'
): Animated.CompositeAnimation => {
  return createSpringAnimation(scaleValue, toValue, preset);
};

// Rotation animation
export const createRotationAnimation = (
  rotateValue: Animated.Value,
  duration: number = 1000,
  loop: boolean = true
): Animated.CompositeAnimation => {
  const animation = Animated.timing(rotateValue, {
    toValue: 1,
    duration,
    easing: Easing.linear,
    useNativeDriver: true
  });

  if (loop) {
    return Animated.loop(animation);
  }

  return animation;
};

// Shake animation for errors
export const createShakeAnimation = (
  translateValue: Animated.Value,
  intensity: number = 10
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(translateValue, {
      toValue: intensity,
      duration: 50,
      useNativeDriver: true
    }),
    Animated.timing(translateValue, {
      toValue: -intensity,
      duration: 50,
      useNativeDriver: true
    }),
    Animated.timing(translateValue, {
      toValue: intensity,
      duration: 50,
      useNativeDriver: true
    }),
    Animated.timing(translateValue, {
      toValue: -intensity,
      duration: 50,
      useNativeDriver: true
    }),
    Animated.timing(translateValue, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true
    })
  ]);
};

// Pulse animation
export const createPulseAnimation = (
  scaleValue: Animated.Value,
  minScale: number = 0.95,
  maxScale: number = 1.05,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: maxScale,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(scaleValue, {
        toValue: minScale,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ])
  );
};

// Stagger animation for lists
export const createStaggerAnimation = (
  animations: Animated.CompositeAnimation[],
  staggerDelay: number = 100
): Animated.CompositeAnimation => {
  return Animated.stagger(staggerDelay, animations);
};

// Parallel animation
export const createParallelAnimation = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.parallel(animations);
};

// Sequence animation
export const createSequenceAnimation = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.sequence(animations);
};