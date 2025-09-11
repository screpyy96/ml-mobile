/**
 * Design System - Image Types
 * TypeScript interfaces for Image components
 */

import { ImageStyle, ViewStyle } from 'react-native';

export type ImageVariant = 'default' | 'avatar' | 'cover' | 'thumbnail' | 'hero';
export type ImageSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ImageShape = 'square' | 'circle' | 'rounded' | 'rectangle';
export type ImageFit = 'cover' | 'contain' | 'stretch' | 'center';

export interface ImageProps {
  // Source
  source: any;
  fallbackSource?: any;
  
  // Configuration
  variant?: ImageVariant;
  size?: ImageSize;
  shape?: ImageShape;
  fit?: ImageFit;
  
  // Dimensions
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  
  // Loading
  showLoading?: boolean;
  blurRadius?: number;
  
  // Styling
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  
  // Interaction
  onPress?: () => void;
  onLongPress?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

export interface AvatarProps {
  // Source
  source?: any;
  fallbackSource?: any;
  
  // Configuration
  size?: ImageSize | number;
  name?: string;
  
  // Status
  online?: boolean;
  badge?: string | number;
  
  // Styling
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  
  // Interaction
  onPress?: () => void;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

export interface ImageGalleryProps {
  images: ImageData[];
  initialIndex?: number;
  onImagePress?: (image: ImageData, index: number) => void;
  onClose?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export interface ImageData {
  id: string;
  uri: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}