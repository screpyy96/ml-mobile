/**
 * Design System - Shadow Tokens
 * Consistent shadow system for Meserias Local app
 */

import { ViewStyle } from 'react-native';

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android elevation
}

export interface ShadowScale {
  none: ShadowStyle;
  xs: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  xl: ShadowStyle;
}

export const shadows: ShadowScale = {
  // No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0
  },
  
  // Extra small shadow - subtle depth
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1
  },
  
  // Small shadow - cards, buttons
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  
  // Medium shadow - elevated cards, dropdowns
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4
  },
  
  // Large shadow - modals, floating elements
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8
  },
  
  // Extra large shadow - overlays, important elements
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16
  }
};

// Dark mode shadows (lighter shadow color)
export const darkShadows: ShadowScale = {
  none: shadows.none,
  
  xs: {
    ...shadows.xs,
    shadowColor: '#ffffff',
    shadowOpacity: 0.1
  },
  
  sm: {
    ...shadows.sm,
    shadowColor: '#ffffff',
    shadowOpacity: 0.15
  },
  
  md: {
    ...shadows.md,
    shadowColor: '#ffffff',
    shadowOpacity: 0.2
  },
  
  lg: {
    ...shadows.lg,
    shadowColor: '#ffffff',
    shadowOpacity: 0.25
  },
  
  xl: {
    ...shadows.xl,
    shadowColor: '#ffffff',
    shadowOpacity: 0.3
  }
};

// Helper function to apply shadow styles
export const applyShadow = (shadowKey: keyof ShadowScale, isDark: boolean = false): ViewStyle => {
  const shadowScale = isDark ? darkShadows : shadows;
  return shadowScale[shadowKey];
};