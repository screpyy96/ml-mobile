/**
 * Design System - Image Component
 * Premium image component with blur-to-sharp loading transitions
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Image as RNImage,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../themes/ThemeProvider';
import { createTimingAnimation } from '../../utils/animations';
import { ImageProps } from './types';

export const Image: React.FC<ImageProps> = ({
    source,
    fallbackSource,
    variant = 'default',
    size = 'medium',
    shape = 'rectangle',
    fit = 'cover',
    width,
    height,
    aspectRatio,
    showLoading = true,
    blurRadius = 0,
    style,
    containerStyle,
    onPress,
    onLongPress,
    onLoad,
    onError,
    accessibilityLabel,
    testID,
}) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const blurAnimation = useRef(new Animated.Value(blurRadius || 10)).current;

    // Size configurations
    const getSizeConfig = () => {
        if (typeof size === 'number') {
            return { width: size, height: size };
        }

        switch (size) {
            case 'small':
                return { width: 40, height: 40 };
            case 'large':
                return { width: 120, height: 120 };
            case 'xlarge':
                return { width: 200, height: 200 };
            case 'medium':
            default:
                return { width: 80, height: 80 };
        }
    };

    // Shape configurations
    const getShapeConfig = () => {
        const sizeConfig = getSizeConfig();
        
        switch (shape) {
            case 'circle':
                return {
                    borderRadius: Math.min(sizeConfig.width, sizeConfig.height) / 2,
                };
            case 'rounded':
                return {
                    borderRadius: theme.borderRadius.lg,
                };
            case 'square':
                return {
                    borderRadius: theme.borderRadius.sm,
                    aspectRatio: 1,
                };
            case 'rectangle':
            default:
                return {
                    borderRadius: theme.borderRadius.md,
                };
        }
    };

    // Variant configurations
    const getVariantConfig = () => {
        switch (variant) {
            case 'avatar':
                return {
                    borderWidth: 2,
                    borderColor: theme.colors.background.primary,
                    ...theme.shadows.sm,
                };
            case 'cover':
                return {
                    width: '100%',
                    height: 200,
                    borderRadius: 0,
                };
            case 'thumbnail':
                return {
                    ...theme.shadows.sm,
                };
            case 'hero':
                return {
                    width: '100%',
                    height: 300,
                    borderRadius: 0,
                };
            case 'default':
            default:
                return {};
        }
    };

    const sizeConfig = getSizeConfig();
    const shapeConfig = getShapeConfig();
    const variantConfig = getVariantConfig();

    // Handle image load
    const handleLoad = () => {
        setLoading(false);
        setImageLoaded(true);
        
        // Fade in animation
        createTimingAnimation(fadeAnimation, 1, 'standard').start();
        
        // Blur to sharp animation
        if (blurRadius > 0) {
            createTimingAnimation(blurAnimation, 0, 'standard').start();
        }
        
        onLoad?.();
    };

    // Handle image error
    const handleError = () => {
        setLoading(false);
        setError(true);
        onError?.();
    };

    // Handle press
    const handlePress = () => {
        onPress?.();
    };

    // Handle long press
    const handleLongPress = () => {
        onLongPress?.();
    };

    // Get final dimensions
    const getFinalDimensions = () => {
        const finalWidth = width || variantConfig.width || sizeConfig.width;
        const finalHeight = height || variantConfig.height || sizeConfig.height;
        
        if (aspectRatio && typeof aspectRatio === 'number') {
            if (width && !height) {
                return { width: finalWidth, height: Number(finalWidth) / aspectRatio };
            }
            if (height && !width) {
                return { width: Number(finalHeight) * aspectRatio, height: finalHeight };
            }
        }
        
        return { width: finalWidth, height: finalHeight };
    };

    const dimensions = getFinalDimensions();

    // Container styles
    const containerStyles = [
        {
            ...dimensions,
            backgroundColor: theme.colors.secondary[100],
            overflow: 'hidden' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        },
        shapeConfig,
        variantConfig,
        containerStyle,
    ].filter(Boolean) as any;

    // Image styles
    const imageStyles = [
        {
            ...dimensions,
            resizeMode: fit,
        },
        shapeConfig,
        variantConfig,
        style,
    ].filter(Boolean) as any;

    // Render loading state
    const renderLoading = () => {
        if (!showLoading || !loading) return null;
        
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.colors.secondary[100],
                }}
            >
                <ActivityIndicator
                    size="small"
                    color={theme.colors.primary[500]}
                />
            </View>
        );
    };

    // Render error state
    const renderError = () => {
        if (!error) return null;
        
        return (
            <View
                style={{
                    ...dimensions,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.colors.secondary[200],
                } as any}
            >
                {fallbackSource ? (
                    <RNImage
                        source={fallbackSource}
                        style={imageStyles}
                        testID={`${testID}-fallback`}
                    />
                ) : (
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            backgroundColor: theme.colors.secondary[300],
                            borderRadius: 2,
                        }}
                    />
                )}
            </View>
        );
    };

    const ImageComponent = onPress || onLongPress ? TouchableOpacity : View;

    return (
        <ImageComponent
            style={containerStyles}
            onPress={onPress ? handlePress : undefined}
            onLongPress={onLongPress ? handleLongPress : undefined}
            activeOpacity={onPress ? 0.8 : 1}
            accessibilityRole={onPress ? 'button' : 'image'}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
        >
            {!error && (
                <Animated.View
                    style={{
                        opacity: fadeAnimation,
                    }}
                >
                    <Animated.Image
                        source={source}
                        style={[
                            imageStyles,
                            {
                                blurRadius: blurAnimation,
                            } as any,
                        ]}
                        onLoad={handleLoad}
                        onError={handleError}
                        testID={`${testID}-image`}
                    />
                </Animated.View>
            )}
            
            {renderLoading()}
            {renderError()}
        </ImageComponent>
    );
};