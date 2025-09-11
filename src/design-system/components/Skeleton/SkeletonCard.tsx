/**
 * Design System - SkeletonCard Component
 * Skeleton loading for card layouts
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../themes/ThemeProvider';
import { Skeleton } from './Skeleton';
import { SkeletonCardProps } from './types';

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
    showImage = true,
    showTitle = true,
    showSubtitle = true,
    showDescription = true,
    showActions = false,
    imageHeight = 200,
    titleLines = 1,
    descriptionLines = 3,
    style,
    testID,
}) => {
    const { theme } = useTheme();

    const cardStyle = {
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginVertical: theme.spacing.xs,
        marginHorizontal: theme.spacing.md,
        ...theme.shadows.md,
    };

    return (
        <View style={[cardStyle, style]} testID={testID}>
            {/* Image */}
            {showImage && (
                <Skeleton
                    width="100%"
                    height={imageHeight}
                    variant="rounded"
                    style={{ marginBottom: theme.spacing.md }}
                />
            )}

            {/* Title */}
            {showTitle && (
                <View style={{ marginBottom: theme.spacing.sm }}>
                    {Array.from({ length: titleLines }).map((_, index) => (
                        <Skeleton
                            key={`title-${index}`}
                            width={index === titleLines - 1 ? '70%' : '100%'}
                            height={24}
                            variant="text"
                            style={{ 
                                marginBottom: index < titleLines - 1 ? theme.spacing.xs : 0 
                            }}
                        />
                    ))}
                </View>
            )}

            {/* Subtitle */}
            {showSubtitle && (
                <Skeleton
                    width="60%"
                    height={18}
                    variant="text"
                    style={{ marginBottom: theme.spacing.md }}
                />
            )}

            {/* Description */}
            {showDescription && (
                <View style={{ marginBottom: theme.spacing.md }}>
                    {Array.from({ length: descriptionLines }).map((_, index) => (
                        <Skeleton
                            key={`desc-${index}`}
                            width={
                                index === descriptionLines - 1 
                                    ? '80%' 
                                    : index === 0 
                                        ? '100%' 
                                        : '95%'
                            }
                            height={16}
                            variant="text"
                            style={{ 
                                marginBottom: index < descriptionLines - 1 ? theme.spacing.xs : 0 
                            }}
                        />
                    ))}
                </View>
            )}

            {/* Actions */}
            {showActions && (
                <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Skeleton
                        width={80}
                        height={32}
                        variant="rounded"
                    />
                    <Skeleton
                        width={100}
                        height={32}
                        variant="rounded"
                    />
                </View>
            )}
        </View>
    );
};