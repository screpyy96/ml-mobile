/**
 * Design System - Skeleton Types
 * TypeScript interfaces for Skeleton loading components
 */

import { ViewStyle, DimensionValue } from 'react-native';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';
export type SkeletonSize = 'small' | 'medium' | 'large';

export interface SkeletonProps {
  // Dimensions
  width?: DimensionValue;
  height?: DimensionValue;
  
  // Configuration
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  size?: SkeletonSize;
  
  // Styling
  style?: ViewStyle;
  backgroundColor?: string;
  highlightColor?: string;
  
  // Accessibility
  testID?: string;
}

export interface SkeletonCardProps {
  // Configuration
  showImage?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  
  // Layout
  imageHeight?: number;
  titleLines?: number;
  descriptionLines?: number;
  
  // Styling
  style?: ViewStyle;
  
  // Accessibility
  testID?: string;
}

export interface SkeletonListProps {
  // Configuration
  itemCount?: number;
  itemHeight?: number;
  showSeparator?: boolean;
  
  // Item configuration
  showAvatar?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  titleLines?: number;
  
  // Styling
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  
  // Accessibility
  testID?: string;
}

export interface SkeletonProfileProps {
  // Configuration
  showAvatar?: boolean;
  showCoverImage?: boolean;
  showBadges?: boolean;
  showStats?: boolean;
  
  // Layout
  avatarSize?: number;
  coverHeight?: number;
  badgeCount?: number;
  statsCount?: number;
  
  // Styling
  style?: ViewStyle;
  
  // Accessibility
  testID?: string;
}