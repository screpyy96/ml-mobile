/**
 * Design System - Input Demo
 * Showcase component for all input variants and states
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme, useColors, useTypography, useSpacing } from '../../themes/ThemeProvider';
import { Input } from './Input';
import {
  SearchInput,
  TextArea,
  EmailInput,
  PasswordInput,
  PhoneInput,
  NumberInput,
  CurrencyInput,
  LocationInput,
  FloatingLabelInput,
  FloatingSearchInput,
  FloatingEmailInput,
  FloatingPasswordInput,
  PremiumInput,
  PremiumSearchInput,
  PremiumFloatingInput,
  PremiumEmailInput,
  PremiumPasswordInput,
} from './variants';

export const InputDemo: React.FC = () => {
  const colors = useColors();
  const typography = useTypography();
  const spacing = useSpacing();
  
  const [searchValue, setSearchValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [messageValue, setMessageValue] = useState('');
  const [floatingValue, setFloatingValue] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    description: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    halfWidth: {
      flex: 1,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Basic Inputs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Inputs</Text>
        <Text style={styles.description}>
          Standard input fields with labels and helper text
        </Text>
        
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          helperText="This will be displayed on your profile"
        />
        
        <Input
          label="Bio"
          placeholder="Tell us about yourself"
          variant="textarea"
          helperText="Maximum 500 characters"
        />
      </View>

      {/* Input States */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Input States</Text>
        <Text style={styles.description}>
          Different states for user feedback
        </Text>
        
        <Input
          label="Normal State"
          placeholder="Type something..."
        />
        
        <Input
          label="Error State"
          placeholder="This field has an error"
          error
          errorMessage="This field is required"
        />
        
        <Input
          label="Success State"
          placeholder="This field is valid"
          success
          successMessage="Looks good!"
          value="Valid input"
        />
        
        <Input
          label="Disabled State"
          placeholder="This field is disabled"
          disabled
          value="Cannot edit this"
        />
      </View>

      {/* Input Sizes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Input Sizes</Text>
        <Text style={styles.description}>
          Different sizes for various contexts
        </Text>
        
        <Input
          label="Large Input"
          placeholder="Large size input"
          size="large"
        />
        
        <Input
          label="Medium Input"
          placeholder="Medium size input (default)"
          size="medium"
        />
        
        <Input
          label="Small Input"
          placeholder="Small size input"
          size="small"
        />
      </View>

      {/* Search Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Input</Text>
        <Text style={styles.description}>
          Search input with clear functionality
        </Text>
        
        <SearchInput
          placeholder="Search for services..."
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>

      {/* Specialized Inputs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specialized Inputs</Text>
        <Text style={styles.description}>
          Pre-configured inputs for common use cases
        </Text>
        
        <EmailInput
          label="Email Address"
          placeholder="Enter your email"
          value={emailValue}
          onChangeText={setEmailValue}
        />
        
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={passwordValue}
          onChangeText={setPasswordValue}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
        
        <PhoneInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phoneValue}
          onChangeText={setPhoneValue}
        />
        
        <NumberInput
          label="Age"
          placeholder="Enter your age"
        />
        
        <CurrencyInput
          label="Price"
          placeholder="0.00"
        />
        
        <LocationInput
          label="Location"
          placeholder="Enter your location"
        />
      </View>

      {/* Floating Labels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Floating Labels</Text>
        <Text style={styles.description}>
          Inputs with animated floating labels
        </Text>
        
        <FloatingLabelInput
          label="Full Name"
          placeholder="Enter your full name"
          value={floatingValue}
          onChangeText={setFloatingValue}
        />
        
        <FloatingSearchInput
          label="Search"
          placeholder="Search for anything..."
        />
        
        <FloatingEmailInput
          label="Email Address"
          placeholder="Enter your email"
        />
        
        <FloatingPasswordInput
          label="Password"
          placeholder="Enter your password"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </View>

      {/* Input with Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inputs with Icons</Text>
        <Text style={styles.description}>
          Inputs enhanced with iconography
        </Text>
        
        <Input
          label="Username"
          placeholder="Enter username"
          leftIcon="person"
        />
        
        <Input
          label="Website"
          placeholder="Enter website URL"
          leftIcon="link"
          rightIcon="open-in-new"
        />
        
        <Input
          label="Message"
          placeholder="Type your message..."
          variant="textarea"
          leftIcon="message"
        />
      </View>

      {/* Form Layout */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Layout</Text>
        <Text style={styles.description}>
          Inputs arranged in form layouts
        </Text>
        
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="First Name"
              placeholder="First name"
              size="small"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Last Name"
              placeholder="Last name"
              size="small"
            />
          </View>
        </View>
        
        <Input
          label="Company"
          placeholder="Company name"
          leftIcon="business"
        />
        
        <TextArea
          label="Description"
          placeholder="Describe your business..."
          value={messageValue}
          onChangeText={setMessageValue}
          helperText={`${messageValue.length}/500 characters`}
        />
      </View>

      {/* Premium Inputs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium Inputs</Text>
        <Text style={styles.description}>
          Enhanced inputs with premium styling and animations
        </Text>
        
        <PremiumInput
          label="Premium Input"
          placeholder="Enhanced styling with premium feel"
          helperText="This input has enhanced shadows and animations"
        />
        
        <PremiumSearchInput
          placeholder="Premium search with enhanced styling..."
        />
        
        <PremiumFloatingInput
          label="Premium Floating Label"
          placeholder="Type to see the floating animation"
        />
        
        <PremiumEmailInput
          label="Premium Email"
          placeholder="Enter your email address"
        />
        
        <PremiumPasswordInput
          label="Premium Password"
          placeholder="Enter your password"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </View>

      {/* Validation Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Validation Examples</Text>
        <Text style={styles.description}>
          Real-time validation feedback
        </Text>
        
        <Input
          label="Required Field"
          placeholder="This field is required"
          error={!emailValue}
          errorMessage={!emailValue ? "This field is required" : undefined}
          success={!!emailValue}
          successMessage={!!emailValue ? "Field completed" : undefined}
          value={emailValue}
          onChangeText={setEmailValue}
        />
        
        <Input
          label="Password Strength"
          placeholder="Enter a strong password"
          secureTextEntry
          error={passwordValue.length > 0 && passwordValue.length < 8}
          success={passwordValue.length >= 8}
          errorMessage={passwordValue.length > 0 && passwordValue.length < 8 ? "Password must be at least 8 characters" : undefined}
          successMessage={passwordValue.length >= 8 ? "Strong password!" : undefined}
          value={passwordValue}
          onChangeText={setPasswordValue}
          helperText="Use at least 8 characters with letters and numbers"
        />
      </View>
    </ScrollView>
  );
};