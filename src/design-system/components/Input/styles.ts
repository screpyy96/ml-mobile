/**
 * Design System - Input Styles
 * Style configurations for Input component variants
 */

import { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../themes/types';
import { InputVariant, InputSize, InputState, InputStyleConfig } from './types';

// Get input styles based on variant, size, and state
export const getInputStyles = (
  theme: Theme,
  variant: InputVariant,
  size: InputSize,
  state: InputState
): InputStyleConfig => {
  const baseContainer: ViewStyle = {
    marginBottom: theme.spacing.md,
  };

  const baseInputContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    backgroundColor: theme.colors.background.primary,
    minHeight: theme.layout.inputHeight,
    paddingHorizontal: theme.spacing.md,
  };

  const baseInput: TextStyle = {
    ...theme.typography.body,
    flex: 1,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  };

  const baseLabel: TextStyle = {
    ...theme.typography.bodySmall,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  };

  const baseHelperText: TextStyle = {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
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
    inputContainer: {
      ...baseInputContainer,
      ...sizeConfig.inputContainer,
      ...variantConfig.inputContainer,
      ...stateConfig.inputContainer,
    },
    input: {
      ...baseInput,
      ...sizeConfig.input,
      ...variantConfig.input,
      ...stateConfig.input,
    },
    label: {
      ...baseLabel,
      ...sizeConfig.label,
      ...variantConfig.label,
      ...stateConfig.label,
    },
    helperText: {
      ...baseHelperText,
      ...sizeConfig.helperText,
      ...variantConfig.helperText,
      ...stateConfig.helperText,
    },
    icon: {
      ...variantConfig.icon,
      ...stateConfig.icon,
    },
  };
};

// Size configurations
const getSizeConfig = (theme: Theme, size: InputSize) => {
  switch (size) {
    case 'small':
      return {
        container: {},
        inputContainer: {
          minHeight: 40,
          paddingHorizontal: theme.spacing.sm,
        },
        input: {
          ...theme.typography.bodySmall,
          paddingVertical: theme.spacing.xs,
        },
        label: {
          ...theme.typography.caption,
        },
        helperText: {
          fontSize: 11,
        },
      };

    case 'large':
      return {
        container: {},
        inputContainer: {
          minHeight: 56,
          paddingHorizontal: theme.spacing.lg,
        },
        input: {
          ...theme.typography.bodyLarge,
          paddingVertical: theme.spacing.md,
        },
        label: {
          ...theme.typography.body,
          fontWeight: '500' as const,
        },
        helperText: {
          ...theme.typography.bodySmall,
        },
      };

    case 'medium':
    default:
      return {
        container: {},
        inputContainer: {
          minHeight: theme.layout.inputHeight,
          paddingHorizontal: theme.spacing.md,
        },
        input: {
          paddingVertical: theme.spacing.sm,
        },
        label: {},
        helperText: {},
      };
  }
};

// Variant configurations
const getVariantConfig = (theme: Theme, variant: InputVariant, state: InputState) => {
  const isFocused = state === 'focused';
  const isError = state === 'error';
  const isSuccess = state === 'success';

  switch (variant) {
    case 'search':
      return {
        container: {},
        inputContainer: {
          backgroundColor: theme.colors.background.secondary,
          borderColor: isFocused
            ? theme.colors.primary[500]
            : 'transparent',
          borderRadius: theme.borderRadius.xl,
          // Optimized shadow with solid background
          shadowColor: theme.colors.shadow || '#000',
          shadowOffset: { width: 0, height: isFocused ? 2 : 1 },
          shadowOpacity: isFocused ? 0.12 : 0.1,
          shadowRadius: isFocused ? 6 : 2,
          elevation: isFocused ? 6 : 2,
        },
        input: {
          paddingLeft: theme.spacing.xs,
        },
        label: {
          color: theme.colors.text.secondary,
        },
        helperText: {
          color: theme.colors.text.secondary,
        },
        icon: {
          size: 20,
          color: isFocused ? theme.colors.primary[500] : theme.colors.text.secondary,
        },
      };

    case 'textarea':
      return {
        container: {},
        inputContainer: {
          minHeight: 120,
          alignItems: 'flex-start' as const,
          paddingTop: theme.spacing.md,
        },
        input: {
          textAlignVertical: 'top' as const,
          minHeight: 80,
        },
        label: {
          color: theme.colors.text.primary,
        },
        helperText: {
          color: theme.colors.text.secondary,
        },
        icon: {
          size: 20,
          color: theme.colors.text.secondary,
        },
      };

    case 'premium':
      return {
        container: {},
        inputContainer: {
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          // Optimized shadow with solid background
          shadowColor: theme.colors.shadow || '#000',
          shadowOffset: { width: 0, height: isFocused ? 4 : 2 },
          shadowOpacity: isFocused ? 0.15 : 0.1,
          shadowRadius: isFocused ? 8 : 4,
          elevation: isFocused ? 8 : 4,
        },
        input: {
          fontSize: 16,
          fontWeight: '400' as const,
        },
        label: {
          color: theme.colors.text.primary,
          fontWeight: '600' as const,
        },
        helperText: {
          color: theme.colors.text.secondary,
        },
        icon: {
          size: 22,
          color: isFocused ? theme.colors.primary[500] : theme.colors.text.secondary,
        },
      };

    case 'default':
    default:
      return {
        container: {},
        inputContainer: {
          backgroundColor: theme.colors.background.primary,
        },
        input: {},
        label: {
          color: theme.colors.text.primary,
        },
        helperText: {
          color: theme.colors.text.secondary,
        },
        icon: {
          size: 20,
          color: theme.colors.text.secondary,
        },
      };
  }
};

// State configurations
const getStateConfig = (theme: Theme, state: InputState) => {
  switch (state) {
    case 'focused':
      return {
        container: {},
        inputContainer: {
          borderColor: theme.colors.primary[500],
          borderWidth: 2,
          backgroundColor: theme.colors.background.primary,
          // Optimized shadow with solid background
          shadowColor: theme.colors.shadow || '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 6,
        },
        input: {},
        label: {
          color: theme.colors.primary[500],
          fontWeight: '500' as const,
        },
        helperText: {
          color: theme.colors.primary[500],
        },
        icon: {
          color: theme.colors.primary[500],
        },
      };

    case 'error':
      return {
        container: {},
        inputContainer: {
          borderColor: theme.colors.status.error,
          borderWidth: 2,
          backgroundColor: theme.colors.status.error + '08',
        },
        input: {},
        label: {
          color: theme.colors.status.error,
          fontWeight: '500' as const,
        },
        helperText: {
          color: theme.colors.status.error,
          fontWeight: '500' as const,
        },
        icon: {
          color: theme.colors.status.error,
        },
      };

    case 'success':
      return {
        container: {},
        inputContainer: {
          borderColor: theme.colors.status.success,
          borderWidth: 2,
          backgroundColor: theme.colors.status.success + '08',
        },
        input: {},
        label: {
          color: theme.colors.status.success,
          fontWeight: '500' as const,
        },
        helperText: {
          color: theme.colors.status.success,
          fontWeight: '500' as const,
        },
        icon: {
          color: theme.colors.status.success,
        },
      };

    case 'disabled':
      return {
        container: {
          opacity: 0.6,
        },
        inputContainer: {
          backgroundColor: theme.colors.background.tertiary,
          borderColor: theme.colors.secondary[200],
        },
        input: {
          color: theme.colors.text.tertiary,
        },
        label: {
          color: theme.colors.text.tertiary,
        },
        helperText: {
          color: theme.colors.text.tertiary,
        },
        icon: {
          color: theme.colors.text.tertiary,
        },
      };

    case 'normal':
    default:
      return {
        container: {},
        inputContainer: {
          borderColor: theme.colors.secondary[300],
        },
        input: {},
        label: {},
        helperText: {},
        icon: {},
      };
  }
};

// Floating label styles
export const getFloatingLabelStyles = (
  theme: Theme,
  isFloating: boolean,
  isFocused: boolean,
  hasError: boolean,
  hasSuccess: boolean
): TextStyle => {
  const baseStyle: TextStyle = {
    position: 'absolute',
    left: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.xs,
    zIndex: 1,
    borderRadius: theme.borderRadius.xs,
  };

  if (isFloating) {
    return {
      ...baseStyle,
      top: -10,
      fontSize: 12,
      fontWeight: '500' as const,
      color: hasError
        ? theme.colors.status.error
        : hasSuccess
          ? theme.colors.status.success
          : isFocused
            ? theme.colors.primary[500]
            : theme.colors.text.secondary,
    };
  }

  return {
    ...baseStyle,
    top: theme.spacing.md,
    fontSize: 16,
    fontWeight: '400' as const,
    color: theme.colors.text.tertiary,
  };
};