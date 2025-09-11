/**
 * Design System - Input Variants
 * Specialized input components for common use cases
 */

import React from 'react';
import { Input } from './Input';
import { InputProps } from './types';

// Search input with built-in search icon and clear functionality
export const SearchInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input 
    {...props} 
    variant="search" 
    showClearButton 
    placeholder={props.placeholder || "Search..."} 
  />
);

// Textarea input for multi-line text
export const TextArea: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input {...props} variant="textarea" />
);

// Email input with validation
export const EmailInput: React.FC<Omit<InputProps, 'keyboardType' | 'autoCapitalize' | 'autoCorrect'>> = (props) => (
  <Input
    {...props}
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    leftIcon="email"
  />
);

// Password input with show/hide functionality
interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'rightIcon' | 'onRightIconPress'> {
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  showPassword = false, 
  onTogglePassword,
  ...props 
}) => (
  <Input
    {...props}
    secureTextEntry={!showPassword}
    leftIcon="lock"
    rightIcon={showPassword ? "visibility-off" : "visibility"}
    onRightIconPress={onTogglePassword}
  />
);

// Phone input
export const PhoneInput: React.FC<Omit<InputProps, 'keyboardType'>> = (props) => (
  <Input
    {...props}
    keyboardType="phone-pad"
    leftIcon="phone"
  />
);

// Number input
export const NumberInput: React.FC<Omit<InputProps, 'keyboardType'>> = (props) => (
  <Input
    {...props}
    keyboardType="numeric"
  />
);

// Currency input
export const CurrencyInput: React.FC<Omit<InputProps, 'keyboardType' | 'leftIcon'>> = (props) => (
  <Input
    {...props}
    keyboardType="numeric"
    leftIcon="attach-money"
  />
);

// Date input (for display purposes - would typically use a date picker)
export const DateInput: React.FC<Omit<InputProps, 'editable' | 'rightIcon'>> = (props) => (
  <Input
    {...props}
    editable={false}
    rightIcon="date-range"
    leftIcon="event"
  />
);

// Location input
export const LocationInput: React.FC<InputProps> = (props) => (
  <Input
    {...props}
    leftIcon="location-on"
    rightIcon="my-location"
  />
);

// URL input
export const URLInput: React.FC<Omit<InputProps, 'keyboardType' | 'autoCapitalize' | 'autoCorrect'>> = (props) => (
  <Input
    {...props}
    keyboardType="url"
    autoCapitalize="none"
    autoCorrect={false}
    leftIcon="link"
  />
);

// Name input
export const NameInput: React.FC<Omit<InputProps, 'autoCapitalize'>> = (props) => (
  <Input
    {...props}
    autoCapitalize="words"
    leftIcon="person"
  />
);

// Message/Comment input
export const MessageInput: React.FC<Omit<InputProps, 'variant' | 'multiline'>> = (props) => (
  <Input
    {...props}
    variant="textarea"
    placeholder={props.placeholder || "Write your message..."}
    leftIcon="message"
  />
);

// Rating input (for numeric ratings)
export const RatingInput: React.FC<Omit<InputProps, 'keyboardType' | 'leftIcon'>> = (props) => (
  <Input
    {...props}
    keyboardType="numeric"
    leftIcon="star"
  />
);

// Tag input (for hashtags, categories, etc.)
export const TagInput: React.FC<Omit<InputProps, 'leftIcon'>> = (props) => (
  <Input
    {...props}
    leftIcon="local-offer"
    placeholder={props.placeholder || "Add tags..."}
  />
);

// Code input (for verification codes, etc.)
export const CodeInput: React.FC<Omit<InputProps, 'keyboardType' | 'autoCapitalize' | 'autoCorrect'>> = (props) => (
  <Input
    {...props}
    keyboardType="number-pad"
    autoCapitalize="none"
    autoCorrect={false}
    leftIcon="security"
  />
);

// Floating label variants
export const FloatingLabelInput: React.FC<Omit<InputProps, 'floatingLabel'>> = (props) => (
  <Input {...props} floatingLabel />
);

export const FloatingSearchInput: React.FC<Omit<InputProps, 'variant' | 'floatingLabel'>> = (props) => (
  <Input {...props} variant="search" floatingLabel showClearButton />
);

export const FloatingEmailInput: React.FC<Omit<InputProps, 'keyboardType' | 'autoCapitalize' | 'autoCorrect' | 'floatingLabel'>> = (props) => (
  <Input
    {...props}
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    leftIcon="email"
    floatingLabel
  />
);

export const FloatingPasswordInput: React.FC<PasswordInputProps & { floatingLabel?: boolean }> = ({ 
  showPassword = false, 
  onTogglePassword,
  ...props 
}) => (
  <Input
    {...props}
    secureTextEntry={!showPassword}
    leftIcon="lock"
    rightIcon={showPassword ? "visibility-off" : "visibility"}
    onRightIconPress={onTogglePassword}
    floatingLabel
  />
);

// Premium variants with enhanced styling
export const PremiumInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input {...props} variant="premium" />
);

export const PremiumSearchInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input 
    {...props} 
    variant="premium" 
    leftIcon="search"
    showClearButton 
    placeholder={props.placeholder || "Search..."} 
  />
);

export const PremiumFloatingInput: React.FC<Omit<InputProps, 'variant' | 'floatingLabel'>> = (props) => (
  <Input {...props} variant="premium" floatingLabel />
);

export const PremiumEmailInput: React.FC<Omit<InputProps, 'variant' | 'keyboardType' | 'autoCapitalize' | 'autoCorrect' | 'floatingLabel'>> = (props) => (
  <Input
    {...props}
    variant="premium"
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    leftIcon="email"
    floatingLabel
  />
);

export const PremiumPasswordInput: React.FC<PasswordInputProps & { variant?: never }> = ({ 
  showPassword = false, 
  onTogglePassword,
  ...props 
}) => (
  <Input
    {...props}
    variant="premium"
    secureTextEntry={!showPassword}
    leftIcon="lock"
    rightIcon={showPassword ? "visibility-off" : "visibility"}
    onRightIconPress={onTogglePassword}
    floatingLabel
  />
);