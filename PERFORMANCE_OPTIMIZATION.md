# Performance Optimization Guide

## React Native Warnings and Solutions

### 1. Legacy Architecture Warning

**Warning**: "The app is running using the Legacy Architecture. The Legacy Architecture is deprecated..."

**Current Status**: Using React Native 0.80.1 with Legacy Architecture

**Solutions**:

#### Option A: Ignore for Now (Recommended for Production)
- The warning doesn't affect functionality
- Legacy Architecture is still supported
- Migration can be done later when all dependencies support New Architecture

#### Option B: Migrate to New Architecture
```bash
# iOS
cd ios && RCT_NEW_ARCH_ENABLED=1 pod install && cd ..

# Android - Add to android/gradle.properties:
newArchEnabled=true
```

**Note**: Test thoroughly after migration as some third-party libraries may not be compatible.

### 2. Shadow Performance Warnings

**Warning**: "View has a shadow set but cannot calculate shadow efficiently. Consider setting a solid background color..."

**Root Cause**: React Native can't efficiently calculate shadows on views without a solid background color.

**Solutions**:

#### A. Add Background Color to Shadowed Components
```typescript
// ❌ Before
const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
});

// ✅ After
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', // Required for efficient shadow calculation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
});
```

#### B. Use Shadow Utility Functions
```typescript
import { createOptimizedShadow } from '../../design-system';

const styles = StyleSheet.create({
  container: {
    ...createOptimizedShadow(shadows.md, 'white'),
  },
});
```

#### C. Wrap Components in Shadow Containers
```typescript
// For components that can't have a background color
<View style={createShadowWrapper(shadows.md, 'white')}>
  <YourComponent />
</View>
```

### 3. Components That Need Shadow Optimization

The following components have been identified with shadow issues:

- **OnboardingScreen**: Image component shadows
- **SplashScreen**: Logo shadows  
- **WelcomeScreen**: Logo shadows
- **Card components**: Various card shadows
- **Dashboard screens**: Multiple shadow instances

### 4. Best Practices

1. **Always add backgroundColor** when using shadows
2. **Use the shadow utility functions** from the design system
3. **Consider removing unnecessary shadows** for better performance
4. **Test shadow performance** on both iOS and Android
5. **Use elevation for Android** and shadow properties for iOS

### 5. Performance Monitoring

Monitor these metrics after optimizations:
- App startup time
- Frame rate during animations
- Memory usage
- Battery consumption

### 6. Future Considerations

- Consider migrating to New Architecture when stable
- Evaluate shadow alternatives (borders, gradients)
- Implement shadow caching for repeated components
- Use React Native Performance Monitor for detailed analysis
