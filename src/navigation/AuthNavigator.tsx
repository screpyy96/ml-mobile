import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/auth/HomeScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ProfileCompleteScreen from '../screens/auth/ProfileCompleteScreen';
import { transitionPresets } from '../design-system/components/Navigation/transitions';

export type AuthStackParamList = {
  Home: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ProfileComplete: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' },
        ...transitionPresets.fade
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ ...transitionPresets.scale }}
      />
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ ...transitionPresets.scale }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ ...transitionPresets.slide }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ ...transitionPresets.slide }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ ...transitionPresets.modal }}
      />
      <Stack.Screen 
        name="ProfileComplete" 
        component={ProfileCompleteScreen}
        options={{ ...transitionPresets.slide }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;