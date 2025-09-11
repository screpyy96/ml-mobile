# Button Component

A premium button component with multiple variants, animations, haptic feedback, and accessibility support.

## Features

- ✅ **Multiple Variants**: Primary, Secondary, Outline, Ghost
- ✅ **Three Sizes**: Small, Medium, Large
- ✅ **Interactive States**: Normal, Pressed, Disabled, Loading, Error
- ✅ **Animations**: Smooth press animations with scale effects
- ✅ **Haptic Feedback**: Vibration feedback on press (can be disabled)
- ✅ **Icons**: Support for left and right icons
- ✅ **Subtitles**: Optional subtitle text
- ✅ **Accessibility**: Full screen reader and keyboard navigation support
- ✅ **TypeScript**: Complete type safety

## Basic Usage

```tsx
import { Button } from './src/design-system';

// Basic button
<Button title="Click Me" onPress={() => console.log('Pressed!')} />

// Primary CTA button
<Button 
  title="Get Started" 
  variant="primary" 
  size="large" 
  fullWidth 
  onPress={handleGetStarted} 
/>

// Button with icon
<Button 
  title="Call Now" 
  leftIcon="phone" 
  variant="primary"
  onPress={handleCall} 
/>

// Loading button
<Button 
  title="Saving..." 
  loading={isLoading}
  onPress={handleSave} 
/>
```

## Variants

### Primary
Main call-to-action buttons with solid background.
```tsx
<Button title="Primary" variant="primary" />
```

### Secondary  
Supporting actions with subtle background.
```tsx
<Button title="Secondary" variant="secondary" />
```

### Outline
Outlined buttons for less prominent actions.
```tsx
<Button title="Outline" variant="outline" />
```

### Ghost
Minimal buttons with no background.
```tsx
<Button title="Ghost" variant="ghost" />
```

## Sizes

```tsx
<Button title="Small" size="small" />
<Button title="Medium" size="medium" />
<Button title="Large" size="large" />
```

## States

```tsx
// Normal state
<Button title="Normal" />

// Loading state
<Button title="Loading..." loading />

// Disabled state
<Button title="Disabled" disabled />

// Error state
<Button title="Error" error />
```

## With Icons

```tsx
// Left icon
<Button title="Save" leftIcon="save" />

// Right icon
<Button title="Next" rightIcon="arrow-forward" />

// Both icons
<Button title="Share" leftIcon="share" rightIcon="open-in-new" />

// Icon only
<IconButton icon="favorite" accessibilityLabel="Add to favorites" />
```

## With Subtitles

```tsx
<Button 
  title="Premium Plan" 
  subtitle="$9.99/month"
  size="large"
/>
```

## Specialized Variants

Pre-configured buttons for common use cases:

```tsx
import { 
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  CTAButton,
  CompactButton,
  IconButton,
  CallButton,
  MessageButton,
  FavoriteButton,
  SuccessButton,
  ErrorButton
} from './src/design-system';

// Call to action
<CTAButton title="Sign Up Now" onPress={handleSignUp} />

// Communication
<CallButton title="Call Worker" onPress={handleCall} />
<MessageButton title="Send Message" onPress={handleMessage} />

// Actions
<FavoriteButton isFavorite={isFav} onPress={toggleFavorite} />
<SuccessButton title="Completed" onPress={handleSuccess} />
<ErrorButton title="Delete" onPress={handleDelete} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Button text (required) |
| `subtitle` | `string` | - | Optional subtitle text |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `fullWidth` | `boolean` | `false` | Whether button spans full width |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `loading` | `boolean` | `false` | Whether button shows loading state |
| `error` | `boolean` | `false` | Whether button shows error state |
| `leftIcon` | `string` | - | Material icon name for left icon |
| `rightIcon` | `string` | - | Material icon name for right icon |
| `hapticFeedback` | `boolean` | `true` | Whether to provide haptic feedback |
| `onPress` | `() => void` | - | Press handler |
| `onPressIn` | `() => void` | - | Press in handler |
| `onPressOut` | `() => void` | - | Press out handler |
| `onLongPress` | `() => void` | - | Long press handler |
| `style` | `ViewStyle` | - | Custom container styles |
| `textStyle` | `TextStyle` | - | Custom text styles |
| `accessibilityLabel` | `string` | - | Accessibility label |
| `accessibilityHint` | `string` | - | Accessibility hint |
| `testID` | `string` | - | Test identifier |

## Accessibility

The Button component includes comprehensive accessibility support:

- **Screen Reader**: Proper role, label, and state announcements
- **Keyboard Navigation**: Focus indicators and keyboard activation
- **Touch Targets**: Minimum 44px touch target size
- **State Communication**: Loading, disabled, and error states are announced
- **Haptic Feedback**: Can be disabled for users who prefer reduced motion

## Animations

- **Press Animation**: Subtle scale animation on press (0.98x scale)
- **Loading State**: Smooth transition to loading indicator
- **State Changes**: Animated transitions between states
- **Performance**: Uses native driver for 60fps animations

## Theming

The Button component automatically adapts to light/dark themes:

```tsx
// Automatically uses current theme
<Button title="Themed Button" />

// Colors adapt based on theme mode
const { isDark } = useTheme();
```

## Best Practices

### Do ✅
- Use Primary buttons for main actions
- Use Secondary/Outline for supporting actions  
- Provide clear, action-oriented labels
- Use loading states for async operations
- Include icons for better recognition
- Test with screen readers

### Don't ❌
- Use too many Primary buttons on one screen
- Make buttons too small (minimum 44px height)
- Use vague labels like "Click here"
- Forget to handle loading/error states
- Override theme colors unnecessarily

## Examples

### Login Form
```tsx
<View>
  <PrimaryButton 
    title="Sign In" 
    fullWidth
    loading={isLoading}
    onPress={handleSignIn} 
  />
  <GhostButton 
    title="Forgot Password?" 
    onPress={handleForgotPassword} 
  />
</View>
```

### Action Bar
```tsx
<View style={{ flexDirection: 'row', gap: 12 }}>
  <CallButton title="Call" onPress={handleCall} />
  <MessageButton title="Message" onPress={handleMessage} />
  <FavoriteButton isFavorite={isFav} onPress={toggleFav} />
</View>
```

### Form Actions
```tsx
<View style={{ flexDirection: 'row', gap: 12 }}>
  <OutlineButton title="Cancel" onPress={handleCancel} />
  <PrimaryButton 
    title="Save Changes" 
    loading={isSaving}
    onPress={handleSave} 
  />
</View>
```