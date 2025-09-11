/**
 * Design System - SkeletonProfile Component
 * Skeleton loading for profile layouts
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../themes/ThemeProvider';
import { Skeleton } from './Skeleton';
import { SkeletonProfileProps } from './types';

export const SkeletonProfile: React.FC<SkeletonProfileProps> = ({
    showAvatar = true,
    showCoverImage = true,
    showBadges = true,
    showStats = true,
    avatarSize = 80,
    coverHeight = 200,
    badgeCount = 3,
    statsCount = 3,
    style,
    testID,
}) => {
    const { theme } = useTheme();

    return (
        <View style={style} testID={testID}>
            {/* Cover Image */}
            {showCoverImage && (
                <Skeleton
                    width="100%"
                    height={coverHeight}
                    variant="rectangular"
                    style={{ marginBottom: theme.spacing.lg }}
                />
            )}

            {/* Profile Header */}
            <View style={{ 
                paddingHorizontal: theme.spacing.md,
                alignItems: 'center',
                marginBottom: theme.spacing.lg,
            }}>
                {/* Avatar */}
                {showAvatar && (
                    <Skeleton
                        width={avatarSize}
                        height={avatarSize}
                        variant="circular"
                        style={{ marginBottom: theme.spacing.md }}
                    />
                )}

                {/* Name */}
                <Skeleton
                    width="60%"
                    height={24}
                    variant="text"
                    style={{ marginBottom: theme.spacing.sm }}
                />

                {/* Profession/Title */}
                <Skeleton
                    width="40%"
                    height={18}
                    variant="text"
                    style={{ marginBottom: theme.spacing.md }}
                />

                {/* Rating */}
                <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    marginBottom: theme.spacing.md,
                }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            width={16}
                            height={16}
                            variant="circular"
                            style={{ marginRight: theme.spacing.xs / 2 }}
                        />
                    ))}
                    <Skeleton
                        width={40}
                        height={16}
                        variant="text"
                        style={{ marginLeft: theme.spacing.sm }}
                    />
                </View>
            </View>

            {/* Badges */}
            {showBadges && (
                <View style={{ 
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    paddingHorizontal: theme.spacing.md,
                    marginBottom: theme.spacing.lg,
                }}>
                    {Array.from({ length: badgeCount }).map((_, index) => (
                        <Skeleton
                            key={index}
                            width={80}
                            height={28}
                            variant="rounded"
                            style={{ 
                                marginRight: theme.spacing.xs,
                                marginBottom: theme.spacing.xs,
                            }}
                        />
                    ))}
                </View>
            )}

            {/* Stats */}
            {showStats && (
                <View style={{ 
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingHorizontal: theme.spacing.md,
                    marginBottom: theme.spacing.lg,
                }}>
                    {Array.from({ length: statsCount }).map((_, index) => (
                        <View key={index} style={{ alignItems: 'center' }}>
                            <Skeleton
                                width={40}
                                height={24}
                                variant="text"
                                style={{ marginBottom: theme.spacing.xs }}
                            />
                            <Skeleton
                                width={60}
                                height={16}
                                variant="text"
                            />
                        </View>
                    ))}
                </View>
            )}

            {/* Bio/Description */}
            <View style={{ 
                paddingHorizontal: theme.spacing.md,
                marginBottom: theme.spacing.lg,
            }}>
                <Skeleton
                    width="100%"
                    height={16}
                    variant="text"
                    style={{ marginBottom: theme.spacing.xs }}
                />
                <Skeleton
                    width="90%"
                    height={16}
                    variant="text"
                    style={{ marginBottom: theme.spacing.xs }}
                />
                <Skeleton
                    width="75%"
                    height={16}
                    variant="text"
                />
            </View>

            {/* Action Buttons */}
            <View style={{ 
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingHorizontal: theme.spacing.md,
            }}>
                <Skeleton
                    width={120}
                    height={40}
                    variant="rounded"
                />
                <Skeleton
                    width={120}
                    height={40}
                    variant="rounded"
                />
            </View>
        </View>
    );
};