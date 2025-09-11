/**
 * Design System - Button Variants
 * Specialized button components for common use cases
 */

import React from 'react';
import { Button } from './Button';
import { ButtonProps } from './types';

// Primary action button (most common CTA)
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

// Secondary action button
export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

// Outline button for less prominent actions
export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="outline" />
);

// Ghost button for subtle actions
export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="ghost" />
);

// Large primary button for main CTAs
export const CTAButton: React.FC<Omit<ButtonProps, 'variant' | 'size' | 'fullWidth'>> = (props) => (
  <Button {...props} variant="primary" size="large" fullWidth />
);

// Small button for compact spaces
export const CompactButton: React.FC<Omit<ButtonProps, 'size'>> = (props) => (
  <Button {...props} size="small" />
);

// Icon-only button
interface IconButtonProps extends Omit<ButtonProps, 'title' | 'leftIcon' | 'rightIcon'> {
  icon: string;
  accessibilityLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  accessibilityLabel, 
  ...props 
}) => (
  <Button
    {...props}
    title=""
    leftIcon={icon}
    accessibilityLabel={accessibilityLabel}
    style={[
      { 
        paddingHorizontal: 12, 
        minWidth: 44, 
        aspectRatio: 1 
      }, 
      props.style
    ].filter(Boolean) as any}
  />
);

// Loading button (shows loading state)
export const LoadingButton: React.FC<Omit<ButtonProps, 'loading'>> = (props) => (
  <Button {...props} loading />
);

// Error button (shows error state)
export const ErrorButton: React.FC<Omit<ButtonProps, 'error'>> = (props) => (
  <Button {...props} error />
);

// Success button with checkmark
export const SuccessButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <Button {...props} variant="primary" leftIcon="check" />
);

// Back button
export const BackButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <Button {...props} variant="ghost" leftIcon="arrow-back" />
);

// Close button
export const CloseButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <IconButton {...props} icon="close" variant="ghost" accessibilityLabel="Close" />
);

// Add button
export const AddButton: React.FC<Omit<ButtonProps, 'leftIcon'>> = (props) => (
  <Button {...props} leftIcon="add" />
);

// Edit button
export const EditButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <Button {...props} variant="outline" leftIcon="edit" />
);

// Delete button
export const DeleteButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <Button {...props} variant="outline" leftIcon="delete" error />
);

// Share button
export const ShareButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <Button {...props} variant="ghost" leftIcon="share" />
);

// Favorite button
interface FavoriteButtonProps extends Omit<ButtonProps, 'leftIcon' | 'variant'> {
  isFavorite?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite = false, 
  ...props 
}) => (
  <IconButton
    {...props}
    icon={isFavorite ? "favorite" : "favorite-border"}
    variant="ghost"
    accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
  />
);

// Call button
export const CallButton: React.FC<Omit<ButtonProps, 'leftIcon'>> = (props) => (
  <Button {...props} leftIcon="phone" />
);

// Message button
export const MessageButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <Button {...props} variant="outline" leftIcon="message" />
);

// Filter button
export const FilterButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <Button {...props} variant="ghost" leftIcon="filter-list" />
);

// Search button
export const SearchButton: React.FC<Omit<ButtonProps, 'leftIcon'>> = (props) => (
  <Button {...props} leftIcon="search" />
);

// Refresh button
export const RefreshButton: React.FC<Omit<ButtonProps, 'leftIcon' | 'variant'>> = (props) => (
  <IconButton {...props} icon="refresh" variant="ghost" accessibilityLabel="Refresh" />
);