/**
 * Design System - Avatar Component
 * Avatar component with consistent styling and status indicators
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../themes/ThemeProvider';
import { Image } from './Image';
import { AvatarProps } from './types';

export const Avatar: React.FC<AvatarProps> = ({
    source,
    fallbackSource,
    size = 'medium',
    name,
    online,
    badge,
    style,
    containerStyle,
    onPress,
    accessibilityLabel,
    testID,
}) => {
    const { theme } = useTheme();

    // Size configurations
    const getSizeConfig = () => {
        if (typeof size === 'number') {
            return { 
                width: size, 
                height: size,
                fontSize: size * 0.4,
                badgeSize: size * 0.3,
            };
        }

        switch (size) {
            case 'small':
                return { 
                    width: 32, 
                    height: 32,
                    fontSize: 12,
                    badgeSize: 10,
                };
            case 'large':
                return { 
                    width: 80, 
                    height: 80,
                    fontSize: 28,
                    badgeSize: 24,
                };
            case 'xlarge':
                return { 
                    width: 120, 
                    height: 120,
                    fontSize: 42,
                    badgeSize: 36,
                };
            case 'medium':
            default:
                return { 
                    width: 48, 
                    height: 48,
                    fontSize: 18,
                    badgeSize: 16,
                };
        }
    };

    const sizeConfig = getSizeConfig();

    // Generate initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate background color from name
    const getBackgroundColor = (name: string) => {
        const colors = [
            theme.colors.primary[500],
            theme.colors.accent.green,
            theme.colors.accent.orange,
            theme.colors.status.info,
            theme.colors.secondary[500],
        ];
        
        const hash = name.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        
        return colors[Math.abs(hash) % colors.length];
    };

    // Render status indicator
    const renderStatusIndicator = () => {
        if (online === undefined) return null;
        
        const indicatorSize = sizeConfig.width * 0.25;
        
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: indicatorSize,
                    height: indicatorSize,
                    borderRadius: indicatorSize / 2,
                    backgroundColor: online 
                        ? theme.colors.status.success 
                        : theme.colors.secondary[400],
                    borderWidth: 2,
                    borderColor: theme.colors.background.primary,
                }}
            />
        );
    };

    // Render badge
    const renderBadge = () => {
        if (!badge) return null;
        
        const badgeSize = sizeConfig.badgeSize;
        const isNumber = typeof badge === 'number';
        const displayText = isNumber && badge > 99 ? '99+' : badge.toString();
        
        return (
            <View
                style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    minWidth: badgeSize,
                    height: badgeSize,
                    borderRadius: badgeSize / 2,
                    backgroundColor: theme.colors.status.error,
                    borderWidth: 2,
                    borderColor: theme.colors.background.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                }}
            >
                <Text
                    style={{
                        ...theme.typography.caption,
                        fontSize: badgeSize * 0.6,
                        color: theme.colors.text.inverse,
                        fontWeight: '600' as const,
                        lineHeight: badgeSize * 0.8,
                    }}
                    numberOfLines={1}
                >
                    {displayText}
                </Text>
            </View>
        );
    };

    // Render avatar content
    const renderAvatarContent = () => {
        if (source) {
            return (
                <Image
                    source={source}
                    fallbackSource={fallbackSource}
                    width={sizeConfig.width}
                    height={sizeConfig.height}
                    shape="circle"
                    variant="avatar"
                    style={style}
                    testID={`${testID}-image`}
                />
            );
        }

        if (name) {
            return (
                <View
                    style={[
                        {
                            width: sizeConfig.width,
                            height: sizeConfig.height,
                            borderRadius: sizeConfig.width / 2,
                            backgroundColor: getBackgroundColor(name),
                            justifyContent: 'center',
                            alignItems: 'center',
                            ...theme.shadows.sm,
                        },
                        style,
                    ]}
                >
                    <Text
                        style={{
                            fontSize: sizeConfig.fontSize,
                            color: theme.colors.text.inverse,
                            fontWeight: '600' as const,
                        }}
                    >
                        {getInitials(name)}
                    </Text>
                </View>
            );
        }

        // Default avatar
        return (
            <View
                style={[
                    {
                        width: sizeConfig.width,
                        height: sizeConfig.height,
                        borderRadius: sizeConfig.width / 2,
                        backgroundColor: theme.colors.secondary[300],
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...theme.shadows.sm,
                    },
                    style,
                ]}
            >
                <View
                    style={{
                        width: sizeConfig.width * 0.6,
                        height: sizeConfig.width * 0.6,
                        borderRadius: (sizeConfig.width * 0.6) / 2,
                        backgroundColor: theme.colors.secondary[400],
                    }}
                />
            </View>
        );
    };

    const AvatarComponent = onPress ? TouchableOpacity : View;

    return (
        <AvatarComponent
            style={[
                {
                    position: 'relative',
                },
                containerStyle,
            ]}
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
            accessibilityRole={onPress ? 'button' : 'image'}
            accessibilityLabel={accessibilityLabel || `Avatar${name ? ` for ${name}` : ''}`}
            testID={testID}
        >
            {renderAvatarContent()}
            {renderStatusIndicator()}
            {renderBadge()}
        </AvatarComponent>
    );
};