import { MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    surface: colors.background,
    background: colors.background,
    onSurface: colors.text,
    onBackground: colors.text,
    error: colors.error,
  },
};

// Custom theme extensions for your app (not for PaperProvider)
export const customTheme = {
  colors: {
    primary: {
      500: colors.primary,
      400: colors.primaryLight,
      600: colors.primaryDark,
    },
    secondary: {
      500: colors.secondary,
      400: colors.secondaryLight,
      600: colors.secondaryDark,
    },
    surface: colors.background,
    background: {
      primary: colors.background,
      secondary: colors.backgroundSecondary,
    },
    onSurface: colors.text,
    onBackground: colors.text,
    status: {
      error: colors.error,
      success: colors.success,
      warning: colors.warning,
      info: colors.info,
    },
    accent: {
      green: colors.success,
      orange: colors.warning,
      blue: colors.info,
      yellow: colors.star,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      light: colors.textLight,
      inverse: colors.textWhite,
    },
  },
};