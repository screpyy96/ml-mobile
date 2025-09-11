/**
 * Design System - ImageGallery Component
 * Image gallery with zoom and swipe functionality
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StatusBar,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { Image } from './Image';
import { ImageGalleryProps } from './types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    initialIndex = 0,
    onImagePress,
    onClose,
    style,
    testID,
}) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    
    // Animation values
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // Navigation functions
    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            resetZoom();
        }
    };

    const goToNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            resetZoom();
        }
    };

    const resetZoom = () => {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
    };

    // Handle image press
    const handleImagePress = (image: any, index: number) => {
        setCurrentIndex(index);
        setVisible(true);
        onImagePress?.(image, index);
    };

    // Handle close
    const handleClose = () => {
        setVisible(false);
        resetZoom();
        onClose?.();
    };

    // Animated styles
    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    // Render gallery grid
    const renderGalleryGrid = () => {
        const itemSize = (screenWidth - theme.spacing.md * 3) / 2;
        
        return (
            <View style={[{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: theme.spacing.md,
            }, style]}>
                {images.map((image, index) => (
                    <TouchableOpacity
                        key={image.id}
                        style={{
                            width: itemSize,
                            height: itemSize,
                            marginRight: index % 2 === 0 ? theme.spacing.sm : 0,
                            marginBottom: theme.spacing.sm,
                        }}
                        onPress={() => handleImagePress(image, index)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={{ uri: image.uri }}
                            width={itemSize}
                            height={itemSize}
                            shape="rounded"
                            fit="cover"
                            testID={`gallery-image-${index}`}
                        />
                        
                        {/* Image counter overlay for first image */}
                        {index === 0 && images.length > 1 && (
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: theme.spacing.xs,
                                    right: theme.spacing.xs,
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    borderRadius: theme.borderRadius.sm,
                                    paddingHorizontal: theme.spacing.xs,
                                    paddingVertical: theme.spacing.xs / 2,
                                }}
                            >
                                <Text
                                    style={{
                                        ...theme.typography.caption,
                                        color: theme.colors.text.inverse,
                                        fontSize: 10,
                                    }}
                                >
                                    +{images.length - 1}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    // Render fullscreen modal
    const renderFullscreenModal = () => {
        if (!visible || !images[currentIndex]) return null;
        
        const currentImage = images[currentIndex];
        
        return (
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={handleClose}
                statusBarTranslucent
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                    }}
                >
                    <StatusBar hidden />
                    
                    {/* Header */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 50,
                            left: 0,
                            right: 0,
                            zIndex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: theme.spacing.md,
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleClose}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Icon
                                name="close"
                                size={24}
                                color={theme.colors.text.inverse}
                            />
                        </TouchableOpacity>
                        
                        <Text
                            style={{
                                ...theme.typography.body,
                                color: theme.colors.text.inverse,
                            }}
                        >
                            {currentIndex + 1} of {images.length}
                        </Text>
                    </View>

                    {/* Image container */}
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Animated.View style={animatedImageStyle}>
                            <Image
                                source={{ uri: currentImage.uri }}
                                width={screenWidth}
                                height={screenHeight * 0.8}
                                fit="contain"
                                showLoading={true}
                                testID={`fullscreen-image-${currentIndex}`}
                            />
                        </Animated.View>
                    </View>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                        <>
                            {currentIndex > 0 && (
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        left: theme.spacing.md,
                                        top: '50%',
                                        marginTop: -20,
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={goToPrevious}
                                >
                                    <Icon
                                        name="chevron-left"
                                        size={24}
                                        color={theme.colors.text.inverse}
                                    />
                                </TouchableOpacity>
                            )}
                            
                            {currentIndex < images.length - 1 && (
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        right: theme.spacing.md,
                                        top: '50%',
                                        marginTop: -20,
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={goToNext}
                                >
                                    <Icon
                                        name="chevron-right"
                                        size={24}
                                        color={theme.colors.text.inverse}
                                    />
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {/* Bottom info */}
                    {(currentImage.title || currentImage.description) && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 50,
                                left: 0,
                                right: 0,
                                paddingHorizontal: theme.spacing.md,
                            }}
                        >
                            {currentImage.title && (
                                <Text
                                    style={{
                                        ...theme.typography.h4,
                                        color: theme.colors.text.inverse,
                                        textAlign: 'center',
                                        marginBottom: theme.spacing.xs,
                                    }}
                                >
                                    {currentImage.title}
                                </Text>
                            )}
                            
                            {currentImage.description && (
                                <Text
                                    style={{
                                        ...theme.typography.body,
                                        color: theme.colors.text.inverse,
                                        textAlign: 'center',
                                        opacity: 0.8,
                                    }}
                                >
                                    {currentImage.description}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </Modal>
        );
    };

    return (
        <View testID={testID}>
            {renderGalleryGrid()}
            {renderFullscreenModal()}
        </View>
    );
};
