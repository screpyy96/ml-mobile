/**
 * Design System - SkeletonList Component
 * Skeleton loading for list layouts
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../themes/ThemeProvider';
import { Skeleton } from './Skeleton';
import { SkeletonListProps } from './types';

export const SkeletonList: React.FC<SkeletonListProps> = ({
    itemCount = 5,
    itemHeight = 80,
    showSeparator = true,
    showAvatar = true,
    showTitle = true,
    showSubtitle = true,
    titleLines = 1,
    style,
    itemStyle,
    testID,
}) => {
    const { theme } = useTheme();

    const renderListItem = (index: number) => {
        const isLast = index === itemCount - 1;

        return (
            <View key={index}>
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: theme.spacing.md,
                            paddingVertical: theme.spacing.sm,
                            minHeight: itemHeight,
                        },
                        itemStyle,
                    ]}
                >
                    {/* Avatar */}
                    {showAvatar && (
                        <Skeleton
                            width={40}
                            height={40}
                            variant="circular"
                            style={{ marginRight: theme.spacing.md }}
                        />
                    )}

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                        {/* Title */}
                        {showTitle && (
                            <View style={{ marginBottom: showSubtitle ? theme.spacing.xs : 0 }}>
                                {Array.from({ length: titleLines }).map((_, titleIndex) => (
                                    <Skeleton
                                        key={`title-${titleIndex}`}
                                        width={
                                            titleIndex === titleLines - 1 
                                                ? '70%' 
                                                : '100%'
                                        }
                                        height={18}
                                        variant="text"
                                        style={{ 
                                            marginBottom: titleIndex < titleLines - 1 ? theme.spacing.xs / 2 : 0 
                                        }}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Subtitle */}
                        {showSubtitle && (
                            <Skeleton
                                width="50%"
                                height={14}
                                variant="text"
                            />
                        )}
                    </View>

                    {/* Right content */}
                    <Skeleton
                        width={60}
                        height={20}
                        variant="text"
                    />
                </View>

                {/* Separator */}
                {showSeparator && !isLast && (
                    <View
                        style={{
                            height: 1,
                            backgroundColor: theme.colors.secondary[200],
                            marginLeft: showAvatar ? theme.spacing.md + 40 + theme.spacing.md : theme.spacing.md,
                            marginRight: theme.spacing.md,
                        }}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={style} testID={testID}>
            {Array.from({ length: itemCount }).map((_, index) => renderListItem(index))}
        </View>
    );
};