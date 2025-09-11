/**
 * Design System - Input Component
 * Modern input component with floating labels, validation states, and smooth animations
 */

import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { createTimingAnimation } from '../../utils/animations';
import { getInputStyles, getFloatingLabelStyles } from './styles';
import { InputProps, InputState } from './types';

export const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    helperText,
    errorMessage,
    successMessage,
    variant = 'default',
    size = 'medium',
    error = false,
    success = false,
    disabled = false,
    leftIcon,
    rightIcon,
    onRightIconPress,
    floatingLabel = false,
    onClear,
    showClearButton = false,
    containerStyle,
    inputStyle,
    labelStyle,
    value,
    onChangeText,
    onFocus,
    onBlur,
    accessibilityLabel,
    accessibilityHint,
    testID,
    ...textInputProps
}) => {
    const { theme } = useTheme();
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

    // Determine current state
    const getCurrentState = (): InputState => {
        if (disabled) return 'disabled';
        if (error) return 'error';
        if (success) return 'success';
        if (isFocused) return 'focused';
        return 'normal';
    };

    const currentState = getCurrentState();
    const styles = getInputStyles(theme, variant, size, currentState);

    // Handle floating label animation
    useEffect(() => {
        if (floatingLabel) {
            const shouldFloat = isFocused || hasValue;
            createTimingAnimation(
                labelAnimation,
                shouldFloat ? 1 : 0,
                'standard'
            ).start();
        }
    }, [isFocused, hasValue, floatingLabel, labelAnimation]);

    // Handle focus
    const handleFocus = (e: any) => {
        setIsFocused(true);
        // Light haptic feedback on focus
        Vibration.vibrate(1);
        onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    // Handle text change
    const handleChangeText = (text: string) => {
        setHasValue(text.length > 0);
        onChangeText?.(text);
    };

    // Handle clear
    const handleClear = () => {
        setHasValue(false);
        onChangeText?.('');
        onClear?.();
        // Light haptic feedback on clear
        Vibration.vibrate(1);
        inputRef.current?.focus();
    };

    // Handle right icon press
    const handleRightIconPress = () => {
        if (variant === 'search' && showClearButton && hasValue) {
            handleClear();
        } else {
            onRightIconPress?.();
        }
    };

    // Get the appropriate right icon
    const getRightIcon = () => {
        if (variant === 'search' && showClearButton && hasValue) {
            return 'clear';
        }
        if (error) return 'error';
        if (success) return 'check-circle';
        return rightIcon;
    };

    // Get helper text to display
    const getHelperText = () => {
        if (errorMessage && error) return errorMessage;
        if (successMessage && success) return successMessage;
        return helperText;
    };

    // Floating label styles
    const shouldFloat = isFocused || hasValue;
    const floatingLabelStyles = floatingLabel
        ? getFloatingLabelStyles(theme, shouldFloat, isFocused, error, success)
        : null;

    return (
        <View style={[styles.container, containerStyle]} testID={testID}>
            {/* Static Label */}
            {label && !floatingLabel && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                </Text>
            )}

            {/* Input Container */}
            <View style={styles.inputContainer}>
                {/* Left Icon */}
                {leftIcon && (
                    <Icon
                        name={leftIcon}
                        size={styles.icon.size}
                        color={styles.icon.color}
                        style={{ marginRight: theme.spacing.xs }}
                    />
                )}

                {/* Search Icon for Search Variant */}
                {variant === 'search' && !leftIcon && (
                    <Icon
                        name="search"
                        size={styles.icon.size}
                        color={styles.icon.color}
                        style={{ marginRight: theme.spacing.xs }}
                    />
                )}

                {/* Text Input */}
                <TextInput
                    ref={inputRef}
                    style={[styles.input, inputStyle]}
                    value={value}
                    onChangeText={handleChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={floatingLabel ? undefined : placeholder}
                    placeholderTextColor={theme.colors.text.tertiary}
                    editable={!disabled}
                    multiline={variant === 'textarea'}
                    numberOfLines={variant === 'textarea' ? 4 : 1}
                    accessibilityLabel={accessibilityLabel || label}
                    accessibilityHint={accessibilityHint}
                    {...textInputProps}
                />

                {/* Right Icon */}
                {getRightIcon() && (
                    <TouchableOpacity
                        onPress={handleRightIconPress}
                        disabled={!onRightIconPress && !(variant === 'search' && showClearButton)}
                        style={{ padding: theme.spacing.xs }}
                    >
                        <Icon
                            name={getRightIcon()!}
                            size={styles.icon.size}
                            color={styles.icon.color}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Floating Label */}
            {label && floatingLabel && (
                <Animated.Text
                    style={[
                        floatingLabelStyles,
                        labelStyle,
                        {
                            transform: [
                                {
                                    translateY: labelAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -8],
                                    }),
                                },
                                {
                                    scale: labelAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 0.85],
                                    }),
                                },
                            ],
                        },
                    ]}
                    pointerEvents="none"
                >
                    {label}
                </Animated.Text>
            )}

            {/* Helper Text */}
            {getHelperText() && (
                <Text style={styles.helperText}>
                    {getHelperText()}
                </Text>
            )}
        </View>
    );
};