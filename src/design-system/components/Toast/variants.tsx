/**
 * Design System - Toast Variants
 * Specialized toast and notification components
 */

import React from 'react';
import { useToast } from './ToastProvider';
import { ToastProps } from './types';

// Success toast
export const useSuccessToast = () => {
  const { showToast } = useToast();
  
  return (message: string, title?: string, options?: Partial<ToastProps>) => {
    showToast({
      type: 'success',
      title,
      message,
      duration: 3000,
      ...options,
    });
  };
};

// Error toast
export const useErrorToast = () => {
  const { showToast } = useToast();
  
  return (message: string, title?: string, options?: Partial<ToastProps>) => {
    showToast({
      type: 'error',
      title,
      message,
      duration: 5000,
      ...options,
    });
  };
};

// Warning toast
export const useWarningToast = () => {
  const { showToast } = useToast();
  
  return (message: string, title?: string, options?: Partial<ToastProps>) => {
    showToast({
      type: 'warning',
      title,
      message,
      duration: 4000,
      ...options,
    });
  };
};

// Info toast
export const useInfoToast = () => {
  const { showToast } = useToast();
  
  return (message: string, title?: string, options?: Partial<ToastProps>) => {
    showToast({
      type: 'info',
      title,
      message,
      duration: 3000,
      ...options,
    });
  };
};

// Loading toast
export const useLoadingToast = () => {
  const { showToast, hideToast } = useToast();
  
  const showLoading = (message: string = 'Loading...', title?: string) => {
    showToast({
      type: 'info',
      title,
      message,
      persistent: true,
      animation: 'fade',
    });
  };

  const hideLoading = () => {
    hideToast();
  };

  return { showLoading, hideLoading };
};

// Action toast with button
export const useActionToast = () => {
  const { showToast } = useToast();
  
  return (
    message: string,
    actionText: string,
    onAction: () => void,
    options?: Partial<ToastProps>
  ) => {
    showToast({
      type: 'info',
      message,
      actionText,
      onActionPress: onAction,
      duration: 6000,
      persistent: true,
      ...options,
    });
  };
};

// Network error toast
export const useNetworkErrorToast = () => {
  const { showToast } = useToast();
  
  return (retryAction?: () => void) => {
    showToast({
      type: 'error',
      title: 'Connection Error',
      message: 'Please check your internet connection and try again.',
      actionText: retryAction ? 'Retry' : undefined,
      onActionPress: retryAction,
      duration: 0,
      persistent: true,
    });
  };
};

// Form validation toast
export const useValidationToast = () => {
  const { showToast } = useToast();
  
  return (errors: string[]) => {
    const message = errors.length === 1 
      ? errors[0] 
      : `Please fix ${errors.length} validation errors`;
    
    showToast({
      type: 'warning',
      title: 'Validation Error',
      message,
      duration: 4000,
    });
  };
};

// Save success toast
export const useSaveSuccessToast = () => {
  const { showToast } = useToast();
  
  return (itemName: string = 'Item') => {
    showToast({
      type: 'success',
      message: `${itemName} saved successfully!`,
      duration: 2000,
      position: 'bottom',
    });
  };
};

// Delete confirmation toast
export const useDeleteToast = () => {
  const { showToast } = useToast();
  
  return (
    itemName: string,
    onConfirm: () => void,
    onUndo?: () => void
  ) => {
    showToast({
      type: 'info',
      message: `${itemName} deleted`,
      actionText: onUndo ? 'Undo' : undefined,
      onActionPress: onUndo,
      duration: 5000,
      position: 'bottom',
    });
  };
};

// Update available toast
export const useUpdateToast = () => {
  const { showToast } = useToast();
  
  return (onUpdate: () => void) => {
    showToast({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of the app is available.',
      actionText: 'Update',
      onActionPress: onUpdate,
      persistent: true,
    });
  };
};

// Offline toast
export const useOfflineToast = () => {
  const { showToast, hideToast } = useToast();
  
  const showOffline = () => {
    showToast({
      type: 'warning',
      message: 'You are currently offline',
      persistent: true,
      position: 'bottom',
    });
  };

  const hideOffline = () => {
    hideToast();
  };

  return { showOffline, hideOffline };
};