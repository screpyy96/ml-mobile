import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Edge = 'top' | 'bottom' | 'left' | 'right';

interface ScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  backgroundColor?: string;
  style?: ViewStyle;
}

// Simple, reusable SafeArea layout wrapper
export const Screen: React.FC<ScreenProps> = ({
  children,
  edges = ['top', 'bottom'],
  backgroundColor = '#ffffff',
  style,
}) => {
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;

