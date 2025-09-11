/**
 * Design System - Demo Component
 * Example component showing how to use the design system
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme, useColors, useTypography, useSpacing, useShadows } from '../themes/ThemeProvider';

export const DesignSystemDemo: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const colors = useColors();
  const typography = useTypography();
  const spacing = useSpacing();
  const shadows = useShadows();

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
      ...typography.h2,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    colorBox: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.md,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
      ...shadows.sm,
    },
    colorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.md,
    },
    textExample: {
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    card: {
      backgroundColor: colors.background.secondary,
      padding: spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginBottom: spacing.md,
      ...shadows.md,
    },
    cardTitle: {
      ...typography.h3,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    cardText: {
      ...typography.body,
      color: colors.text.secondary,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Theme Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Theme</Text>
        <Text style={styles.textExample}>
          Mode: {theme.mode} {isDark ? '(Dark)' : '(Light)'}
        </Text>
      </View>

      {/* Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors</Text>
        
        <Text style={[styles.textExample, typography.h4]}>Primary</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.primary[300] }]} />
          <View style={[styles.colorBox, { backgroundColor: colors.primary[500] }]} />
          <View style={[styles.colorBox, { backgroundColor: colors.primary[700] }]} />
        </View>

        <Text style={[styles.textExample, typography.h4]}>Accent</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.accent.orange }]} />
          <View style={[styles.colorBox, { backgroundColor: colors.accent.green }]} />
          <View style={[styles.colorBox, { backgroundColor: colors.accent.red }]} />
        </View>
      </View>

      {/* Typography */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography</Text>
        <Text style={[styles.textExample, typography.display]}>Display Text</Text>
        <Text style={[styles.textExample, typography.h1]}>Heading 1</Text>
        <Text style={[styles.textExample, typography.h2]}>Heading 2</Text>
        <Text style={[styles.textExample, typography.h3]}>Heading 3</Text>
        <Text style={[styles.textExample, typography.body]}>Body text example</Text>
        <Text style={[styles.textExample, typography.caption]}>Caption text</Text>
      </View>

      {/* Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cards</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Example Card</Text>
          <Text style={styles.cardText}>
            This is an example card using the design system tokens for spacing, 
            colors, typography, and shadows.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.primary[50] }]}>
          <Text style={[styles.cardTitle, { color: colors.primary[700] }]}>
            Themed Card
          </Text>
          <Text style={[styles.cardText, { color: colors.primary[600] }]}>
            This card uses primary colors from the theme.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};