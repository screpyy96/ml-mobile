/**
 * Design System - Modern Bottom Navigation
 * Clean bottom navigation with 5 main buttons and drawer menu
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { useAuth } from '../../../context/AuthContext';

const { height: screenHeight } = Dimensions.get('window');
const DRAWER_HEIGHT = screenHeight * 0.7;

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

export const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({
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
          route: 'HomeStack',
        },
        {
          key: 'search',
          label: 'Joburi',
          icon: 'search',
          route: 'JobsStack',
        },
        {
          key: 'meserias',
          label: 'Meseriași',
          icon: 'people',
          route: 'SearchStack',
        },
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          route: 'DashboardStack',
        },
        {
          key: 'profile',
          label: 'Meniu',
          icon: 'menu',
          route: 'ProfileStack',
        },
      ];
    } else {
      // Client navigation items
      return [
        {
          key: 'home',
          label: 'Acasă',
          icon: 'home',
          route: 'HomeStack',
        },
        {
          key: 'search',
          label: 'Meșeriași',
          icon: 'search',
          route: 'SearchStack',
        },
        {
          key: 'dashboard',
          label: 'Cere ofertă',
          icon: 'add-circle-outline',
          route: 'DashboardStack',
        },
        {
          key: 'jobs',
          label: 'Cereri',
          icon: 'assignment',
          route: 'JobsStack',
        },
        {
          key: 'profile',
          label: 'Meniu',
          icon: 'menu',
          route: 'ProfileStack',
        },
      ];
    }
  };

  const drawerItems = getDrawerItems();

  // Menu items based on user type
  const getMenuItems = (): DrawerItem[] => {
    console.log('🔍 DrawerNavigator - Menu items for user type:', user?.userType);
    if (user?.userType === 'meserias') {
      return [
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          route: 'DashboardStack',
        },
        {
          key: 'jobs',
          label: 'Joburile mele',
          icon: 'work',
          route: 'JobsStack',
        },
        {
          key: 'meserias',
          label: 'Alți meseriași',
          icon: 'people',
          route: 'SearchStack',
        },
        {
          key: 'earnings',
          label: 'Câștigurile mele',
          icon: 'account-balance-wallet',
          route: 'EarningsStack',
        },
        {
          key: 'reviews',
          label: 'Recenziile mele',
          icon: 'star',
          route: 'ReviewsStack',
        },
        {
          key: 'notifications',
          label: 'Notificări',
          icon: 'notifications',
          route: 'NotificationsStack',
          badge: 3,
        },
        {
          key: 'messages',
          label: 'Mesaje',
          icon: 'message',
          route: 'MessagesStack',
          badge: 5,
        },
        {
          key: 'profile',
          label: 'Profilul meu',
          icon: 'person',
          route: 'ProfileStack',
        },
        {
          key: 'subscription',
          label: 'Abonament',
          icon: 'star',
          route: 'SubscriptionStack',
        },
        {
          key: 'settings',
          label: 'Setări',
          icon: 'settings',
          route: 'SettingsStack',
        },
        {
          key: 'help',
          label: 'Ajutor',
          icon: 'help',
          route: 'HelpStack',
        },
        {
          key: 'logout',
          label: 'Deconectare',
          icon: 'logout',
          route: 'LogoutStack',
        },
      ];
    } else {
      // Client menu items
      return [
        {
          key: 'requests',
          label: 'Cererile mele',
          icon: 'assignment',
          route: 'RequestsStack',
        },
        {
          key: 'saved',
          label: 'Meseriași salvați',
          icon: 'favorite',
          route: 'SavedStack',
        },
        {
          key: 'history',
          label: 'Istoric lucrări',
          icon: 'history',
          route: 'HistoryStack',
        },
        {
          key: 'notifications',
          label: 'Notificări',
          icon: 'notifications',
          route: 'NotificationsStack',
          badge: 2,
        },
        {
          key: 'messages',
          label: 'Mesaje',
          icon: 'message',
          route: 'MessagesStack',
          badge: 1,
        },
        {
          key: 'profile',
          label: 'Profilul meu',
          icon: 'person',
          route: 'ProfileStack',
        },
        {
          key: 'subscription',
          label: 'Abonament',
          icon: 'star',
          route: 'SubscriptionStack',
        },
        {
          key: 'settings',
          label: 'Setări',
          icon: 'settings',
          route: 'SettingsStack',
        },
        {
          key: 'help',
          label: 'Ajutor',
          icon: 'help',
          route: 'HelpStack',
        },
        {
          key: 'logout',
          label: 'Deconectare',
          icon: 'logout',
          route: 'LogoutStack',
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  // Defensive: if route changes while drawer is open, force-close it
  React.useEffect(() => {
    if (isOpen) {
      panY.setValue(0);
      onClose();
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
      ]).start();
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
    if (item.key === 'profile') {
      // Toggle menu when Menu button is pressed
      if (isOpen) {
        // Reset pan and close
        panY.setValue(0);
        onClose();
      } else {
        onOpen();
      }
    } else {
      // Close first, then navigate (ensures drawer hides immediately)
      panY.setValue(0);
      onClose();
      onNavigate(item.route);
    }
  };

  const handleMenuItemPress = (item: DrawerItem) => {
    console.log('🔥 DrawerNavigator - Menu item pressed:', item.key, item.route);
    console.log('🔥 DrawerNavigator - Drawer is open:', isOpen);
    
    // Close drawer immediately - this should trigger the animation via useEffect
    panY.setValue(0);
    onClose();
    
    // Navigate immediately
    onNavigate(item.route);
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
        >
          <TouchableOpacity
            style={styles.backdropTouch}
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Fixed Bottom Navigation */}
      <View style={[styles.bottomNavigation, { paddingBottom: insets.bottom }]}>
        {drawerItems.map((item) => {
          const isActive = currentRoute === item.route || (item.key === 'profile' && isOpen);
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
              <Icon
                name={item.icon}
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
                  <Icon
                    name={item.icon}
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
          onPress={onClose}
          activeOpacity={0.7}
        >
          <View style={[styles.handleBar, { backgroundColor: theme.colors.text.secondary }]} />
        </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = {
  backdrop: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdropTouch: {
    flex: 1,
  },
  bottomNavigation: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navButton: {
    alignItems: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: 'relative' as const,
    minWidth: 60,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 1002,
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
