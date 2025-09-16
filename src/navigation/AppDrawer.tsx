import React, { useState, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { DrawerNavigator } from '../design-system/components/Navigation/DrawerNavigator';
import { colors } from '../constants/colors';
import { DrawerProvider } from './DrawerContext';
import { setDrawerControls } from './drawerControl';

interface Props {
  children: React.ReactNode;
}

export const AppDrawer: React.FC<Props> = ({ children }) => {
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);

  const currentRoute = 'Home'; // Simplified: no longer tracks route

  const handleNavigate = (route: string) => {
    // Route names must match Tab.Screen names defined in MainNavigator
    setOpen(false);
    navigation.navigate(route as never);
  };

  // Set drawer controls for global access
  useEffect(() => {
    setDrawerControls({ toggle: () => setOpen((v) => !v), open: () => setOpen(true), close: () => setOpen(false) });
  }, []);


  return (
    <DrawerProvider value={{ openDrawer: () => setOpen(true), closeDrawer: () => setOpen(false), toggleDrawer: () => setOpen((v) => !v) }}>
      {children}
      <View pointerEvents={open ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
        <DrawerNavigator
          isOpen={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onNavigate={handleNavigate}
          currentRoute={currentRoute}
        />
      </View>
    </DrawerProvider>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 90, // above tab bar
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 100,
  },
});

export default AppDrawer;
