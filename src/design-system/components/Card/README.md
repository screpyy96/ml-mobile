# Card Component

A modern card component with multiple variants, smooth animations, and premium styling for displaying various types of content including job listings, profiles, and reviews.

## Features

- ✅ **Multiple Variants**: Default, Job, Profile, Review, Premium
- ✅ **Three Sizes**: Small, Medium, Large
- ✅ **Interactive States**: Normal, Pressed, Disabled, Featured
- ✅ **Smooth Animations**: Press animations with haptic feedback
- ✅ **Premium Styling**: Modern shadows, rounded corners, and elegant typography
- ✅ **Specialized Content**: Pre-configured layouts for jobs, profiles, and reviews
- ✅ **Rating System**: Built-in star rating display
- ✅ **Badge Support**: Customizable badges and tags
- ✅ **Accessibility**: Full screen reader and keyboard navigation support
- ✅ **TypeScript**: Complete type safety

## Basic Usage

```tsx
import { Card } from './src/design-system';

// Basic card
<Card 
  title="Card Title" 
  subtitle="Card subtitle"
  description="Card description text"
  onPress={() => console.log('Card pressed')}
/>

// Card with image
<Card 
  title="Card with Image"
  imageSource={require('./image.jpg')}
  description="This card includes an image"
/>
```

## Variants

### Default
Standard card for general content display.
```tsx
<Card 
  title="Default Card" 
  subtitle="Basic card styling"
  description="Standard card component for general use"
/>
```

### Job Card
Specialized card for job listings with company, location, salary, and job type.
```tsx
<JobCard
  jobTitle="Senior React Native Developer"
  companyName="TechCorp Solutions"
  location="San Francisco, CA"
  salary="$120k - $150k"
  jobType="Full-time"
  postedDate="2 days ago"
  description="We are looking for an experienced developer..."
  featured={true}
  onPress={() => navigateToJob()}
/>
```

### Profile Card
Card for displaying worker profiles with ratings, badges, and professional information.
```tsx
<ProfileCard
  profileName="Maria Rodriguez"
  profession="House Cleaning Specialist"
  rating={4.8}
  reviewCount={127}
  profileImage={require('./avatar.jpg')}
  badges={['Verified', 'Top Rated', 'Quick Response']}
  featured={true}
  onPress={() => navigateToProfile()}
/>
```

### Review Card
Card for displaying customer reviews with ratings and reviewer information.
```tsx
<ReviewCard
  reviewerName="John Smith"
  reviewerAvatar={require('./reviewer.jpg')}
  reviewRating={5}
  reviewDate="1 week ago"
  reviewText="Excellent service! Very professional and thorough."
  onPress={() => viewFullReview()}
/>
```

### Premium Card
Enhanced card with premium styling and shadows.
```tsx
<PremiumCard
  title="Premium Content"
  subtitle="Enhanced styling"
  description="This card has premium styling with enhanced shadows and borders"
/>
```

## Sizes

```tsx
<Card title="Small Card" size="small" />
<Card title="Medium Card" size="medium" />
<Card title="Large Card" size="large" />
```

## States

```tsx
// Normal state
<Card title="Normal" onPress={() => {}} />

// Featured state
<Card title="Featured" featured />

// Disabled state
<Card title="Disabled" disabled />
```

## Specialized Variants

Pre-configured card components for common use cases:

```tsx
import { 
  JobCard,
  ProfileCard,
  ReviewCard,
  SmallJobCard,
  LargeProfileCard,
  FeaturedJobCard,
  CompactJobCard
} from './src/design-system';

// Small variants
<SmallJobCard jobData={jobData} />
<SmallProfileCard profileData={profileData} />

// Large variants
<LargeJobCard jobData={jobData} />
<LargeProfileCard profileData={profileData} />

// Featured variants
<FeaturedJobCard jobData={jobData} />
<FeaturedProfileCard profileData={profileData} />

// Compact variants for lists
<CompactJobCard jobData={jobData} />
<CompactProfileCard profileData={profileData} />
```

## Data Models

### Job Card Data
```tsx
interface JobCardData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  postedDate: string;
  description: string;
  featured?: boolean;
}
```

### Profile Card Data
```tsx
interface ProfileCardData {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  avatar: any;
  badges: string[];
  featured?: boolean;
}
```

### Review Card Data
```tsx
interface ReviewCardData {
  id: string;
  reviewerName: string;
  reviewerAvatar: any;
  rating: number;
  date: string;
  text: string;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Card title text |
| `subtitle` | `string` | - | Card subtitle text |
| `description` | `string` | - | Card description text |
| `imageSource` | `any` | - | Image source for card image |
| `variant` | `'default' \| 'job' \| 'profile' \| 'review' \| 'premium'` | `'default'` | Card variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Card size |
| `featured` | `boolean` | `false` | Whether card is featured |
| `disabled` | `boolean` | `false` | Whether card is disabled |
| `onPress` | `() => void` | - | Press handler |
| `onLongPress` | `() => void` | - | Long press handler |
| `containerStyle` | `ViewStyle` | - | Custom container styles |
| `contentStyle` | `ViewStyle` | - | Custom content styles |

### Job Card Specific Props
| Prop | Type | Description |
|------|------|-------------|
| `jobTitle` | `string` | Job title |
| `companyName` | `string` | Company name |
| `location` | `string` | Job location |
| `salary` | `string` | Salary range |
| `jobType` | `string` | Job type (Full-time, Part-time, etc.) |
| `postedDate` | `string` | When job was posted |

### Profile Card Specific Props
| Prop | Type | Description |
|------|------|-------------|
| `profileName` | `string` | Profile name |
| `profession` | `string` | Professional title |
| `rating` | `number` | Rating (0-5) |
| `reviewCount` | `number` | Number of reviews |
| `profileImage` | `any` | Profile image source |
| `badges` | `string[]` | Array of badge texts |

### Review Card Specific Props
| Prop | Type | Description |
|------|------|-------------|
| `reviewerName` | `string` | Reviewer name |
| `reviewerAvatar` | `any` | Reviewer avatar source |
| `reviewRating` | `number` | Review rating (0-5) |
| `reviewDate` | `string` | Review date |
| `reviewText` | `string` | Review text content |

## Accessibility

The Card component includes comprehensive accessibility support:

- **Screen Reader**: Proper labels, hints, and role assignments
- **Touch Targets**: Minimum touch target sizes
- **State Communication**: Featured, disabled states are announced
- **Keyboard Navigation**: Focus indicators and keyboard activation
- **Content Structure**: Proper heading hierarchy for card content

## Animations

- **Press Animation**: Smooth scale-down effect on press (0.98 scale)
- **Haptic Feedback**: Light vibration on press, stronger on long press
- **State Transitions**: Smooth transitions between states
- **Performance**: Uses native driver for optimal performance

## Theming

The Card component automatically adapts to light/dark themes:

```tsx
// Automatically uses current theme
<Card title="Themed Card" />

// Colors, shadows, and typography adapt based on theme mode
const { isDark } = useTheme();
```

## Best Practices

### Do ✅
- Use appropriate card variants for content type
- Provide meaningful titles and descriptions
- Use featured state sparingly for important content
- Include proper accessibility labels
- Use consistent sizing within lists
- Provide press feedback for interactive cards

### Don't ❌
- Overcrowd cards with too much information
- Use tiny touch targets
- Forget to handle loading states
- Mix different card styles in the same list
- Override theme colors unnecessarily
- Skip accessibility considerations

## Examples

### Job Listing
```tsx
<JobCard
  jobData={{
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'We are looking for an experienced React Native developer...',
    featured: true
  }}
  onPress={() => navigateToJobDetails('1')}
/>
```

### Worker Profile
```tsx
<ProfileCard
  profileData={{
    id: '1',
    name: 'Maria Rodriguez',
    profession: 'House Cleaning Specialist',
    rating: 4.8,
    reviewCount: 127,
    avatar: require('./maria-avatar.jpg'),
    badges: ['Verified', 'Top Rated', 'Quick Response'],
    featured: true
  }}
  onPress={() => navigateToProfile('1')}
/>
```

### Customer Review
```tsx
<ReviewCard
  reviewData={{
    id: '1',
    reviewerName: 'John Smith',
    reviewerAvatar: require('./john-avatar.jpg'),
    rating: 5,
    date: '1 week ago',
    text: 'Excellent service! Maria was very professional and thorough. My house has never been cleaner. Highly recommend!'
  }}
  onPress={() => viewFullReview('1')}
/>
```

### Card List
```tsx
<ScrollView>
  {jobs.map(job => (
    <CompactJobCard
      key={job.id}
      jobData={job}
      onPress={() => navigateToJob(job.id)}
    />
  ))}
</ScrollView>
```

### Featured Content
```tsx
<View>
  <Text style={styles.sectionTitle}>Featured Jobs</Text>
  {featuredJobs.map(job => (
    <FeaturedJobCard
      key={job.id}
      jobData={job}
      onPress={() => navigateToJob(job.id)}
    />
  ))}
</View>
```