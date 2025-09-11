/**
 * Design System - Animation Tokens
 * Consistent animation timing and easing for Meserias Local app
 */

export interface AnimationConfig {
  duration: number;
  easing: string;
}

export interface AnimationScale {
  instant: AnimationConfig;
  quick: AnimationConfig;
  standard: AnimationConfig;
  slow: AnimationConfig;
  slower: AnimationConfig;
}

export const animations: AnimationScale = {
  // Instant feedback (0ms) - immediate state changes
  instant: {
    duration: 0,
    easing: 'linear'
  },
  
  // Quick interactions (150ms) - button presses, taps, hover states
  quick: {
    duration: 150,
    easing: 'ease-out'
  },
  
  // Standard transitions (300ms) - screen changes, modal appearances, most UI transitions
  standard: {
    duration: 300,
    easing: 'ease-in-out'
  },
  
  // Slow animations (500ms) - complex transitions, onboarding
  slow: {
    duration: 500,
    easing: 'ease-in-out'
  },
  
  // Slower animations (800ms) - dramatic effects, success states
  slower: {
    duration: 800,
    easing: 'ease-in-out'
  }
};

// Easing curves for different animation types
export const easingCurves = {
  // Standard easing curves
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Custom cubic bezier curves
  bounceOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  backOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  anticipate: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Material Design curves
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)'
};

// Spring animation configurations
export interface SpringConfig {
  tension: number;
  friction: number;
}

export const springConfigs = {
  // Gentle spring - smooth, natural feeling
  gentle: {
    tension: 120,
    friction: 14
  },
  
  // Wobbly spring - bouncy, playful
  wobbly: {
    tension: 180,
    friction: 12
  },
  
  // Stiff spring - quick, responsive
  stiff: {
    tension: 200,
    friction: 26
  },
  
  // Slow spring - deliberate, smooth
  slow: {
    tension: 280,
    friction: 60
  }
};

// Animation timing for specific interactions
export const interactionTimings = {
  // Button press feedback
  buttonPress: animations.quick.duration,
  
  // Card tap feedback
  cardPress: animations.quick.duration,
  
  // Page transitions
  pageTransition: animations.standard.duration,
  
  // Modal animations
  modalAppear: animations.standard.duration,
  modalDismiss: animations.quick.duration,
  
  // Loading states
  skeletonPulse: 1500, // Skeleton shimmer cycle
  spinnerRotation: 1000, // Loading spinner rotation
  
  // Toast notifications
  toastAppear: animations.quick.duration,
  toastDismiss: animations.quick.duration,
  toastAutoHide: 3000, // Auto-hide delay
  
  // Form validation
  errorShake: 400, // Error shake animation
  successPulse: 600, // Success feedback
  
  // Image loading
  imageBlurToSharp: animations.standard.duration,
  imageFadeIn: animations.quick.duration
};

// Haptic feedback timing (for iOS)
export const hapticFeedback = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error'
} as const;

export type HapticFeedbackType = keyof typeof hapticFeedback;