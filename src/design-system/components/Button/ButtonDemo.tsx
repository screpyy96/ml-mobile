/**
 * Design System - Button Demo
 * Showcase component for all button variants and states
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme, useColors, useTypography, useSpacing } from '../../themes/ThemeProvider';
import { Button } from './Button';
import {
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  CTAButton,
  CompactButton,
  IconButton,
  SuccessButton,
  ErrorButton,
  FavoriteButton,
  CallButton,
  MessageButton,
} from './variants';

export const ButtonDemo: React.FC = () => {
  const { theme } = useTheme();
  const colors = useColors();
  const typography = useTypography();
  const spacing = useSpacing();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    buttonColumn: {
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    description: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
    },
  });

  const handlePress = () => {
    console.log('Button pressed!');
  };

  const handleLoadingPress = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Basic Variants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button Variants</Text>
        <Text style={styles.description}>
          Different visual styles for various use cases
        </Text>
        
        <View style={styles.buttonColumn}>
          <PrimaryButton title="Primary Button" onPress={handlePress} />
          <SecondaryButton title="Secondary Button" onPress={handlePress} />
          <OutlineButton title="Outline Button" onPress={handlePress} />
          <GhostButton title="Ghost Button" onPress={handlePress} />
        </View>
      </View>

      {/* Sizes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button Sizes</Text>
        <Text style={styles.description}>
          Different sizes for various contexts
        </Text>
        
        <View style={styles.buttonColumn}>
          <Button title="Large Button" size="large" onPress={handlePress} />
          <Button title="Medium Button" size="medium" onPress={handlePress} />
          <CompactButton title="Small Button" onPress={handlePress} />
        </View>
      </View>

      {/* States */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button States</Text>
        <Text style={styles.description}>
          Different states for user feedback
        </Text>
        
        <View style={styles.buttonColumn}>
          <Button title="Normal State" onPress={handlePress} />
          <Button 
            title={isLoading ? "Loading..." : "Loading Button"} 
            loading={isLoading}
            onPress={handleLoadingPress} 
          />
          <Button title="Disabled Button" disabled onPress={handlePress} />
          <ErrorButton title="Error Button" onPress={handlePress} />
          <SuccessButton title="Success Button" onPress={handlePress} />
        </View>
      </View>

      {/* With Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons with Icons</Text>
        <Text style={styles.description}>
          Buttons enhanced with iconography
        </Text>
        
        <View style={styles.buttonColumn}>
          <Button title="Left Icon" leftIcon="star" onPress={handlePress} />
          <Button title="Right Icon" rightIcon="arrow-forward" onPress={handlePress} />
          <Button 
            title="Both Icons" 
            leftIcon="favorite" 
            rightIcon="share" 
            onPress={handlePress} 
          />
        </View>
      </View>

      {/* Icon Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Icon Buttons</Text>
        <Text style={styles.description}>
          Compact buttons with icons only
        </Text>
        
        <View style={styles.buttonRow}>
          <IconButton 
            icon="favorite" 
            variant="primary" 
            accessibilityLabel="Favorite"
            onPress={handlePress} 
          />
          <IconButton 
            icon="share" 
            variant="secondary" 
            accessibilityLabel="Share"
            onPress={handlePress} 
          />
          <IconButton 
            icon="edit" 
            variant="outline" 
            accessibilityLabel="Edit"
            onPress={handlePress} 
          />
          <IconButton 
            icon="delete" 
            variant="ghost" 
            error
            accessibilityLabel="Delete"
            onPress={handlePress} 
          />
        </View>
      </View>

      {/* Specialized Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specialized Buttons</Text>
        <Text style={styles.description}>
          Pre-configured buttons for common actions
        </Text>
        
        <View style={styles.buttonColumn}>
          <CallButton title="Call Now" onPress={handlePress} />
          <MessageButton title="Send Message" onPress={handlePress} />
          <FavoriteButton 
            title={isFavorite ? "Remove Favorite" : "Add Favorite"}
            isFavorite={isFavorite}
            onPress={() => setIsFavorite(!isFavorite)} 
          />
        </View>
      </View>

      {/* Full Width */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Width Buttons</Text>
        <Text style={styles.description}>
          Buttons that span the full container width
        </Text>
        
        <View style={styles.buttonColumn}>
          <CTAButton title="Call to Action" onPress={handlePress} />
          <Button 
            title="Full Width Secondary" 
            variant="secondary" 
            fullWidth 
            onPress={handlePress} 
          />
          <Button 
            title="Full Width Outline" 
            variant="outline" 
            fullWidth 
            onPress={handlePress} 
          />
        </View>
      </View>

      {/* With Subtitles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons with Subtitles</Text>
        <Text style={styles.description}>
          Buttons with additional descriptive text
        </Text>
        
        <View style={styles.buttonColumn}>
          <Button 
            title="Premium Plan" 
            subtitle="$9.99/month"
            size="large"
            onPress={handlePress} 
          />
          <Button 
            title="Contact Worker" 
            subtitle="Response in 2 hours"
            variant="outline"
            leftIcon="phone"
            onPress={handlePress} 
          />
        </View>
      </View>
    </ScrollView>
  );
};