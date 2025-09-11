/**
 * Design System - Navigation Types
 * TypeScript interfaces for Navigation components
 */

export interface TabItem {
  key: string;
  label: string;
  icon: string;
  activeIcon?: string;
  badge?: number | string;
  disabled?: boolean;
}