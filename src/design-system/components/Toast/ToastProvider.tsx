/**
 * Design System - Toast Provider
 * Context provider for managing toast notifications
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from './Toast';
import { ToastProps, ToastContextValue } from './types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (props: Omit<ToastProps, 'onDismiss'>) => {
    setToastProps({
      ...props,
      onDismiss: hideToast,
    });
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
    // Clear toast props after animation completes
    setTimeout(() => {
      setToastProps(null);
    }, 300);
  };

  const contextValue: ToastContextValue = {
    showToast,
    hideToast,
    isVisible,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {isVisible && toastProps && <Toast {...toastProps} />}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};