/**
 * Design System - Typography Tokens
 * Premium typography scale for Meserias Local app
 */

export interface TypographyStyle {
  fontSize: number;
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800';
  lineHeight: number;
  letterSpacing: number;
}

export interface TypographyScale {
  display: TypographyStyle;
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  body: TypographyStyle;
  bodyLarge: TypographyStyle;
  bodySmall: TypographyStyle;
  caption: TypographyStyle;
  button: TypographyStyle;
  overline: TypographyStyle;
}

export const typography: TypographyScale = {
  // Display text (hero sections)
  display: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5
  },
  
  // Main headings
  h1: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: -0.3
  },
  
  // Section headings
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.2
  },
  
  // Subsection headings
  h3: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    letterSpacing: -0.1
  },
  
  // Small headings
  h4: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    letterSpacing: 0
  },
  
  // Large body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0
  },
  
  // Standard body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0
  },
  
  // Small body text
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1
  },
  
  // Caption text
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.1
  },
  
  // Overline text (labels, categories)
  overline: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 1.5
  }
};

// Font family configuration
export const fontFamily = {
  primary: 'Inter',
  fallback: {
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System'
  }
};

// Font weight mapping for different platforms
export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800'
} as const;