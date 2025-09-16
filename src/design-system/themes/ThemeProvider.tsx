/**
 * Design System - Theme Provider
 * Context provider for theme management with light/dark mode support
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme } from './light';
import { darkTheme } from './dark';
import { Theme } from './types';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  initialTheme: 'light' | 'dark';
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ initialTheme, children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(() =>
    initialTheme ? initialTheme === 'dark' : colorScheme === 'dark'
  );

  // Ensure theme object is complete with fallbacks
  const getSafeTheme = (): Theme => {
    const baseTheme = isDark ? darkTheme : lightTheme;
    
    // Add safety checks for nested properties
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: {
          50: baseTheme.colors?.primary?.[50] || '#f0f9ff',
          100: baseTheme.colors?.primary?.[100] || '#e0f2fe',
          200: baseTheme.colors?.primary?.[200] || '#bae6fd',
          300: baseTheme.colors?.primary?.[300] || '#7dd3fc',
          400: baseTheme.colors?.primary?.[400] || '#38bdf8',
          500: baseTheme.colors?.primary?.[500] || '#0ea5e9',
          600: baseTheme.colors?.primary?.[600] || '#0284c7',
          700: baseTheme.colors?.primary?.[700] || '#0369a1',
          800: baseTheme.colors?.primary?.[800] || '#075985',
          900: baseTheme.colors?.primary?.[900] || '#0c4a6e',
        },
        secondary: {
          50: baseTheme.colors?.secondary?.[50] || '#fafaf9',
          100: baseTheme.colors?.secondary?.[100] || '#f5f5f4',
          200: baseTheme.colors?.secondary?.[200] || '#e7e5e4',
          300: baseTheme.colors?.secondary?.[300] || '#d6d3d1',
          400: baseTheme.colors?.secondary?.[400] || '#a8a29e',
          500: baseTheme.colors?.secondary?.[500] || '#78716c',
          600: baseTheme.colors?.secondary?.[600] || '#57534e',
          700: baseTheme.colors?.secondary?.[700] || '#44403c',
          800: baseTheme.colors?.secondary?.[800] || '#292524',
          900: baseTheme.colors?.secondary?.[900] || '#1c1917',
        },
        accent: {
          orange: baseTheme.colors?.accent?.orange || '#f97316',
          green: baseTheme.colors?.accent?.green || '#16a34a',
          red: baseTheme.colors?.accent?.red || '#dc2626',
          yellow: baseTheme.colors?.accent?.yellow || '#eab308',
        },
        background: {
          primary: baseTheme.colors?.background?.primary || '#ffffff',
          secondary: baseTheme.colors?.background?.secondary || '#f8fafc',
          tertiary: baseTheme.colors?.background?.tertiary || '#f1f5f9',
        },
        text: {
          primary: baseTheme.colors?.text?.primary || '#1e293b',
          secondary: baseTheme.colors?.text?.secondary || '#64748b',
          tertiary: baseTheme.colors?.text?.tertiary || '#94a3b8',
          inverse: baseTheme.colors?.text?.inverse || '#ffffff',
        },
        status: {
          success: baseTheme.colors?.status?.success || '#16a34a',
          warning: baseTheme.colors?.status?.warning || '#eab308',
          error: baseTheme.colors?.status?.error || '#dc2626',
          info: baseTheme.colors?.status?.info || '#0ea5e9',
        },
        shadow: baseTheme.colors?.shadow || '#000000',
      },
      typography: baseTheme.typography || {},
      spacing: baseTheme.spacing || {},
      borderRadius: baseTheme.borderRadius || {},
      layout: baseTheme.layout || {},
      shadows: baseTheme.shadows || {},
      animations: baseTheme.animations || {},
    };
  };

  const theme = getSafeTheme();

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setIsDark(newTheme === 'dark');
  };

  useEffect(() => {
    // Only follow system color scheme when no explicit initialTheme is provided
    if (initialTheme === undefined) {
      setIsDark(colorScheme === 'dark');
    }
  }, [colorScheme, initialTheme]);

  const value = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook to get theme colors (shorthand)
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

// Hook to get typography (shorthand)
export const useTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

// Hook to get spacing (shorthand)
export const useSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

// Hook to get shadows (shorthand)
export const useShadows = () => {
  const { theme } = useTheme();
  return theme.shadows;
};