/**
 * Design System - Input Types
 * TypeScript interfaces for Input component
 */

import { ViewStyle, TextStyle, TextInputProps } from 'react-native';

export type InputVariant = 'default' | 'search' | 'textarea' | 'premium';
export type InputState = 'normal' | 'focused' | 'error' | 'success' | 'disabled';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  // Content
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  
  // Appearance
  variant?: InputVariant;
  size?: InputSize;
  
  // State
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  
  // Icons
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  
  // Floating label
  floatingLabel?: boolean;
  
  // Search specific
  onClear?: () => void;
  showClearButton?: boolean;
  
  // Styling
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export interface InputStyleConfig {
  container: ViewStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  label: TextStyle;
  helperText: TextStyle;
  icon: {
    size: number;
    color: string;
  };
}