/**
 * Design System - Card Types
 * TypeScript interfaces for Card component
 */

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type CardVariant = 'default' | 'job' | 'profile' | 'review' | 'premium';
export type CardSize = 'small' | 'medium' | 'large';
export type CardState = 'normal' | 'pressed' | 'disabled' | 'featured';

export interface CardProps {
  // Content
  title?: string;
  subtitle?: string;
  description?: string;
  imageSource?: any;
  
  // Card configuration
  variant?: CardVariant;
  size?: CardSize;
  featured?: boolean;
  disabled?: boolean;
  
  // Job card specific
  jobTitle?: string;
  companyName?: string;
  location?: string;
  salary?: string;
  jobType?: string;
  postedDate?: string;
  
  // Profile card specific
  profileName?: string;
  profession?: string;
  rating?: number;
  reviewCount?: number;
  profileImage?: any;
  badges?: string[];
  
  // Review card specific
  reviewerName?: string;
  reviewDate?: string;
  reviewText?: string;
  reviewRating?: number;
  reviewerAvatar?: any;
  
  // Interaction
  onPress?: () => void;
  onLongPress?: () => void;
  
  // Styling
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  
  // Children
  children?: React.ReactNode;
}

export interface CardStyleConfig {
  container: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  body: ViewStyle;
  footer: ViewStyle;
  image: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  description: TextStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  rating: ViewStyle;
  ratingText: TextStyle;
}

export interface JobCardData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  postedDate: string;
  description: string;
  featured?: boolean;
}

export interface ProfileCardData {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  avatar: any;
  badges: string[];
  featured?: boolean;
}

export interface ReviewCardData {
  id: string;
  reviewerName: string;
  reviewerAvatar: any;
  rating: number;
  date: string;
  text: string;
}