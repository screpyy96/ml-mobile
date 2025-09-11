# Input Component

A modern input component with floating labels, smooth focus transitions, validation states, and multiple variants for different use cases.

## Features

- ✅ **Multiple Variants**: Default, Search, Textarea, Premium
- ✅ **Three Sizes**: Small, Medium, Large
- ✅ **Interactive States**: Normal, Focused, Error, Success, Disabled
- ✅ **Floating Labels**: Smooth animated floating labels with premium styling
- ✅ **Icons**: Support for left and right icons with press handlers
- ✅ **Validation**: Built-in error and success states with messages
- ✅ **Search Functionality**: Clear button and search-specific styling
- ✅ **Premium Styling**: Enhanced shadows, animations, and haptic feedback
- ✅ **Accessibility**: Full screen reader and keyboard navigation support
- ✅ **TypeScript**: Complete type safety

## Basic Usage

```tsx
import { Input } from './src/design-system';

// Basic input
<Input 
  label="Full Name" 
  placeholder="Enter your full name"
  value={name}
  onChangeText={setName}
/>

// Input with validation
<Input 
  label="Email" 
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={!isValidEmail(email)}
  errorMessage="Please enter a valid email"
/>

// Search input
<Input 
  variant="search"
  placeholder="Search..."
  value={searchQuery}
  onChangeText={setSearchQuery}
  showClearButton
/>
```

## Variants

### Default
Standard input field with label and helper text.
```tsx
<Input 
  label="Username" 
  placeholder="Enter username"
  helperText="This will be your public username"
/>
```

### Search
Search input with built-in search icon and clear functionality.
```tsx
<Input 
  variant="search"
  placeholder="Search for services..."
  showClearButton
  onClear={() => setQuery('')}
/>
```

### Textarea
Multi-line text input for longer content.
```tsx
<Input 
  variant="textarea"
  label="Description"
  placeholder="Tell us about your business..."
  helperText="Maximum 500 characters"
/>
```

### Premium
Enhanced input with premium styling, enhanced shadows, and smooth animations.
```tsx
<Input 
  variant="premium"
  label="Premium Input"
  placeholder="Enhanced styling with premium feel"
  floatingLabel
/>
```

## Sizes

```tsx
<Input label="Small" size="small" />
<Input label="Medium" size="medium" />
<Input label="Large" size="large" />
```

## States

```tsx
// Normal state
<Input label="Normal" placeholder="Type something..." />

// Error state
<Input 
  label="Error" 
  error 
  errorMessage="This field is required"
/>

// Success state
<Input 
  label="Success" 
  success 
  successMessage="Looks good!"
/>

// Disabled state
<Input label="Disabled" disabled value="Cannot edit" />
```

## Floating Labels

```tsx
<Input 
  label="Email Address"
  placeholder="Enter your email"
  floatingLabel
  value={email}
  onChangeText={setEmail}
/>
```

## With Icons

```tsx
// Left icon
<Input 
  label="Email" 
  leftIcon="email"
  placeholder="Enter your email"
/>

// Right icon with press handler
<Input 
  label="Password" 
  rightIcon="visibility"
  onRightIconPress={() => setShowPassword(!showPassword)}
/>

// Both icons
<Input 
  label="Website" 
  leftIcon="link"
  rightIcon="open-in-new"
  onRightIconPress={() => openWebsite()}
/>
```

## Specialized Variants

Pre-configured inputs for common use cases:

```tsx
import { 
  SearchInput,
  EmailInput,
  PasswordInput,
  PhoneInput,
  NumberInput,
  CurrencyInput,
  LocationInput,
  TextArea,
  FloatingLabelInput,
  PremiumInput,
  PremiumSearchInput,
  PremiumFloatingInput,
  PremiumEmailInput,
  PremiumPasswordInput
} from './src/design-system';

// Email input
<EmailInput 
  label="Email Address"
  value={email}
  onChangeText={setEmail}
/>

// Password input with show/hide
<PasswordInput 
  label="Password"
  value={password}
  onChangeText={setPassword}
  showPassword={showPassword}
  onTogglePassword={() => setShowPassword(!showPassword)}
/>

// Search input
<SearchInput 
  placeholder="Search for services..."
  value={query}
  onChangeText={setQuery}
/>

// Phone input
<PhoneInput 
  label="Phone Number"
  value={phone}
  onChangeText={setPhone}
/>

// Textarea
<TextArea 
  label="Message"
  placeholder="Write your message..."
  value={message}
  onChangeText={setMessage}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label text |
| `placeholder` | `string` | - | Placeholder text |
| `helperText` | `string` | - | Helper text below input |
| `errorMessage` | `string` | - | Error message (shown when error=true) |
| `successMessage` | `string` | - | Success message (shown when success=true) |
| `variant` | `'default' \| 'search' \| 'textarea'` | `'default'` | Input variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Input size |
| `error` | `boolean` | `false` | Whether input has error state |
| `success` | `boolean` | `false` | Whether input has success state |
| `disabled` | `boolean` | `false` | Whether input is disabled |
| `leftIcon` | `string` | - | Material icon name for left icon |
| `rightIcon` | `string` | - | Material icon name for right icon |
| `onRightIconPress` | `() => void` | - | Right icon press handler |
| `floatingLabel` | `boolean` | `false` | Whether to use floating label animation |
| `showClearButton` | `boolean` | `false` | Whether to show clear button (search variant) |
| `onClear` | `() => void` | - | Clear button press handler |
| `containerStyle` | `ViewStyle` | - | Custom container styles |
| `inputStyle` | `TextStyle` | - | Custom input styles |
| `labelStyle` | `TextStyle` | - | Custom label styles |
| `value` | `string` | - | Input value |
| `onChangeText` | `(text: string) => void` | - | Text change handler |
| `onFocus` | `(e: any) => void` | - | Focus handler |
| `onBlur` | `(e: any) => void` | - | Blur handler |

All standard `TextInput` props are also supported.

## Accessibility

The Input component includes comprehensive accessibility support:

- **Screen Reader**: Proper labels, hints, and state announcements
- **Keyboard Navigation**: Focus indicators and keyboard activation
- **Touch Targets**: Minimum touch target sizes for icons
- **State Communication**: Error, success, and disabled states are announced
- **Helper Text**: Associated with input for screen readers

## Animations

- **Focus Animation**: Smooth border color and shadow transitions
- **Floating Label**: Smooth label animation on focus/blur
- **State Changes**: Animated transitions between states
- **Clear Button**: Smooth appearance/disappearance
- **Performance**: Uses native driver where possible

## Validation

```tsx
// Real-time validation
const [email, setEmail] = useState('');
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

<Input 
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={email.length > 0 && !isValidEmail(email)}
  success={email.length > 0 && isValidEmail(email)}
  errorMessage="Please enter a valid email address"
  successMessage="Email looks good!"
/>

// Form validation
const [errors, setErrors] = useState({});

<Input 
  label="Required Field"
  value={value}
  onChangeText={setValue}
  error={!!errors.field}
  errorMessage={errors.field}
/>
```

## Theming

The Input component automatically adapts to light/dark themes:

```tsx
// Automatically uses current theme
<Input label="Themed Input" />

// Colors adapt based on theme mode
const { isDark } = useTheme();
```

## Best Practices

### Do ✅
- Use clear, descriptive labels
- Provide helpful placeholder text
- Show validation feedback immediately
- Use appropriate input types (email, phone, etc.)
- Include helper text for complex fields
- Use floating labels for clean designs

### Don't ❌
- Use placeholder text as labels
- Make error messages too technical
- Forget to handle loading states
- Use tiny touch targets for icons
- Override theme colors unnecessarily
- Skip accessibility labels

## Examples

### Login Form
```tsx
<View>
  <EmailInput 
    label="Email Address"
    value={email}
    onChangeText={setEmail}
    error={!!errors.email}
    errorMessage={errors.email}
  />
  
  <PasswordInput 
    label="Password"
    value={password}
    onChangeText={setPassword}
    showPassword={showPassword}
    onTogglePassword={() => setShowPassword(!showPassword)}
    error={!!errors.password}
    errorMessage={errors.password}
  />
</View>
```

### Search Interface
```tsx
<SearchInput 
  placeholder="Search for services, workers, or locations..."
  value={searchQuery}
  onChangeText={setSearchQuery}
  onClear={() => setSearchQuery('')}
/>
```

### Profile Form
```tsx
<View>
  <FloatingLabelInput 
    label="Full Name"
    value={name}
    onChangeText={setName}
    leftIcon="person"
  />
  
  <FloatingEmailInput 
    label="Email Address"
    value={email}
    onChangeText={setEmail}
  />
  
  <TextArea 
    label="Bio"
    placeholder="Tell us about yourself..."
    value={bio}
    onChangeText={setBio}
    helperText={`${bio.length}/500 characters`}
  />
</View>
```

### Contact Form
```tsx
<View>
  <Input 
    label="Subject"
    placeholder="What's this about?"
    value={subject}
    onChangeText={setSubject}
    leftIcon="subject"
  />
  
  <TextArea 
    label="Message"
    placeholder="Write your message here..."
    value={message}
    onChangeText={setMessage}
    helperText="We'll get back to you within 24 hours"
  />
</View>
```