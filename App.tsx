import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/design-system/themes/ThemeProvider';
import { ToastProvider } from './src/design-system/components/Toast/ToastProvider';
import { theme } from './src/constants/theme';
// Optional: splash control (will work after installing react-native-bootsplash)
// @ts-ignore - allow optional import if not installed yet
let RNBootSplash: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  RNBootSplash = require('react-native-bootsplash');
} catch {}

function App() {
  useEffect(() => {
    // Hide splash when app is ready (if bootsplash is installed)
    if (RNBootSplash && RNBootSplash.hide) {
      RNBootSplash.hide({ fade: true });
    }
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme="light">
        <ToastProvider>
          <PaperProvider theme={theme}>
            <AuthProvider>
              <NavigationContainer>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <AppNavigator />
              </NavigationContainer>
            </AuthProvider>
          </PaperProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
