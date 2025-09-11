/**
 * Design System - Toast Types
 * TypeScript interfaces for Toast and Notification components
 */

import { ViewStyle, TextStyle } from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'bottom' | 'center';
export type ToastAnimation = 'slide' | 'fade' | 'scale';

export interface ToastProps {
  // Content
  title?: string;
  message: string;
  
  // Configuration
  type?: ToastType;
  position?: ToastPosition;
  animation?: ToastAnimation;
  duration?: number;
  persistent?: boolean;
  
  // Actions
  onPress?: () => void;
  onDismiss?: () => void;
  actionText?: string;
  onActionPress?: () => void;
  
  // Styling
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

export interface ToastContextValue {
  showToast: (props: Omit<ToastProps, 'onDismiss'>) => void;
  hideToast: () => void;
  isVisible: boolean;
}

export interface NotificationProps {
  // Content
  title: string;
  message?: string;
  timestamp?: string;
  
  // Configuration
  type?: ToastType;
  read?: boolean;
  avatar?: any;
  
  // Actions
  onPress?: () => void;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
  
  // Styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

export interface NotificationListProps {
  notifications: NotificationData[];
  onNotificationPress?: (notification: NotificationData) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  timestamp: string;
  read: boolean;
  avatar?: any;
  data?: any;
}