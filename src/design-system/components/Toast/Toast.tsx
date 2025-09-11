/**
 * Design System - Toast Component
 * Modern toast notifications with smooth animations
 */

import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Vibration,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { createTimingAnimation } from '../../utils/animations';
import { ToastProps } from './types';

const { width: screenWidth } = Dimensions.get('window');

export const Toast: React.FC<ToastProps> = ({
    title,
    message,
    type = 'info',
    position = 'top',
    animation = 'slide',
    duration = 4000,
    persistent = false,
    onPress,
    onDismiss,
    actionText,
    onActionPress,
    style,
    titleStyle,
    messageStyle,
    accessibilityLabel,
    testID,
}) => {
    const { theme } = useTheme();
    const translateY = useRef(new Animated.Value(position === 'bottom' ? 100 : -100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    // Get toast colors based on type
    const getToastColors = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: theme.colors.status.success,
                    iconColor: theme.colors.text.inverse,
                    textColor: theme.colors.text.inverse,
                    iconName: 'check-circle',
                };
            case 'error':
                return {
                    backgroundColor: theme.colors.status.error,
                    iconColor: theme.colors.text.inverse,
                    textColor: theme.colors.text.inverse,
                    iconName: 'error',
                };
            case 'warning':
                return {
                    backgroundColor: theme.colors.status.warning,
                    iconColor: theme.colors.text.primary,
                    textColor: theme.colors.text.primary,
                    iconName: 'warning',
                };
            case 'info':
            default:
                return {
                    backgroundColor: theme.colors.status.info,
                    iconColor: theme.colors.text.inverse,
                    textColor: theme.colors.text.inverse,
                    iconName: 'info',
                };
        }
    };

    const colors = getToastColors();

    // Animation setup
    useEffect(() => {
        // Entry animation
        const entryAnimations = [];
        
        if (animation === 'slide') {
            entryAnimations.push(
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            );
        }
        
        if (animation === 'fade' || animation === 'scale') {
            entryAnimations.push(
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            );
        }
        
        if (animation === 'scale') {
            entryAnimations.push(
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            );
        }

        // Start entry animation
        Animated.parallel(entryAnimations).start();

        // Haptic feedback
        if (type === 'success') {
            Vibration.vibrate([0, 50]);
        } else if (type === 'error') {
            Vibration.vibrate([0, 100, 50, 100]);
        } else {
            Vibration.vibrate(1);
        }

        // Auto dismiss
        if (!persistent && duration > 0) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, []);

    // Handle dismiss
    const handleDismiss = () => {
        const exitAnimations = [];
        
        if (animation === 'slide') {
            exitAnimations.push(
                Animated.timing(translateY, {
                    toValue: position === 'bottom' ? 100 : -100,
                    duration: 250,
                    useNativeDriver: true,
                })
            );
        }
        
        if (animation === 'fade' || animation === 'scale') {
            exitAnimations.push(
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            );
        }
        
        if (animation === 'scale') {
            exitAnimations.push(
                Animated.timing(scale, {
                    toValue: 0.8,
                    duration: 250,
                    useNativeDriver: true,
                })
            );
        }

        Animated.parallel(exitAnimations).start(() => {
            onDismiss?.();
        });
    };

    // Handle press
    const handlePress = () => {
        Vibration.vibrate(1);
        onPress?.();
    };

    // Handle action press
    const handleActionPress = () => {
        Vibration.vibrate(1);
        onActionPress?.();
    };

    // Get position styles
    const getPositionStyles = () => {
        const baseStyle = {
            position: 'absolute' as const,
            left: theme.spacing.md,
            right: theme.spacing.md,
            zIndex: 9999,
        };

        switch (position) {
            case 'top':
                return {
                    ...baseStyle,
                    top: 60, // Below status bar
                };
            case 'bottom':
                return {
                    ...baseStyle,
                    bottom: 100, // Above tab bar
                };
            case 'center':
                return {
                    ...baseStyle,
                    top: '50%',
                    marginTop: -50,
                };
            default:
                return baseStyle;
        }
    };

    // Get animation styles
    const getAnimationStyles = () => {
        const baseTransform = [];
        
        if (animation === 'slide') {
            baseTransform.push({ translateY });
        }
        
        if (animation === 'scale') {
            baseTransform.push({ scale });
        }

        return {
            transform: baseTransform,
            opacity: animation === 'fade' || animation === 'scale' ? opacity : 1,
        };
    };

    const ToastComponent = onPress ? TouchableOpacity : View;

    return (
        <Animated.View
            style={[
                getPositionStyles(),
                getAnimationStyles(),
            ]}
            testID={testID}
        >
            <ToastComponent
                style={[
                    {
                        backgroundColor: colors.backgroundColor,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.md,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        ...theme.shadows.lg,
                        minHeight: 60,
                    },
                    style,
                ]}
                onPress={onPress ? handlePress : undefined}
                activeOpacity={onPress ? 0.8 : 1}
                accessibilityRole={onPress ? 'button' : 'alert'}
                accessibilityLabel={accessibilityLabel || `${type} notification: ${message}`}
            >
                {/* Icon */}
                <Icon
                    name={colors.iconName}
                    size={24}
                    color={colors.iconColor}
                    style={{ marginRight: theme.spacing.sm }}
                />

                {/* Content */}
                <View style={{ flex: 1 }}>
                    {title && (
                        <Text
                            style={[
                                {
                                    ...theme.typography.body,
                                    color: colors.textColor,
                                    fontWeight: '600' as const,
                                    marginBottom: theme.spacing.xs / 2,
                                },
                                titleStyle,
                            ]}
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                    )}
                    
                    <Text
                        style={[
                            {
                                ...theme.typography.bodySmall,
                                color: colors.textColor,
                                lineHeight: 20,
                            },
                            messageStyle,
                        ]}
                        numberOfLines={3}
                    >
                        {message}
                    </Text>

                    {/* Action button */}
                    {actionText && onActionPress && (
                        <TouchableOpacity
                            onPress={handleActionPress}
                            style={{
                                marginTop: theme.spacing.sm,
                                alignSelf: 'flex-start',
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={actionText}
                        >
                            <Text
                                style={{
                                    ...theme.typography.bodySmall,
                                    color: colors.textColor,
                                    fontWeight: '600' as const,
                                    textDecorationLine: 'underline',
                                }}
                            >
                                {actionText}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Dismiss button */}
                {persistent && (
                    <TouchableOpacity
                        onPress={handleDismiss}
                        style={{
                            padding: theme.spacing.xs,
                            marginLeft: theme.spacing.xs,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss notification"
                    >
                        <Icon
                            name="close"
                            size={20}
                            color={colors.iconColor}
                        />
                    </TouchableOpacity>
                )}
            </ToastComponent>
        </Animated.View>
    );
};