/**
 * Design System - Skeleton Variants
 * Specialized skeleton components for common use cases
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../themes/ThemeProvider';
import { Skeleton } from './Skeleton';
import { SkeletonCard } from './SkeletonCard';
import { SkeletonList } from './SkeletonList';
import { SkeletonProfile } from './SkeletonProfile';

// Job card skeleton
export const SkeletonJobCard: React.FC<{ style?: any }> = ({ style }) => (
    <SkeletonCard
        showImage={false}
        showTitle={true}
        showSubtitle={true}
        showDescription={true}
        showActions={true}
        titleLines={1}
        descriptionLines={2}
        style={style}
    />
);

// Profile card skeleton
export const SkeletonProfileCard: React.FC<{ style?: any }> = ({ style }) => (
    <SkeletonCard
        showImage={true}
        showTitle={true}
        showSubtitle={true}
        showDescription={false}
        showActions={false}
        imageHeight={120}
        titleLines={1}
        style={style}
    />
);

// Review card skeleton
export const SkeletonReviewCard: React.FC<{ style?: any }> = ({ style }) => {
    const { theme } = useTheme();

    return (
        <View style={[{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            marginVertical: theme.spacing.xs,
            marginHorizontal: theme.spacing.md,
            ...theme.shadows.md,
        }, style]}>
            {/* Header with avatar and name */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: theme.spacing.md,
            }}>
                <Skeleton
                    width={40}
                    height={40}
                    variant="circular"
                    style={{ marginRight: theme.spacing.md }}
                />
                <View style={{ flex: 1 }}>
                    <Skeleton
                        width="60%"
                        height={18}
                        variant="text"
                        style={{ marginBottom: theme.spacing.xs }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                width={12}
                                height={12}
                                variant="circular"
                                style={{ marginRight: 2 }}
                            />
                        ))}
                    </View>
                </View>
                <Skeleton
                    width={60}
                    height={14}
                    variant="text"
                />
            </View>

            {/* Review text */}
            <Skeleton
                width="100%"
                height={16}
                variant="text"
                style={{ marginBottom: theme.spacing.xs }}
            />
            <Skeleton
                width="85%"
                height={16}
                variant="text"
            />
        </View>
    );
};

// Message list skeleton
export const SkeletonMessageList: React.FC<{ style?: any }> = ({ style }) => (
    <SkeletonList
        itemCount={8}
        itemHeight={70}
        showAvatar={true}
        showTitle={true}
        showSubtitle={true}
        titleLines={1}
        style={style}
    />
);

// Job list skeleton
export const SkeletonJobList: React.FC<{ style?: any }> = ({ style }) => (
    <SkeletonList
        itemCount={6}
        itemHeight={90}
        showAvatar={false}
        showTitle={true}
        showSubtitle={true}
        titleLines={2}
        style={style}
    />
);

// Search results skeleton
export const SkeletonSearchResults: React.FC<{ style?: any }> = ({ style }) => (
    <SkeletonList
        itemCount={10}
        itemHeight={60}
        showAvatar={true}
        showTitle={true}
        showSubtitle={false}
        titleLines={1}
        style={style}
    />
);

// Dashboard stats skeleton
export const SkeletonDashboardStats: React.FC<{ style?: any }> = ({ style }) => {
    const { theme } = useTheme();

    return (
        <View style={[{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: theme.spacing.md,
        }, style]}>
            {Array.from({ length: 3 }).map((_, index) => (
                <View key={index} style={{ alignItems: 'center' }}>
                    <Skeleton
                        width={50}
                        height={30}
                        variant="text"
                        style={{ marginBottom: theme.spacing.xs }}
                    />
                    <Skeleton
                        width={70}
                        height={16}
                        variant="text"
                    />
                </View>
            ))}
        </View>
    );
};

// Navigation skeleton
export const SkeletonNavigation: React.FC<{ style?: any }> = ({ style }) => {
    const { theme } = useTheme();

    return (
        <View style={[{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingVertical: theme.spacing.sm,
            backgroundColor: theme.colors.background.primary,
            borderTopWidth: 1,
            borderTopColor: theme.colors.secondary[200],
        }, style]}>
            {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} style={{ alignItems: 'center' }}>
                    <Skeleton
                        width={24}
                        height={24}
                        variant="circular"
                        style={{ marginBottom: theme.spacing.xs / 2 }}
                    />
                    <Skeleton
                        width={40}
                        height={12}
                        variant="text"
                    />
                </View>
            ))}
        </View>
    );
};

// Form skeleton
export const SkeletonForm: React.FC<{ fieldCount?: number; style?: any }> = ({
    fieldCount = 4,
    style
}) => {
    const { theme } = useTheme();

    return (
        <View style={[{ paddingHorizontal: theme.spacing.md }, style]}>
            {Array.from({ length: fieldCount }).map((_, index) => (
                <View key={index} style={{ marginBottom: theme.spacing.lg }}>
                    <Skeleton
                        width="30%"
                        height={16}
                        variant="text"
                        style={{ marginBottom: theme.spacing.xs }}
                    />
                    <Skeleton
                        width="100%"
                        height={48}
                        variant="rounded"
                    />
                </View>
            ))}

            {/* Submit button */}
            <Skeleton
                width="100%"
                height={48}
                variant="rounded"
                style={{ marginTop: theme.spacing.md }}
            />
        </View>
    );
};

// Image gallery skeleton
export const SkeletonImageGallery: React.FC<{ imageCount?: number; style?: any }> = ({
    imageCount = 6,
    style
}) => {
    const { theme } = useTheme();

    return (
        <View style={[{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: theme.spacing.md,
        }, style]}>
            {Array.from({ length: imageCount }).map((_, index) => (
                <Skeleton
                    key={index}
                    width="48%"
                    height={120}
                    variant="rounded"
                    style={{
                        marginRight: index % 2 === 0 ? '4%' : 0,
                        marginBottom: theme.spacing.sm,
                    }}
                />
            ))}
        </View>
    );
};