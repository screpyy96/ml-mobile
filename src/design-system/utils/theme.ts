/**
 * Design System - Theme Utilities
 * Helper functions for working with themes
 */

import { Theme } from '../themes/types';
import { ColorPalette } from '../tokens/colors';

// Get color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`);
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  return color;
};

// Get contrasting text color
export const getContrastingTextColor = (backgroundColor: string, theme: Theme): string => {
  // Simple contrast check - in a real app you might want a more sophisticated algorithm
  const isDarkBackground = backgroundColor === theme.colors.background.primary && theme.mode === 'dark';
  return isDarkBackground ? theme.colors.text.primary : theme.colors.text.primary;
};

// Get status color by type
export const getStatusColor = (
  status: 'success' | 'warning' | 'error' | 'info',
  colors: ColorPalette
): string => {
  return colors.status[status];
};

// Get primary color shade
export const getPrimaryShade = (
  shade: keyof ColorPalette['primary'],
  colors: ColorPalette
): string => {
  return colors.primary[shade];
};

// Get secondary color shade
export const getSecondaryShade = (
  shade: keyof ColorPalette['secondary'],
  colors: ColorPalette
): string => {
  return colors.secondary[shade];
};

// Create gradient colors
export const createGradient = (
  startColor: string,
  endColor: string,
  opacity: number = 1
): string[] => {
  return [
    getColorWithOpacity(startColor, opacity),
    getColorWithOpacity(endColor, opacity)
  ];
};

// Get theme-aware shadow color
export const getShadowColor = (theme: Theme): string => {
  return theme.mode === 'dark' ? '#ffffff' : '#000000';
};

// Interpolate between two colors (basic implementation)
export const interpolateColor = (
  color1: string,
  color2: string,
  factor: number
): string => {
  // This is a simplified implementation
  // In a production app, you might want to use a more sophisticated color interpolation library
  if (factor <= 0) return color1;
  if (factor >= 1) return color2;
  
  // For now, just return one of the colors based on factor
  return factor < 0.5 ? color1 : color2;
};

// Check if color is light or dark
export const isLightColor = (color: string): boolean => {
  // Simple implementation - convert hex to RGB and calculate luminance
  if (!color.startsWith('#')) return true;
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
};