/**
 * Design System - Card Variants
 * Specialized card components for common use cases
 */

import React from 'react';
import { Card } from './Card';
import { CardProps, JobCardData, ProfileCardData, ReviewCardData } from './types';

// Job card with pre-configured styling for job listings
export const JobCard: React.FC<Omit<CardProps, 'variant'> & { jobData?: JobCardData }> = ({ 
  jobData, 
  ...props 
}) => (
  <Card 
    {...props} 
    variant="job"
    jobTitle={jobData?.title || props.jobTitle}
    companyName={jobData?.company || props.companyName}
    location={jobData?.location || props.location}
    salary={jobData?.salary || props.salary}
    jobType={jobData?.type || props.jobType}
    postedDate={jobData?.postedDate || props.postedDate}
    description={jobData?.description || props.description}
    featured={jobData?.featured || props.featured}
  />
);

// Profile card with pre-configured styling for worker profiles
export const ProfileCard: React.FC<Omit<CardProps, 'variant'> & { profileData?: ProfileCardData }> = ({ 
  profileData, 
  ...props 
}) => (
  <Card 
    {...props} 
    variant="profile"
    profileName={profileData?.name || props.profileName}
    profession={profileData?.profession || props.profession}
    rating={profileData?.rating || props.rating}
    reviewCount={profileData?.reviewCount || props.reviewCount}
    profileImage={profileData?.avatar || props.profileImage}
    badges={profileData?.badges || props.badges}
    featured={profileData?.featured || props.featured}
  />
);

// Review card with pre-configured styling for reviews
export const ReviewCard: React.FC<Omit<CardProps, 'variant'> & { reviewData?: ReviewCardData }> = ({ 
  reviewData, 
  ...props 
}) => (
  <Card 
    {...props} 
    variant="review"
    reviewerName={reviewData?.reviewerName || props.reviewerName}
    reviewerAvatar={reviewData?.reviewerAvatar || props.reviewerAvatar}
    reviewRating={reviewData?.rating || props.reviewRating}
    reviewDate={reviewData?.date || props.reviewDate}
    reviewText={reviewData?.text || props.reviewText}
  />
);

// Premium card with enhanced styling
export const PremiumCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card {...props} variant="premium" />
);

// Small card variants
export const SmallJobCard: React.FC<Omit<CardProps, 'variant' | 'size'> & { jobData?: JobCardData }> = ({ 
  jobData, 
  ...props 
}) => (
  <JobCard {...props} jobData={jobData} size="small" />
);

export const SmallProfileCard: React.FC<Omit<CardProps, 'variant' | 'size'> & { profileData?: ProfileCardData }> = ({ 
  profileData, 
  ...props 
}) => (
  <ProfileCard {...props} profileData={profileData} size="small" />
);

export const SmallReviewCard: React.FC<Omit<CardProps, 'variant' | 'size'> & { reviewData?: ReviewCardData }> = ({ 
  reviewData, 
  ...props 
}) => (
  <ReviewCard {...props} reviewData={reviewData} size="small" />
);

// Large card variants
export const LargeJobCard: React.FC<Omit<CardProps, 'variant' | 'size'> & { jobData?: JobCardData }> = ({ 
  jobData, 
  ...props 
}) => (
  <JobCard {...props} jobData={jobData} size="large" />
);

export const LargeProfileCard: React.FC<Omit<CardProps, 'variant' | 'size'> & { profileData?: ProfileCardData }> = ({ 
  profileData, 
  ...props 
}) => (
  <ProfileCard {...props} profileData={profileData} size="large" />
);

export const LargeReviewCard: React.FC<Omit<CardProps, 'variant' | 'size'> & { reviewData?: ReviewCardData }> = ({ 
  reviewData, 
  ...props 
}) => (
  <ReviewCard {...props} reviewData={reviewData} size="large" />
);

// Featured card variants
export const FeaturedJobCard: React.FC<Omit<CardProps, 'variant' | 'featured'> & { jobData?: JobCardData }> = ({ 
  jobData, 
  ...props 
}) => (
  <JobCard {...props} jobData={jobData} featured />
);

export const FeaturedProfileCard: React.FC<Omit<CardProps, 'variant' | 'featured'> & { profileData?: ProfileCardData }> = ({ 
  profileData, 
  ...props 
}) => (
  <ProfileCard {...props} profileData={profileData} featured />
);

// Compact card variants for lists
export const CompactJobCard: React.FC<Omit<CardProps, 'variant' | 'size'> & { jobData?: JobCardData }> = ({ 
  jobData, 
  ...props 
}) => (
  <Card 
    {...props} 
    variant="job"
    size="small"
    jobTitle={jobData?.title || props.jobTitle}
    companyName={jobData?.company || props.companyName}
    location={jobData?.location || props.location}
    salary={jobData?.salary || props.salary}
    jobType={jobData?.type || props.jobType}
    postedDate={jobData?.postedDate || props.postedDate}
    featured={jobData?.featured || props.featured}
    containerStyle={{
      marginHorizontal: 8,
      marginVertical: 4,
    }}
  />
);

export const CompactProfileCard: React.FC<Omit<CardProps, 'variant' | 'size'> & { profileData?: ProfileCardData }> = ({ 
  profileData, 
  ...props 
}) => (
  <Card 
    {...props} 
    variant="profile"
    size="small"
    profileName={profileData?.name || props.profileName}
    profession={profileData?.profession || props.profession}
    rating={profileData?.rating || props.rating}
    reviewCount={profileData?.reviewCount || props.reviewCount}
    profileImage={profileData?.avatar || props.profileImage}
    badges={profileData?.badges?.slice(0, 2) || props.badges?.slice(0, 2)} // Limit badges for compact view
    featured={profileData?.featured || props.featured}
    containerStyle={{
      marginHorizontal: 8,
      marginVertical: 4,
    }}
  />
);

// Interactive card variants
export const InteractiveJobCard: React.FC<Omit<CardProps, 'variant'> & { 
  jobData?: JobCardData;
  onBookmark?: () => void;
  onShare?: () => void;
  isBookmarked?: boolean;
}> = ({ 
  jobData, 
  onBookmark,
  onShare,
  isBookmarked = false,
  ...props 
}) => (
  <Card 
    {...props} 
    variant="job"
    jobTitle={jobData?.title || props.jobTitle}
    companyName={jobData?.company || props.companyName}
    location={jobData?.location || props.location}
    salary={jobData?.salary || props.salary}
    jobType={jobData?.type || props.jobType}
    postedDate={jobData?.postedDate || props.postedDate}
    description={jobData?.description || props.description}
    featured={jobData?.featured || props.featured}
  >
    {/* Additional interactive elements can be added here */}
  </Card>
);

export const InteractiveProfileCard: React.FC<Omit<CardProps, 'variant'> & { 
  profileData?: ProfileCardData;
  onContact?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}> = ({ 
  profileData, 
  onContact,
  onFavorite,
  isFavorited = false,
  ...props 
}) => (
  <Card 
    {...props} 
    variant="profile"
    profileName={profileData?.name || props.profileName}
    profession={profileData?.profession || props.profession}
    rating={profileData?.rating || props.rating}
    reviewCount={profileData?.reviewCount || props.reviewCount}
    profileImage={profileData?.avatar || props.profileImage}
    badges={profileData?.badges || props.badges}
    featured={profileData?.featured || props.featured}
  >
    {/* Additional interactive elements can be added here */}
  </Card>
);