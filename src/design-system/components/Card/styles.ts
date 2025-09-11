/**
 * Design System - Card Styles
 * Style configurations for Card component variants
 */

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme } from '../../themes/types';
import { CardVariant, CardSize, CardState, CardStyleConfig } from './types';

// Get card styles based on variant, size, and state
export const getCardStyles = (
  theme: Theme,
  variant: CardVariant,
  size: CardSize,
  state: CardState
): CardStyleConfig => {
  const baseContainer: ViewStyle = {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    overflow: 'hidden',
    // Optimized shadow with solid background
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  };

  const baseContent: ViewStyle = {
    padding: theme.spacing.lg,
  };

  const baseHeader: ViewStyle = {
    marginBottom: theme.spacing.md,
  };

  const baseBody: ViewStyle = {
    marginBottom: theme.spacing.md,
  };

  const baseFooter: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const baseImage: ImageStyle = {
    width: '100%',
    height: 200,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  };

  const baseTitle: TextStyle = {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  };

  const baseSubtitle: TextStyle = {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  };

  const baseDescription: TextStyle = {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  };

  const baseBadge: ViewStyle = {
    backgroundColor: theme.colors.primary[100],
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  };

  const baseBadgeText: TextStyle = {
    ...theme.typography.caption,
    color: theme.colors.primary[700],
    fontWeight: '500' as const,
  };

  const baseRating: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const baseRatingText: TextStyle = {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  };

  // Size configurations
  const sizeConfig = getSizeConfig(theme, size);
  
  // Variant configurations
  const variantConfig = getVariantConfig(theme, variant, state);
  
  // State modifications
  const stateConfig = getStateConfig(theme, state);

  return {
    container: {
      ...baseContainer,
      ...sizeConfig.container,
      ...variantConfig.container,
      ...stateConfig.container,
    },
    content: {
      ...baseContent,
      ...sizeConfig.content,
      ...variantConfig.content,
      ...stateConfig.content,
    },
    header: {
      ...baseHeader,
      ...sizeConfig.header,
      ...variantConfig.header,
      ...stateConfig.header,
    },
    body: {
      ...baseBody,
      ...sizeConfig.body,
      ...variantConfig.body,
      ...stateConfig.body,
    },
    footer: {
      ...baseFooter,
      ...sizeConfig.footer,
      ...variantConfig.footer,
      ...stateConfig.footer,
    },
    image: {
      ...baseImage,
      ...sizeConfig.image,
      ...variantConfig.image,
      ...stateConfig.image,
    },
    title: {
      ...baseTitle,
      ...sizeConfig.title,
      ...variantConfig.title,
      ...stateConfig.title,
    },
    subtitle: {
      ...baseSubtitle,
      ...sizeConfig.subtitle,
      ...variantConfig.subtitle,
      ...stateConfig.subtitle,
    },
    description: {
      ...baseDescription,
      ...sizeConfig.description,
      ...variantConfig.description,
      ...stateConfig.description,
    },
    badge: {
      ...baseBadge,
      ...sizeConfig.badge,
      ...variantConfig.badge,
      ...stateConfig.badge,
    },
    badgeText: {
      ...baseBadgeText,
      ...sizeConfig.badgeText,
      ...variantConfig.badgeText,
      ...stateConfig.badgeText,
    },
    rating: {
      ...baseRating,
      ...sizeConfig.rating,
      ...variantConfig.rating,
      ...stateConfig.rating,
    },
    ratingText: {
      ...baseRatingText,
      ...sizeConfig.ratingText,
      ...variantConfig.ratingText,
      ...stateConfig.ratingText,
    },
  };
};

// Size configurations
const getSizeConfig = (theme: Theme, size: CardSize) => {
  switch (size) {
    case 'small':
      return {
        container: {
          marginVertical: theme.spacing.xs / 2,
        },
        content: {
          padding: theme.spacing.md,
        },
        header: {
          marginBottom: theme.spacing.sm,
        },
        body: {
          marginBottom: theme.spacing.sm,
        },
        footer: {},
        image: {
          height: 120,
        },
        title: {
          ...theme.typography.h4,
        },
        subtitle: {
          ...theme.typography.bodySmall,
        },
        description: {
          ...theme.typography.bodySmall,
        },
        badge: {
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: theme.spacing.xs / 2,
        },
        badgeText: {
          fontSize: 11,
        },
        rating: {},
        ratingText: {
          fontSize: 12,
        },
      };
    
    case 'large':
      return {
        container: {
          marginVertical: theme.spacing.md,
          borderRadius: theme.borderRadius.xl,
        },
        content: {
          padding: theme.spacing.xl,
        },
        header: {
          marginBottom: theme.spacing.lg,
        },
        body: {
          marginBottom: theme.spacing.lg,
        },
        footer: {},
        image: {
          height: 280,
          borderTopLeftRadius: theme.borderRadius.xl,
          borderTopRightRadius: theme.borderRadius.xl,
        },
        title: {
          ...theme.typography.h2,
        },
        subtitle: {
          ...theme.typography.bodyLarge,
        },
        description: {
          ...theme.typography.bodyLarge,
          lineHeight: 26,
        },
        badge: {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
        badgeText: {
          ...theme.typography.bodySmall,
        },
        rating: {},
        ratingText: {
          ...theme.typography.body,
        },
      };
    
    case 'medium':
    default:
      return {
        container: {},
        content: {},
        header: {},
        body: {},
        footer: {},
        image: {},
        title: {},
        subtitle: {},
        description: {},
        badge: {},
        badgeText: {},
        rating: {},
        ratingText: {},
      };
  }
};

// Variant configurations
const getVariantConfig = (theme: Theme, variant: CardVariant, state: CardState) => {
  const isFeatured = state === 'featured';
  
  switch (variant) {
    case 'job':
      return {
        container: {
          ...(isFeatured ? {
            borderWidth: 2,
            borderColor: theme.colors.accent.orange,
            // Optimized shadow with solid background
            shadowColor: theme.colors.shadow || '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          } : {}),
        },
        content: {},
        header: {
          flexDirection: 'row' as const,
          justifyContent: 'space-between' as const,
          alignItems: 'flex-start' as const,
        },
        body: {},
        footer: {
          flexDirection: 'row' as const,
          justifyContent: 'space-between' as const,
          alignItems: 'center' as const,
          paddingTop: theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.secondary[200],
        },
        image: {
          height: 0, // Job cards typically don't have images
        },
        title: {
          ...theme.typography.h3,
          color: theme.colors.text.primary,
          fontWeight: '600' as const,
        },
        subtitle: {
          ...theme.typography.body,
          color: theme.colors.text.secondary,
          fontWeight: '500' as const,
        },
        description: {
          ...theme.typography.bodySmall,
          color: theme.colors.text.secondary,
          lineHeight: 20,
        },
        badge: {
          backgroundColor: theme.colors.primary[100],
          borderRadius: theme.borderRadius.sm,
        },
        badgeText: {
          color: theme.colors.primary[700],
          fontWeight: '500' as const,
        },
        rating: {},
        ratingText: {},
      };
    
    case 'profile':
      return {
        container: {
          borderRadius: theme.borderRadius.xl,
          ...(isFeatured ? {
            borderWidth: 2,
            borderColor: theme.colors.accent.orange,
            // Optimized shadow with solid background
            shadowColor: theme.colors.shadow || '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          } : {}),
        },
        content: {
          alignItems: 'center' as const,
          padding: theme.spacing.xl,
        },
        header: {
          alignItems: 'center' as const,
          marginBottom: theme.spacing.lg,
        },
        body: {
          alignItems: 'center' as const,
          marginBottom: theme.spacing.lg,
        },
        footer: {
          flexDirection: 'row' as const,
          flexWrap: 'wrap' as const,
          justifyContent: 'center' as const,
        },
        image: {
          width: 80,
          height: 80,
          borderRadius: 40,
          marginBottom: theme.spacing.md,
        },
        title: {
          ...theme.typography.h3,
          color: theme.colors.text.primary,
          fontWeight: '600' as const,
          textAlign: 'center' as const,
        },
        subtitle: {
          ...theme.typography.body,
          color: theme.colors.text.secondary,
          textAlign: 'center' as const,
          marginBottom: theme.spacing.sm,
        },
        description: {
          ...theme.typography.bodySmall,
          color: theme.colors.text.secondary,
          textAlign: 'center' as const,
          lineHeight: 20,
        },
        badge: {
          backgroundColor: theme.colors.accent.green + '20',
          borderRadius: theme.borderRadius.full,
        },
        badgeText: {
          color: theme.colors.accent.green,
          fontWeight: '500' as const,
        },
        rating: {
          marginBottom: theme.spacing.sm,
        },
        ratingText: {
          fontWeight: '500' as const,
        },
      };
    
    case 'review':
      return {
        container: {
          marginVertical: theme.spacing.sm,
        },
        content: {
          padding: theme.spacing.lg,
        },
        header: {
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          marginBottom: theme.spacing.md,
        },
        body: {},
        footer: {
          flexDirection: 'row' as const,
          justifyContent: 'space-between' as const,
          alignItems: 'center' as const,
          marginTop: theme.spacing.md,
        },
        image: {
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: theme.spacing.md,
        },
        title: {
          ...theme.typography.body,
          color: theme.colors.text.primary,
          fontWeight: '600' as const,
          marginBottom: 0,
        },
        subtitle: {
          ...theme.typography.caption,
          color: theme.colors.text.tertiary,
          marginBottom: 0,
        },
        description: {
          ...theme.typography.body,
          color: theme.colors.text.secondary,
          lineHeight: 22,
          fontStyle: 'italic' as const,
        },
        badge: {},
        badgeText: {},
        rating: {
          marginBottom: theme.spacing.xs,
        },
        ratingText: {
          ...theme.typography.caption,
          color: theme.colors.text.secondary,
        },
      };
    
    case 'premium':
      return {
        container: {
          borderRadius: theme.borderRadius.xl,
          // Optimized shadow with solid background
          shadowColor: theme.colors.shadow || '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
          borderWidth: 1,
          borderColor: theme.colors.primary[100],
        },
        content: {
          padding: theme.spacing.xl,
        },
        header: {},
        body: {},
        footer: {},
        image: {
          borderTopLeftRadius: theme.borderRadius.xl,
          borderTopRightRadius: theme.borderRadius.xl,
        },
        title: {
          ...theme.typography.h3,
          color: theme.colors.text.primary,
          fontWeight: '700' as const,
        },
        subtitle: {
          ...theme.typography.body,
          color: theme.colors.primary[600],
          fontWeight: '500' as const,
        },
        description: {
          ...theme.typography.body,
          color: theme.colors.text.secondary,
          lineHeight: 24,
        },
        badge: {
          backgroundColor: theme.colors.primary[500],
          borderRadius: theme.borderRadius.sm,
        },
        badgeText: {
          color: theme.colors.text.inverse,
          fontWeight: '600' as const,
        },
        rating: {},
        ratingText: {
          fontWeight: '500' as const,
        },
      };
    
    case 'default':
    default:
      return {
        container: {},
        content: {},
        header: {},
        body: {},
        footer: {},
        image: {},
        title: {},
        subtitle: {},
        description: {},
        badge: {},
        badgeText: {},
        rating: {},
        ratingText: {},
      };
  }
};

// State configurations
const getStateConfig = (theme: Theme, state: CardState) => {
  switch (state) {
    case 'pressed':
      return {
        container: {
          transform: [{ scale: 0.98 }],
          // Optimized shadow with solid background
          shadowColor: theme.colors.shadow || '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        content: {},
        header: {},
        body: {},
        footer: {},
        image: {},
        title: {},
        subtitle: {},
        description: {},
        badge: {},
        badgeText: {},
        rating: {},
        ratingText: {},
      };
    
    case 'disabled':
      return {
        container: {
          opacity: 0.6,
          backgroundColor: theme.colors.background.tertiary,
        },
        content: {},
        header: {},
        body: {},
        footer: {},
        image: {
          opacity: 0.5,
        },
        title: {
          color: theme.colors.text.tertiary,
        },
        subtitle: {
          color: theme.colors.text.tertiary,
        },
        description: {
          color: theme.colors.text.tertiary,
        },
        badge: {
          backgroundColor: theme.colors.secondary[200],
        },
        badgeText: {
          color: theme.colors.text.tertiary,
        },
        rating: {},
        ratingText: {
          color: theme.colors.text.tertiary,
        },
      };
    
    case 'featured':
      return {
        container: {},
        content: {},
        header: {},
        body: {},
        footer: {},
        image: {},
        title: {},
        subtitle: {},
        description: {},
        badge: {},
        badgeText: {},
        rating: {},
        ratingText: {},
      };
    
    case 'normal':
    default:
      return {
        container: {},
        content: {},
        header: {},
        body: {},
        footer: {},
        image: {},
        title: {},
        subtitle: {},
        description: {},
        badge: {},
        badgeText: {},
        rating: {},
        ratingText: {},
      };
  }
};