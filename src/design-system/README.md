# Meserias Local Design System

A comprehensive design system for the Meserias Local mobile application, providing consistent styling, theming, and animations across the entire app.

## Overview

The design system is built around modern mobile design principles with emphasis on:
- Visual hierarchy and consistency
- Smooth interactions and animations
- Light/dark mode support
- Accessibility compliance
- Performance optimization

## Structure

```
src/design-system/
├── tokens/           # Design tokens (colors, typography, spacing, etc.)
├── themes/           # Theme configurations and provider
├── utils/            # Utility functions and helpers
├── examples/         # Example components and usage
└── index.ts          # Main export file
```

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import React from 'react';
import { ThemeProvider } from './src/design-system';
import { App } from './App';

export default function AppWithTheme() {
  return (
    <ThemeProvider initialTheme="system">
      <App />
    </ThemeProvider>
  );
}
```

### 2. Use theme hooks in components

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useColors, useTypography, useSpacing } from './src/design-system';

export const MyComponent = () => {
  const { theme } = useTheme();
  const colors = useColors();
  const typography = useTypography();
  const spacing = useSpacing();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
      padding: spacing.md,
    },
    title: {
      ...typography.h1,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};
```

## Design Tokens

### Colors

The color system includes:
- **Primary**: Main brand colors (blue scale)
- **Secondary**: Supporting colors (gray scale)
- **Accent**: Highlight colors (orange, green, red, yellow)
- **Background**: Surface colors
- **Text**: Text colors with proper contrast
- **Status**: Success, warning, error, info colors

```tsx
import { useColors } from './src/design-system';

const colors = useColors();
// colors.primary[500] - Main brand blue
// colors.accent.orange - Highlight orange
// colors.background.primary - Main background
```

### Typography

Consistent typography scale with proper line heights and letter spacing:

```tsx
import { useTypography } from './src/design-system';

const typography = useTypography();
// typography.display - Hero text
// typography.h1, h2, h3 - Headings
// typography.body - Body text
// typography.caption - Small text
```

### Spacing

Consistent spacing scale based on 4px grid:

```tsx
import { useSpacing } from './src/design-system';

const spacing = useSpacing();
// spacing.xs (4px), spacing.sm (8px), spacing.md (16px)
// spacing.lg (24px), spacing.xl (32px), spacing.xxl (48px)
```

### Shadows

Elevation system for depth and hierarchy:

```tsx
import { useShadows } from './src/design-system';

const shadows = useShadows();
// shadows.sm - Subtle cards
// shadows.md - Elevated elements
// shadows.lg - Modals and overlays
```

## Theming

### Theme Modes

- **light**: Light theme
- **dark**: Dark theme  
- **system**: Follows system preference

### Theme Management

```tsx
import { useTheme } from './src/design-system';

const { theme, themeMode, isDark, toggleTheme, setThemeMode } = useTheme();

// Toggle between light/dark
toggleTheme();

// Set specific mode
setThemeMode('dark');
```

## Animations

Pre-configured animation utilities for consistent motion:

```tsx
import { 
  createTimingAnimation, 
  createSpringAnimation,
  createButtonPressAnimation 
} from './src/design-system';

// Timing animation
const fadeIn = createTimingAnimation(opacityValue, 1, 'standard');

// Spring animation
const scaleUp = createSpringAnimation(scaleValue, 1.1, 'gentle');

// Button press animation
const { pressIn, pressOut } = createButtonPressAnimation(scaleValue);
```

## Best Practices

### 1. Always use design tokens
```tsx
// ✅ Good
backgroundColor: colors.primary[500]

// ❌ Avoid
backgroundColor: '#0ea5e9'
```

### 2. Use theme hooks for consistency
```tsx
// ✅ Good
const colors = useColors();
const typography = useTypography();

// ❌ Avoid
import { lightColors } from './tokens/colors';
```

### 3. Leverage animation utilities
```tsx
// ✅ Good
const animation = createTimingAnimation(value, 1, 'standard');

// ❌ Avoid
Animated.timing(value, { duration: 300, ... });
```

### 4. Follow spacing scale
```tsx
// ✅ Good
marginBottom: spacing.md

// ❌ Avoid
marginBottom: 15
```

## Accessibility

The design system includes:
- WCAG AA compliant color contrast ratios
- Proper touch target sizes (minimum 44px)
- Support for reduced motion preferences
- Screen reader compatibility

## Performance

- Uses native driver for animations where possible
- Optimized shadow rendering
- Efficient theme switching
- Minimal re-renders with context optimization

## Contributing

When adding new tokens or components:
1. Follow existing naming conventions
2. Ensure accessibility compliance
3. Test in both light and dark modes
4. Update documentation and examples
5. Consider performance implications

## Migration from Legacy Theme

The new design system replaces the old `src/constants/colors.ts` and `src/constants/theme.ts` files. 

### Migration Steps:
1. Replace color imports with `useColors()` hook
2. Update component styles to use design tokens
3. Wrap app with `ThemeProvider`
4. Test all screens in both light and dark modes

### Color Mapping:
```tsx
// Old
import { colors } from '../constants/colors';
backgroundColor: colors.primary

// New  
const colors = useColors();
backgroundColor: colors.primary[500]
```