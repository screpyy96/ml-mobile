/**
 * Design System - Button Styles
 * Style configurations for Button component variants
 */

import { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../themes/types';
import { ButtonVariant, ButtonSize, ButtonState, ButtonStyleConfig } from './types';

// Get button styles based on variant, size, and state
export const getButtonStyles = (
    theme: Theme,
    variant: ButtonVariant,
    size: ButtonSize,
    state: ButtonState
): ButtonStyleConfig => {
    const baseContainer: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.md,
        minHeight: theme.layout.buttonHeight,
        paddingHorizontal: theme.spacing.lg,
        // Optimized shadow - will be applied only when button has solid background
        shadowColor: theme.colors.shadow || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    };

    const baseText: TextStyle = {
        ...theme.typography.button,
        textAlign: 'center',
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
        text: {
            ...baseText,
            ...sizeConfig.text,
            ...variantConfig.text,
            ...stateConfig.text,
        },
        subtitle: getSubtitleStyles(theme, variant),
        icon: variantConfig.icon,
    };
};

// Size configurations
const getSizeConfig = (theme: Theme, size: ButtonSize) => {
    switch (size) {
        case 'small':
            return {
                container: {
                    minHeight: 36,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.xs,
                },
                text: {
                    ...theme.typography.bodySmall,
                    fontWeight: '500' as const,
                },
            };

        case 'large':
            return {
                container: {
                    minHeight: 56,
                    paddingHorizontal: theme.spacing.xl,
                    paddingVertical: theme.spacing.md,
                },
                text: {
                    ...theme.typography.bodyLarge,
                    fontWeight: '600' as const,
                },
            };

        case 'medium':
        default:
            return {
                container: {
                    minHeight: theme.layout.buttonHeight,
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.sm,
                },
                text: {
                    ...theme.typography.button,
                },
            };
    }
};

// Variant configurations
const getVariantConfig = (theme: Theme, variant: ButtonVariant, state: ButtonState): ButtonStyleConfig => {
    const isPressed = state === 'pressed';
    const isDisabled = state === 'disabled';
    const isError = state === 'error';

    switch (variant) {
        case 'primary':
            return {
                container: {
                    backgroundColor: isError
                        ? theme.colors.status.error
                        : isPressed
                            ? theme.colors.primary[600]
                            : theme.colors.primary[500],
                    borderWidth: 0,
                },
                text: {
                    color: theme.colors.text.inverse,
                },
                icon: {
                    size: 20,
                    color: theme.colors.text.inverse,
                },
            };

        case 'secondary':
            return {
                container: {
                    backgroundColor: isError
                        ? theme.colors.status.error + '20'
                        : isPressed
                            ? theme.colors.secondary[200]
                            : theme.colors.secondary[100],
                    borderWidth: 0,
                },
                text: {
                    color: isError
                        ? theme.colors.status.error
                        : theme.colors.text.primary,
                },
                icon: {
                    size: 20,
                    color: isError
                        ? theme.colors.status.error
                        : theme.colors.text.primary,
                },
            };

        case 'outline':
            return {
                container: {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: isError
                        ? theme.colors.status.error
                        : isPressed
                            ? theme.colors.primary[600]
                            : theme.colors.primary[500],
                },
                text: {
                    color: isError
                        ? theme.colors.status.error
                        : theme.colors.primary[500],
                },
                icon: {
                    size: 20,
                    color: isError
                        ? theme.colors.status.error
                        : theme.colors.primary[500],
                },
            };

        case 'ghost':
            return {
                container: {
                    backgroundColor: isPressed
                        ? theme.colors.primary[50]
                        : 'transparent',
                    borderWidth: 0,
                    ...theme.shadows.none,
                },
                text: {
                    color: isError
                        ? theme.colors.status.error
                        : theme.colors.primary[500],
                },
                icon: {
                    size: 20,
                    color: isError
                        ? theme.colors.status.error
                        : theme.colors.primary[500],
                },
            };

        default:
            return getVariantConfig(theme, 'primary', state);
    }
};

// State configurations
const getStateConfig = (theme: Theme, state: ButtonState) => {
    switch (state) {
        case 'disabled':
            return {
                container: {
                    opacity: 0.5,
                    ...theme.shadows.none,
                },
                text: {
                    opacity: 0.7,
                },
            };

        case 'loading':
            return {
                container: {
                    opacity: 0.8,
                },
                text: {
                    opacity: 0.7,
                },
            };

        case 'pressed':
            return {
                container: {
                    transform: [{ scale: 0.98 }],
                },
                text: {},
            };

        case 'error':
            return {
                container: {},
                text: {},
            };

        case 'normal':
        default:
            return {
                container: {},
                text: {},
            };
    }
};

// Subtitle styles
export const getSubtitleStyles = (theme: Theme, variant: ButtonVariant): TextStyle => {
    const baseSubtitle: TextStyle = {
        ...theme.typography.caption,
        marginTop: 2,
        textAlign: 'center',
    };

    switch (variant) {
        case 'primary':
            return {
                ...baseSubtitle,
                color: theme.colors.text.inverse,
                opacity: 0.9,
            };

        case 'secondary':
        case 'outline':
        case 'ghost':
            return {
                ...baseSubtitle,
                color: theme.colors.text.secondary,
            };

        default:
            return baseSubtitle;
    }
};