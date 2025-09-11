/**
 * Design System - Color Tokens
 * Premium color palette for Meserias Local app
 */

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface AccentColors {
  orange: string;
  green: string;
  red: string;
  yellow: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  tertiary: string;
  inverse: string;
}

export interface StatusColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  accent: AccentColors;
  background: BackgroundColors;
  text: TextColors;
  status: StatusColors;
  shadow: string;
}

// Light theme colors
export const lightColors: ColorPalette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand blue
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },
  
  secondary: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917'
  },
  
  accent: {
    orange: '#f97316',
    green: '#16a34a',
    red: '#dc2626',
    yellow: '#eab308'
  },
  
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9'
  },
  
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff'
  },
  
  status: {
    success: '#16a34a',
    warning: '#eab308',
    error: '#dc2626',
    info: '#0ea5e9'
  },
  
  shadow: '#000000'
};

// Dark theme colors
export const darkColors: ColorPalette = {
  primary: {
    50: '#0c4a6e',
    100: '#075985',
    200: '#0369a1',
    300: '#0284c7',
    400: '#0ea5e9',
    500: '#38bdf8', // Lighter for dark mode
    600: '#7dd3fc',
    700: '#bae6fd',
    800: '#e0f2fe',
    900: '#f0f9ff'
  },
  
  secondary: {
    50: '#1c1917',
    100: '#292524',
    200: '#44403c',
    300: '#57534e',
    400: '#78716c',
    500: '#a8a29e',
    600: '#d6d3d1',
    700: '#e7e5e4',
    800: '#f5f5f4',
    900: '#fafaf9'
  },
  
  accent: {
    orange: '#fb923c',
    green: '#22c55e',
    red: '#ef4444',
    yellow: '#fde047'
  },
  
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155'
  },
  
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#1e293b'
  },
  
  status: {
    success: '#22c55e',
    warning: '#fde047',
    error: '#ef4444',
    info: '#38bdf8'
  },
  
  shadow: '#ffffff'
};

// Default export for current theme colors
export const colors = lightColors;