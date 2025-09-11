/**
 * Design System - Spacing Tokens
 * Consistent spacing scale for Meserias Local app
 */

export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export const spacing: SpacingScale = {
  xs: 4,   // 4px - Minimal spacing
  sm: 8,   // 8px - Small spacing
  md: 16,  // 16px - Medium spacing (base unit)
  lg: 24,  // 24px - Large spacing
  xl: 32,  // 32px - Extra large spacing
  xxl: 48, // 48px - Double extra large spacing
  xxxl: 64 // 64px - Triple extra large spacing
};

// Border radius scale
export interface BorderRadiusScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export const borderRadius: BorderRadiusScale = {
  xs: 4,   // Small elements
  sm: 8,   // Buttons, inputs
  md: 12,  // Cards, containers
  lg: 16,  // Large cards
  xl: 24,  // Modals, sheets
  full: 9999 // Circular elements
};

// Layout dimensions
export interface LayoutDimensions {
  minTouchTarget: number;
  headerHeight: number;
  tabBarHeight: number;
  buttonHeight: number;
  inputHeight: number;
  cardMinHeight: number;
}

export const layout: LayoutDimensions = {
  minTouchTarget: 44,  // Minimum touch target size
  headerHeight: 56,    // Standard header height
  tabBarHeight: 80,    // Bottom tab bar height
  buttonHeight: 48,    // Standard button height
  inputHeight: 48,     // Standard input height
  cardMinHeight: 120   // Minimum card height
};

// Container padding and margins
export interface ContainerSpacing {
  screenPadding: number;
  cardPadding: number;
  sectionSpacing: number;
  itemSpacing: number;
}

export const container: ContainerSpacing = {
  screenPadding: spacing.md,    // Standard screen padding
  cardPadding: spacing.lg,      // Card internal padding
  sectionSpacing: spacing.xl,   // Spacing between sections
  itemSpacing: spacing.sm       // Spacing between list items
};