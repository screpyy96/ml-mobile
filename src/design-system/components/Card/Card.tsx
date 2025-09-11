/**
 * Design System - Card Component
 * Modern card component with multiple variants and smooth animations
 */

import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { createTimingAnimation, createCardPressAnimation } from '../../utils/animations';
import { getCardStyles } from './styles';
import { CardProps, CardState } from './types';

export const Card: React.FC<CardProps> = ({
    title,
    subtitle,
    description,
    imageSource,
    variant = 'default',
    size = 'medium',
    featured = false,
    disabled = false,
    jobTitle,
    companyName,
    location,
    salary,
    jobType,
    postedDate,
    profileName,
    profession,
    rating,
    reviewCount,
    profileImage,
    badges = [],
    reviewerName,
    reviewDate,
    reviewText,
    reviewRating,
    reviewerAvatar,
    onPress,
    onLongPress,
    containerStyle,
    contentStyle,
    accessibilityLabel,
    accessibilityHint,
    testID,
    children,
}) => {
    const { theme } = useTheme();
    const [isPressed, setIsPressed] = useState(false);
    const scaleAnimation = useRef(new Animated.Value(1)).current;

    // Determine current state
    const getCurrentState = (): CardState => {
        if (disabled) return 'disabled';
        if (featured) return 'featured';
        if (isPressed) return 'pressed';
        return 'normal';
    };

    const currentState = getCurrentState();
    const styles = getCardStyles(theme, variant, size, currentState);

    // Handle press animations
    const { pressIn, pressOut } = createCardPressAnimation(
        scaleAnimation,
        () => {
            setIsPressed(true);
            Vibration.vibrate(1);
        },
        () => {
            setIsPressed(false);
        }
    );

    // Handle press
    const handlePress = () => {
        if (disabled) return;
        onPress?.();
    };

    // Handle long press
    const handleLongPress = () => {
        if (disabled) return;
        Vibration.vibrate(10);
        onLongPress?.();
    };

    // Render star rating
    const renderStarRating = (ratingValue: number, showText: boolean = true) => {
        const stars = [];
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <Icon
                        key={i}
                        name="star"
                        size={16}
                        color={theme.colors.accent.yellow}
                    />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <Icon
                        key={i}
                        name="star-half"
                        size={16}
                        color={theme.colors.accent.yellow}
                    />
                );
            } else {
                stars.push(
                    <Icon
                        key={i}
                        name="star-border"
                        size={16}
                        color={theme.colors.secondary[300]}
                    />
                );
            }
        }

        return (
            <View style={styles.rating}>
                {stars}
                {showText && (
                    <Text style={styles.ratingText}>
                        {ratingValue.toFixed(1)}
                    </Text>
                )}
            </View>
        );
    };

    // Render badges
    const renderBadges = (badgeList: string[]) => {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {badgeList.map((badge, index) => (
                    <View key={index} style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                ))}
            </View>
        );
    };

    // Render job card content
    const renderJobContent = () => (
        <>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{jobTitle || title}</Text>
                    <Text style={styles.subtitle}>{companyName || subtitle}</Text>
                    {location && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.xs }}>
                            <Icon name="location-on" size={14} color={theme.colors.text.tertiary} />
                            <Text style={[styles.ratingText, { marginLeft: theme.spacing.xs / 2 }]}>
                                {location}
                            </Text>
                        </View>
                    )}
                </View>
                {featured && (
                    <View style={[styles.badge, { backgroundColor: theme.colors.accent.orange }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.text.inverse }]}>
                            Featured
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.body}>
                <Text style={styles.description} numberOfLines={3}>
                    {description}
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {jobType && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{jobType}</Text>
                        </View>
                    )}
                    {salary && (
                        <Text style={[styles.ratingText, { fontWeight: '600', color: theme.colors.accent.green }]}>
                            {salary}
                        </Text>
                    )}
                </View>
                {postedDate && (
                    <Text style={styles.ratingText}>{postedDate}</Text>
                )}
            </View>
        </>
    );

    // Render profile card content
    const renderProfileContent = () => (
        <>
            <View style={styles.header}>
                {profileImage && (
                    <Image source={profileImage} style={styles.image} />
                )}
                <Text style={styles.title}>{profileName || title}</Text>
                <Text style={styles.subtitle}>{profession || subtitle}</Text>
            </View>

            <View style={styles.body}>
                {rating !== undefined && renderStarRating(rating)}
                {reviewCount !== undefined && (
                    <Text style={styles.ratingText}>
                        {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                    </Text>
                )}
                {description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {description}
                    </Text>
                )}
            </View>

            {badges.length > 0 && (
                <View style={styles.footer}>
                    {renderBadges(badges)}
                </View>
            )}
        </>
    );

    // Render review card content
    const renderReviewContent = () => (
        <>
            <View style={styles.header}>
                {reviewerAvatar && (
                    <Image source={reviewerAvatar} style={styles.image} />
                )}
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{reviewerName || title}</Text>
                    <Text style={styles.subtitle}>{reviewDate || subtitle}</Text>
                    {reviewRating !== undefined && renderStarRating(reviewRating, false)}
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.description}>
                    "{reviewText || description}"
                </Text>
            </View>
        </>
    );

    // Render default content
    const renderDefaultContent = () => (
        <>
            {imageSource && (
                <Image source={imageSource} style={styles.image} />
            )}
            
            <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            {description && (
                <View style={styles.body}>
                    <Text style={styles.description}>{description}</Text>
                </View>
            )}

            {children}
        </>
    );

    // Render content based on variant
    const renderContent = () => {
        switch (variant) {
            case 'job':
                return renderJobContent();
            case 'profile':
                return renderProfileContent();
            case 'review':
                return renderReviewContent();
            default:
                return renderDefaultContent();
        }
    };

    const CardComponent = onPress ? TouchableOpacity : View;

    return (
        <Animated.View
            style={[
                styles.container,
                containerStyle,
                {
                    transform: [{ scale: scaleAnimation }],
                },
            ]}
            testID={testID}
        >
            <CardComponent
                style={[styles.content, contentStyle]}
                onPress={handlePress}
                onLongPress={handleLongPress}
                onPressIn={onPress ? pressIn : undefined}
                onPressOut={onPress ? pressOut : undefined}
                disabled={disabled}
                accessibilityLabel={accessibilityLabel || title}
                accessibilityHint={accessibilityHint}
                accessibilityRole={onPress ? 'button' : 'text'}
                activeOpacity={0.9}
            >
                {renderContent()}
            </CardComponent>
        </Animated.View>
    );
};