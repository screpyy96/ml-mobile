/**
 * Design System - Shadow Utilities
 * Optimized shadow handling for better performance
 */

import { ViewStyle } from 'react-native';
import { ShadowStyle } from '../tokens/shadows';

/**
 * Creates an optimized shadow style with proper background color
 * This prevents React Native shadow calculation warnings
 */
export const createOptimizedShadow = (
  shadowStyle: ShadowStyle,
  backgroundColor: string = 'white'
): ViewStyle => {
  return {
    backgroundColor, // Required for efficient shadow calculation
    ...shadowStyle,
  };
};

/**
 * Creates a shadow wrapper style for components that need shadows
 * but don't have a solid background
 */
export const createShadowWrapper = (
  shadowStyle: ShadowStyle,
  backgroundColor: string = 'white'
): ViewStyle => {
  return {
    backgroundColor,
    borderRadius: 8, // Default border radius
    ...shadowStyle,
  };
};

/**
 * Removes shadows from a style object
 */
export const removeShadow = (style: ViewStyle): ViewStyle => {
  const { 
    shadowColor, 
    shadowOffset, 
    shadowOpacity, 
    shadowRadius, 
    elevation,
    ...rest 
  } = style;
  
  return rest;
};
