/**
 * Design System - Skeleton Component
 * Base skeleton component with shimmer animation
 */

import React, { useRef, useEffect } from 'react';
import {
    View,
    Animated,
    Dimensions,
    StyleSheet,
    DimensionValue,
} from 'react-native';
import { useTheme } from '../../themes/ThemeProvider';
import { SkeletonProps } from './types';

const { width: screenWidth } = Dimensions.get('window');

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    variant = 'rectangular',
    animation = 'wave',
    size = 'medium',
    style,
    backgroundColor,
    highlightColor,
    testID,
}) => {
    const { theme } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Default colors based on theme
    const defaultBackgroundColor = backgroundColor || theme.colors.secondary[200];
    const defaultHighlightColor = highlightColor || theme.colors.secondary[100];

    // Size configurations
    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return { height: typeof height === 'number' ? height * 0.8 : height };
            case 'large':
                return { height: typeof height === 'number' ? height * 1.2 : height };
            case 'medium':
            default:
                return { height };
        }
    };

    const sizeConfig = getSizeConfig();

    // Variant styles
    const getVariantStyle = () => {
        const baseStyle = {
            backgroundColor: defaultBackgroundColor,
            overflow: 'hidden' as const,
        };

        switch (variant) {
            case 'text':
                return {
                    ...baseStyle,
                    borderRadius: theme.borderRadius.xs,
                };
            case 'circular':
                return {
                    ...baseStyle,
                    borderRadius: typeof sizeConfig.height === 'number'
                        ? sizeConfig.height / 2
                        : theme.borderRadius.full,
                    aspectRatio: 1,
                };
            case 'rounded':
                return {
                    ...baseStyle,
                    borderRadius: theme.borderRadius.lg,
                };
            case 'rectangular':
            default:
                return {
                    ...baseStyle,
                    borderRadius: theme.borderRadius.sm,
                };
        }
    };

    // Animation setup
    useEffect(() => {
        if (animation === 'none') return;

        const createAnimation = () => {
            if (animation === 'pulse') {
                return Animated.loop(
                    Animated.sequence([
                        Animated.timing(animatedValue, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: false,
                        }),
                        Animated.timing(animatedValue, {
                            toValue: 0,
                            duration: 1000,
                            useNativeDriver: false,
                        }),
                    ])
                );
            } else {
                // Wave animation
                return Animated.loop(
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: false,
                    })
                );
            }
        };

        const animationLoop = createAnimation();
        animationLoop.start();

        return () => {
            animationLoop.stop();
        };
    }, [animation, animatedValue]);

    // Render shimmer overlay
    const renderShimmer = () => {
        if (animation === 'none') return null;

        if (animation === 'pulse') {
            const opacity = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.3],
            });

            return (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: defaultHighlightColor,
                            opacity,
                        }
                    ]}
                />
            );
        }

        // Wave animation - create shimmer effect with multiple views
        const translateX = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-screenWidth, screenWidth],
        });

        return (
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        transform: [{ translateX }],
                    }
                ]}
            >
                {/* Shimmer gradient effect using multiple views */}
                <View style={styles.shimmerContainer}>
                    <View style={[styles.shimmerGradient, { backgroundColor: 'transparent' }]} />
                    <View style={[styles.shimmerGradient, { backgroundColor: defaultHighlightColor }]} />
                    <View style={[styles.shimmerGradient, { backgroundColor: 'transparent' }]} />
                </View>
            </Animated.View>
        );
    };

    return (
        <View
            style={[
                {
                    width,
                    height: sizeConfig.height,
                },
                getVariantStyle(),
                style,
            ]}
            testID={testID}
        >
            {renderShimmer()}
        </View>
    );
};

const styles = StyleSheet.create({
    shimmerContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    shimmerGradient: {
        flex: 1,
        opacity: 0.5,
    },
});