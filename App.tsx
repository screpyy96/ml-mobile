import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/design-system/themes/ThemeProvider';
import { ToastProvider } from './src/design-system/components/Toast/ToastProvider';
import { theme } from './src/constants/theme';

function App() {
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
