/**
 * Design System - Theme Types
 * TypeScript interfaces for theme configuration
 */

import { ColorPalette } from '../tokens/colors';
import { TypographyScale } from '../tokens/typography';
import { SpacingScale, BorderRadiusScale, LayoutDimensions } from '../tokens/spacing';
import { ShadowScale } from '../tokens/shadows';
import { AnimationScale } from '../tokens/animations';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  layout: LayoutDimensions;
  shadows: ShadowScale;
  animations: AnimationScale;
}

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}