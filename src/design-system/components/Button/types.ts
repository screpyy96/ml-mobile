/**
 * Design System - Button Types
 * TypeScript interfaces for Button component
 */

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonState = 'normal' | 'pressed' | 'disabled' | 'loading' | 'error';

export interface ButtonProps {
  // Content
  title: string;
  subtitle?: string;
  leftIcon?: string | React.ReactNode;
  rightIcon?: string | React.ReactNode;
  
  // Appearance
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  
  // State
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  
  // Interaction
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  
  // Haptic feedback
  hapticFeedback?: boolean;
  
  // Styling
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export interface ButtonStyleConfig {
  container: ViewStyle;
  text: TextStyle;
  subtitle?: TextStyle;
  icon?: {
    size: number;
    color: string;
  };
}