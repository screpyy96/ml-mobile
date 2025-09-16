/**
 * Design System - Modern Bottom Navigation
 * Clean bottom navigation with 5 main buttons and drawer menu
 */

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, ScrollView, Image, InteractionManager } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { useAuth } from '../../../context/AuthContext';

const { height: screenHeight } = Dimensions.get('window');
const DRAWER_HEIGHT = screenHeight * 0.7;

// Map legacy MaterialIcons names to MaterialCommunityIcons
const mapIcon = (name: string): string => {
  const map: Record<string, string> = {
    home: 'home-outline',
    search: 'magnify',
    dashboard: 'view-dashboard-outline',
    people: 'account-group-outline',
    assignment: 'clipboard-text-outline',
    person: 'account-outline',
    menu: 'menu',
    work: 'briefcase-outline',
    notifications: 'bell-outline',
    star: 'star-outline',
    message: 'message-text-outline',
    settings: 'cog-outline',
    help: 'help-circle-outline',
    logout: 'logout',
    favorite: 'heart-outline',
    history: 'history',
  };
  return map[name] || name;
};

interface DrawerItem {
  key: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

interface DrawerNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const DrawerNavigator: React.FC<DrawerNavigatorProps> = React.memo(({
  isOpen,
  onClose,
  onOpen,
  onNavigate,
  currentRoute,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  // Bottom navigation items based on user type
  const getDrawerItems = (): DrawerItem[] => {
    console.log('🔍 DrawerNavigator - User type:', user?.userType);
    if (user?.userType === 'meserias') {
      return [
        {
          key: 'home',
          label: 'Acasă',
          icon: 'home',
          route: 'Home',
        },
        {
          key: 'search',
          label: 'Meseriași',
          icon: 'people',
          route: 'Search',
        },
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          route: 'Dashboard',
        },
        {
          key: 'messages',
          label: 'Mesaje',
          icon: 'message',
          route: 'Messages',
        },
        {
          key: 'menu',
          label: 'Meniu',
          icon: 'menu',
          route: 'Menu',
        },
      ];
    } else {
      // Client navigation items
      return [
        {
          key: 'home',
          label: 'Acasă',
          icon: 'home',
          route: 'Home',
        },
        {
          key: 'search',
          label: 'Meșeriași',
          icon: 'search',
          route: 'Search',
        },
        {
          key: 'dashboard',
          label: 'Cereri',
          icon: 'assignment',
          route: 'Dashboard',
        },
        {
          key: 'messages',
          label: 'Mesaje',
          icon: 'message',
          route: 'Messages',
        },
        {
          key: 'menu',
          label: 'Meniu',
          icon: 'menu',
          route: 'Menu',
        },
      ];
    }
  };

  const drawerItems = React.useMemo(() => getDrawerItems(), [user?.userType]);

  // Menu items based on user type
  const getMenuItems = (): DrawerItem[] => {
    console.log('🔍 DrawerNavigator - Menu items for user type:', user?.userType);
    if (user?.userType === 'meserias') {
      return [
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          route: 'WorkerDashboard',
        },
        {
          key: 'profile-public',
          label: 'Profil Public',
          icon: 'person',
          route: 'Profile',
        },
        {
          key: 'contacts-unblock',
          label: 'Contacte Deblocate',
          icon: 'contacts',
          route: 'Dashboard',
        },
        {
          key: 'reviews',
          label: 'Recenziile Mele',
          icon: 'star',
          route: 'Reviews',
        },
        {
          key: 'requests',
          label: 'Cererile Mele',
          icon: 'favorite',
          route: 'SavedJobs',
        },
        {
          key: 'subscription',
          label: 'Abonament',
          icon: 'card_membership',
          route: 'Subscription',
        },
        {
          key: 'settings',
          label: 'Setări',
          icon: 'settings',
          route: 'Settings',
        },
        {
          key: 'notifications',
          label: 'Notificări',
          icon: 'notifications',
          route: 'Notifications',
        },
        {
          key: 'meserias',
          label: 'Meșeriași',
          icon: 'search',
          route: 'Search',
        },
        {
          key: 'applications',
          label: 'Solicitări',
          icon: 'assignment',
          route: 'Applications',
        },
        {
          key: 'services',
          label: 'Servicii',
          icon: 'build',
          route: 'Dashboard',
        },
      ];
    } else {
      // Client menu items
      return [
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          route: 'Dashboard',
        },
        {
          key: 'profile-public',
          label: 'Profil Public',
          icon: 'person',
          route: 'Profile',
        },
        {
          key: 'contacts-unblock',
          label: 'Contacte Deblocate',
          icon: 'contacts',
          route: 'Dashboard',
        },
        {
          key: 'reviews',
          label: 'Recenziile Mele',
          icon: 'star',
          route: 'Reviews',
        },
        {
          key: 'requests',
          label: 'Cererile Mele',
          icon: 'favorite',
          route: 'SavedJobs',
        },
        {
          key: 'subscription',
          label: 'Abonament',
          icon: 'card_membership',
          route: 'Subscription',
        },
        {
          key: 'settings',
          label: 'Setări',
          icon: 'settings',
          route: 'Settings',
        },
        {
          key: 'notifications',
          label: 'Notificări',
          icon: 'notifications',
          route: 'Notifications',
        },
        {
          key: 'meserias',
          label: 'Meșeriași',
          icon: 'search',
          route: 'Search',
        },
        {
          key: 'applications',
          label: 'Solicitări',
          icon: 'assignment',
          route: 'Applications',
        },
        {
          key: 'services',
          label: 'Servicii',
          icon: 'build',
          route: 'Dashboard',
        },
      ];
    }
  };

  const menuItems = React.useMemo(() => getMenuItems(), [user?.userType]);

  // Defensive: if route changes while drawer is open, force-close it
  React.useEffect(() => {
    if (isOpen) {
      panY.setValue(0);
      // Use a timeout to ensure animations complete properly
      setTimeout(() => {
        onClose();
      }, 50);
    }
  }, [currentRoute]);

  React.useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Ensure pan value is reset when closing to avoid partial open state
      panY.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: DRAWER_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Ensure overlay is completely hidden after animation
        panY.setValue(0);
      });
    }
  }, [isOpen]);

  // Pan gesture handler for swipe to close
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      // Close if swiped down more than 100px or with high velocity
      if (translationY > 100 || velocityY > 500) {
        onClose();
      } else {
        // Snap back to open position
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
      
      // Reset pan value
      panY.setValue(0);
    }
  };

  const handleItemPress = (item: DrawerItem) => {
    if (item.key === 'menu') {
      // Toggle menu when Menu button is pressed
      if (isOpen) {
        // Reset pan and close
        panY.setValue(0);
        slideAnim.setValue(DRAWER_HEIGHT);
        fadeAnim.setValue(0);
        onClose();
      } else {
        onOpen();
      }
    } else {
      // Close first, then navigate after interactions to avoid overlay intercepting
      if (isOpen) {
        panY.setValue(0);
        slideAnim.setValue(DRAWER_HEIGHT);
        fadeAnim.setValue(0);
        onClose();
      }
      InteractionManager.runAfterInteractions(() => onNavigate(item.route));
    }
  };

  const handleMenuItemPress = (item: DrawerItem) => {
    console.log('🔥 DrawerNavigator - Menu item pressed:', item.key, item.route);
    console.log('🔥 DrawerNavigator - Drawer is open:', isOpen);
    
    // Close then navigate after interactions
    panY.setValue(0);
    slideAnim.setValue(DRAWER_HEIGHT);
    fadeAnim.setValue(0);
    onClose();
    
    // Special handling for Profile route - navigate to Dashboard then Profile
    if (item.route === 'Profile') {
      InteractionManager.runAfterInteractions(() => {
        onNavigate('Dashboard');
        // Small delay to ensure Dashboard is loaded before navigating to Profile
        setTimeout(() => {
          onNavigate('Profile');
        }, 100);
      });
    } else {
      InteractionManager.runAfterInteractions(() => onNavigate(item.route));
    }
  };

  return (
    <>
      {/* Backdrop when menu is open */}
      {isOpen && (
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          ]}
          pointerEvents={isOpen ? "auto" : "none"}
        >
          <TouchableOpacity
            style={styles.backdropTouch}
            onPress={() => {
              panY.setValue(0);
              slideAnim.setValue(DRAWER_HEIGHT);
              fadeAnim.setValue(0);
              onClose();
            }}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Fixed Bottom Navigation */}
      <View style={[styles.bottomNavigation, { paddingBottom: insets.bottom }]}>
        {drawerItems.map((item) => {
          const isActive = currentRoute === item.route || (item.key === 'menu' && isOpen);
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.navButton,
                isActive && { backgroundColor: theme.colors.primary[500] + '15' },
              ]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <MCIcon
                name={mapIcon(item.icon)}
                size={24}
                color={isActive ? theme.colors.primary[500] : theme.colors.text.secondary}
              />
              <Text style={[
                styles.buttonLabel,
                { color: isActive ? theme.colors.primary[500] : theme.colors.text.secondary }
              ]}>
                {item.label}
              </Text>
              {item.badge && (
                <View style={[styles.badge, { backgroundColor: '#ff4444' }]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

                     {/* Menu Panel that slides up */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.menuPanel,
            {
              transform: [
                { translateY: Animated.add(slideAnim, panY) }
              ],
              backgroundColor: theme.colors.background.primary,
              paddingBottom: insets.bottom + 20,
            },
          ]}
          pointerEvents={isOpen ? "auto" : "none"}
        >
        {/* User Info */}
        <View style={styles.userSection}>
          {user && user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={styles.userAvatar}
            />
          ) : (
            <View style={[styles.userAvatarFallback, { backgroundColor: theme.colors.primary[500] }]}>
              <Text style={styles.userAvatarText}>
                {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
              {user?.name || 'Utilizator'}
            </Text>
            <Text style={[styles.userType, { color: theme.colors.text.secondary }]}>
              {user?.userType === 'meserias' ? 'Meseriaș' : 'Client'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <MCIcon
                    name={mapIcon(item.icon)}
                    size={24}
                    color={theme.colors.text.secondary}
                  />
                </View>
                <Text style={[styles.menuItemLabel, { color: theme.colors.text.primary }]}>
                  {item.label}
                </Text>
              </View>
              {item.badge && (
                <View style={[styles.menuBadge, { backgroundColor: '#ff4444' }]}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Close Handle */}
        <TouchableOpacity 
          style={styles.closeHandle}
          onPress={() => {
            panY.setValue(0);
            slideAnim.setValue(DRAWER_HEIGHT);
            fadeAnim.setValue(0);
            onClose();
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.handleBar, { backgroundColor: theme.colors.text.secondary }]} />
        </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
});

const styles = {
  backdrop: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    // Performance hints
    // @ts-ignore
    renderToHardwareTextureAndroid: true,
    // @ts-ignore
    shouldRasterizeIOS: true,
  },
  backdropTouch: {
    flex: 1,
  },
  bottomNavigation: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff', // Explicitly set for shadow optimization
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 1001,
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // Ensure navigation blocks touch events
    pointerEvents: 'auto' as const,
  },
  navButton: {
    alignItems: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: 'relative' as const,
    minWidth: 60,
    // Ensure buttons block touch events from passing through
    pointerEvents: 'auto' as const,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    marginTop: 4,
  },
  badge: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#ffffff',
  },
  menuPanel: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#ffffff', // Added to optimize shadow rendering
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 12,
    zIndex: 1002,
    // Performance hints
    // @ts-ignore
    renderToHardwareTextureAndroid: true,
    // @ts-ignore
    shouldRasterizeIOS: true,
  },
  userSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 16,
  },
  userAvatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  userAvatarText: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuContent: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  menuBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 6,
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#ffffff',
  },
  closeHandle: {
    position: 'absolute' as const,
    bottom: 16,
    left: '50%' as const,
    marginLeft: -20,
    alignItems: 'center' as const,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
};
