/**
 * Design System - Dark Theme
 * Dark theme configuration
 */

import { Theme } from './types';
import { darkColors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius, layout } from '../tokens/spacing';
import { darkShadows } from '../tokens/shadows';
import { animations } from '../tokens/animations';

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  layout,
  shadows: darkShadows,
  animations
};