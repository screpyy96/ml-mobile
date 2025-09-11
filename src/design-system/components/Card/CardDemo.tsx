/**
 * Design System - Card Demo
 * Showcase component for all card variants and states
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme, useColors, useTypography, useSpacing } from '../../themes/ThemeProvider';
import { Card } from './Card';
import {
  JobCard,
  ProfileCard,
  ReviewCard,
  PremiumCard,
  SmallJobCard,
  SmallProfileCard,
  SmallReviewCard,
  LargeJobCard,
  LargeProfileCard,
  FeaturedJobCard,
  FeaturedProfileCard,
  CompactJobCard,
  CompactProfileCard,
} from './variants';

export const CardDemo: React.FC = () => {
  const colors = useColors();
  const typography = useTypography();
  const spacing = useSpacing();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

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

  // Sample data
  const sampleJobData = {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'We are looking for an experienced React Native developer to join our growing team. You will be responsible for developing high-quality mobile applications.',
    featured: false,
  };

  const sampleProfileData = {
    id: '1',
    name: 'Maria Rodriguez',
    profession: 'House Cleaning Specialist',
    rating: 4.8,
    reviewCount: 127,
    avatar: require('../../../assets/sample-avatar.png'), // You'll need to add this
    badges: ['Verified', 'Top Rated', 'Quick Response'],
    featured: false,
  };

  const sampleReviewData = {
    id: '1',
    reviewerName: 'John Smith',
    reviewerAvatar: require('../../../assets/sample-avatar-2.png'), // You'll need to add this
    rating: 5,
    date: '1 week ago',
    text: 'Excellent service! Maria was very professional and thorough. My house has never been cleaner. Highly recommend!',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Basic Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Cards</Text>
        <Text style={styles.description}>
          Standard card components with different variants
        </Text>
        
        <Card
          title="Default Card"
          subtitle="Basic card with title and subtitle"
          description="This is a default card component that can be used for general content display."
          onPress={() => setSelectedCard('default')}
        />
        
        <PremiumCard
          title="Premium Card"
          subtitle="Enhanced styling with premium feel"
          description="This premium card has enhanced shadows, borders, and styling for important content."
          onPress={() => setSelectedCard('premium')}
        />
      </View>

      {/* Job Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Cards</Text>
        <Text style={styles.description}>
          Cards designed specifically for job listings
        </Text>
        
        <JobCard
          jobData={sampleJobData}
          onPress={() => setSelectedCard('job')}
        />
        
        <FeaturedJobCard
          jobData={{...sampleJobData, featured: true}}
          onPress={() => setSelectedCard('featured-job')}
        />
        
        <SmallJobCard
          jobData={sampleJobData}
          onPress={() => setSelectedCard('small-job')}
        />
      </View>

      {/* Profile Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Cards</Text>
        <Text style={styles.description}>
          Cards for displaying worker profiles and information
        </Text>
        
        <ProfileCard
          profileData={sampleProfileData}
          onPress={() => setSelectedCard('profile')}
        />
        
        <FeaturedProfileCard
          profileData={{...sampleProfileData, featured: true}}
          onPress={() => setSelectedCard('featured-profile')}
        />
        
        <SmallProfileCard
          profileData={sampleProfileData}
          onPress={() => setSelectedCard('small-profile')}
        />
      </View>

      {/* Review Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review Cards</Text>
        <Text style={styles.description}>
          Cards for displaying customer reviews and ratings
        </Text>
        
        <ReviewCard
          reviewData={sampleReviewData}
          onPress={() => setSelectedCard('review')}
        />
        
        <SmallReviewCard
          reviewData={sampleReviewData}
          onPress={() => setSelectedCard('small-review')}
        />
      </View>

      {/* Card Sizes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Sizes</Text>
        <Text style={styles.description}>
          Different sizes for various contexts
        </Text>
        
        <LargeJobCard
          jobData={sampleJobData}
          onPress={() => setSelectedCard('large-job')}
        />
        
        <LargeProfileCard
          profileData={sampleProfileData}
          onPress={() => setSelectedCard('large-profile')}
        />
      </View>

      {/* Compact Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compact Cards</Text>
        <Text style={styles.description}>
          Compact versions for lists and dense layouts
        </Text>
        
        <CompactJobCard
          jobData={sampleJobData}
          onPress={() => setSelectedCard('compact-job')}
        />
        
        <CompactProfileCard
          profileData={sampleProfileData}
          onPress={() => setSelectedCard('compact-profile')}
        />
      </View>

      {/* Card States */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card States</Text>
        <Text style={styles.description}>
          Different states and interactions
        </Text>
        
        <Card
          title="Normal State"
          subtitle="Default interactive card"
          description="This card responds to touch with smooth animations."
          onPress={() => setSelectedCard('normal')}
        />
        
        <Card
          title="Disabled State"
          subtitle="Non-interactive card"
          description="This card is disabled and cannot be interacted with."
          disabled
        />
        
        <Card
          title="Featured State"
          subtitle="Highlighted card with special styling"
          description="This card has enhanced styling to draw attention."
          featured
          onPress={() => setSelectedCard('featured')}
        />
      </View>

      {/* Interactive Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interactive Examples</Text>
        <Text style={styles.description}>
          Cards with various interaction patterns
        </Text>
        
        <JobCard
          jobData={sampleJobData}
          onPress={() => console.log('Job card pressed')}
          onLongPress={() => console.log('Job card long pressed')}
        />
        
        <ProfileCard
          profileData={sampleProfileData}
          onPress={() => console.log('Profile card pressed')}
          onLongPress={() => console.log('Profile card long pressed')}
        />
      </View>

      {/* Custom Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Content</Text>
        <Text style={styles.description}>
          Cards with custom children content
        </Text>
        
        <Card
          title="Custom Card"
          subtitle="With additional content"
          onPress={() => setSelectedCard('custom')}
        >
          <View style={{
            marginTop: spacing.md,
            padding: spacing.md,
            backgroundColor: colors.background.secondary,
            borderRadius: 8,
          }}>
            <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
              This is custom content inside the card. You can add any React Native components here.
            </Text>
          </View>
        </Card>
      </View>

      {/* Selected Card Info */}
      {selectedCard && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Card</Text>
          <Text style={styles.description}>
            You selected: {selectedCard}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};