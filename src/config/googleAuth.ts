import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // Web Client ID pentru Supabase
    webClientId: '447522045620-3o02ugei8ghntm0fhld38tl18shgpef1.apps.googleusercontent.com',
    // iOS Client ID pentru aplicația iOS
    iosClientId: '447522045620-mr3kmgt80oplbeocm7m4hsoiq4kv242n.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
  });
};

// Google Sign-In helper functions
export const googleSignIn = {
  // Check if user is signed in
  isSignedIn: async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser !== null;
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      return false;
    }
  },

  // Sign in with Google
  signIn: async () => {
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Sign in and get user info
      const userInfo = await GoogleSignin.signIn();
      return userInfo;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google Sign-Out error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      return await GoogleSignin.getCurrentUser();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get tokens
  getTokens: async () => {
    try {
      return await GoogleSignin.getTokens();
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw error;
    }
  },
};
