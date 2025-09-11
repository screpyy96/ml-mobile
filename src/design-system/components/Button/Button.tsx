/**
 * Design System - Button Component
 * Premium button component with animations, haptic feedback, and multiple variants
 */

import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  ActivityIndicator,
  Platform,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { createButtonPressAnimation } from '../../utils/animations';
import { getButtonStyles, getSubtitleStyles } from './styles';
import { ButtonProps, ButtonState } from './types';

export const Button: React.FC<ButtonProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  error = false,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  hapticFeedback = true,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  // Determine current state
  const getCurrentState = (): ButtonState => {
    if (disabled) return 'disabled';
    if (loading) return 'loading';
    if (error) return 'error';
    return 'normal';
  };

  const currentState = getCurrentState();
  const styles = getButtonStyles(theme, variant, size, currentState);
  const subtitleStyles = getSubtitleStyles(theme, variant);

  // Animation handlers
  const { pressIn, pressOut } = createButtonPressAnimation(
    scaleValue,
    () => {
      if (hapticFeedback) {
        // Light vibration for press feedback
        Vibration.vibrate(10);
      }
      onPressIn?.();
    },
    () => {
      onPressOut?.();
    }
  );

  // Handle press
  const handlePress = () => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      // Medium vibration for button press
      Vibration.vibrate(25);
    }
    
    onPress?.();
  };

  // Handle long press
  const handleLongPress = () => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      // Stronger vibration for long press
      Vibration.vibrate(50);
    }
    
    onLongPress?.();
  };

  // Container style
  const containerStyle = [
    styles.container,
    fullWidth && { width: '100%' as const },
    style,
  ];

  // Text style
  const titleTextStyle = [
    styles.text,
    textStyle,
  ];

  // Icon color
  const iconColor = styles.icon?.color || theme.colors.text.primary;
  const iconSize = styles.icon?.size || 20;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onLongPress={onLongPress}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      testID={testID}
    >
      <Animated.View
        style={[
          containerStyle,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {/* Loading indicator */}
        {loading && (
          <ActivityIndicator
            size="small"
            color={iconColor}
            style={{ marginRight: theme.spacing.xs }}
          />
        )}

        {/* Left icon */}
        {leftIcon && !loading && (
          <View style={{ marginRight: theme.spacing.xs }}>
            {typeof leftIcon === 'string' ? (
              <Icon
                name={leftIcon}
                size={iconSize}
                color={iconColor}
              />
            ) : (
              leftIcon
            )}
          </View>
        )}

        {/* Text content */}
        <View style={{ flex: fullWidth ? 1 : 0, alignItems: 'center' }}>
          <Text style={titleTextStyle} numberOfLines={1}>
            {title}
          </Text>
          
          {subtitle && (
            <Text style={subtitleStyles} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right icon */}
        {rightIcon && !loading && (
          <View style={{ marginLeft: theme.spacing.xs }}>
            {typeof rightIcon === 'string' ? (
              <Icon
                name={rightIcon}
                size={iconSize}
                color={iconColor}
              />
            ) : (
              rightIcon
            )}
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};