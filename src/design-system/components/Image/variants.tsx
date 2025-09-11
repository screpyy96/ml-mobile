/**
 * Design System - Image Variants
 * Specialized image components for common use cases
 */

import React from 'react';
import { Image } from './Image';
import { Avatar } from './Avatar';
import { ImageProps, AvatarProps } from './types';

// Cover image for headers/banners
export const CoverImage: React.FC<Omit<ImageProps, 'variant'>> = (props) => (
  <Image {...props} variant="cover" />
);

// Hero image for landing sections
export const HeroImage: React.FC<Omit<ImageProps, 'variant'>> = (props) => (
  <Image {...props} variant="hero" />
);

// Thumbnail image for lists/grids
export const ThumbnailImage: React.FC<Omit<ImageProps, 'variant'>> = (props) => (
  <Image {...props} variant="thumbnail" />
);

// Profile avatar
export const ProfileAvatar: React.FC<AvatarProps> = (props) => (
  <Avatar {...props} />
);

// Small avatar for lists
export const SmallAvatar: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="small" />
);

// Large avatar for profiles
export const LargeAvatar: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="large" />
);

// Extra large avatar for profile headers
export const XLargeAvatar: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="xlarge" />
);

// Avatar with online status
export const OnlineAvatar: React.FC<Omit<AvatarProps, 'online'>> = (props) => (
  <Avatar {...props} online={true} />
);

// Avatar with offline status
export const OfflineAvatar: React.FC<Omit<AvatarProps, 'online'>> = (props) => (
  <Avatar {...props} online={false} />
);

// Square image for products/items
export const SquareImage: React.FC<Omit<ImageProps, 'shape'>> = (props) => (
  <Image {...props} shape="square" />
);

// Circular image
export const CircularImage: React.FC<Omit<ImageProps, 'shape'>> = (props) => (
  <Image {...props} shape="circle" />
);

// Rounded image
export const RoundedImage: React.FC<Omit<ImageProps, 'shape'>> = (props) => (
  <Image {...props} shape="rounded" />
);

// Logo image with contain fit
export const LogoImage: React.FC<Omit<ImageProps, 'fit'>> = (props) => (
  <Image {...props} fit="contain" />
);

// Background image with cover fit
export const BackgroundImage: React.FC<Omit<ImageProps, 'fit'>> = (props) => (
  <Image {...props} fit="cover" />
);

// Product image with aspect ratio
export const ProductImage: React.FC<Omit<ImageProps, 'aspectRatio'>> = (props) => (
  <Image {...props} aspectRatio={1} shape="rounded" />
);

// Banner image with 16:9 aspect ratio
export const BannerImage: React.FC<Omit<ImageProps, 'aspectRatio'>> = (props) => (
  <Image {...props} aspectRatio={16/9} shape="rounded" />
);

// Card image with 4:3 aspect ratio
export const CardImage: React.FC<Omit<ImageProps, 'aspectRatio'>> = (props) => (
  <Image {...props} aspectRatio={4/3} shape="rounded" />
);

// Gallery image with loading blur
export const GalleryImage: React.FC<Omit<ImageProps, 'blurRadius' | 'showLoading'>> = (props) => (
  <Image {...props} blurRadius={10} showLoading={true} />
);

// Profile cover image
export const ProfileCoverImage: React.FC<Omit<ImageProps, 'variant' | 'aspectRatio'>> = (props) => (
  <Image {...props} variant="cover" aspectRatio={3/1} />
);

// Message avatar (small with online status)
export const MessageAvatar: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="small" />
);

// Group avatar (overlapping avatars)
export const GroupAvatar: React.FC<{
  avatars: Array<{ source?: any; name?: string }>;
  size?: AvatarProps['size'];
  maxVisible?: number;
  style?: any;
}> = ({ avatars, size = 'medium', maxVisible = 3, style }) => {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = avatars.length - maxVisible;
  
  return (
    <div style={{ position: 'relative', display: 'flex', ...style }}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          style={{
            marginLeft: index > 0 ? -8 : 0,
            zIndex: visibleAvatars.length - index,
          }}
        >
          <Avatar
            source={avatar.source}
            name={avatar.name}
            size={size}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          style={{
            marginLeft: -8,
            zIndex: 0,
          }}
        >
          <Avatar
            name={`+${remainingCount}`}
            size={size}
          />
        </div>
      )}
    </div>
  );
};

// Placeholder image for empty states
export const PlaceholderImage: React.FC<{
  width?: number | string;
  height?: number | string;
  text?: string;
  style?: any;
}> = ({ width = 200, height = 200, text = 'No Image', style }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      color: '#666',
      fontSize: 14,
      ...style,
    }}
  >
    {text}
  </div>
);