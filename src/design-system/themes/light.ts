/**
 * Design System - Light Theme
 * Light theme configuration
 */

import { Theme } from './types';
import { lightColors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius, layout } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';
import { animations } from '../tokens/animations';

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  layout,
  shadows,
  animations
};