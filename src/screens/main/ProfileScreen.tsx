import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigation/MainNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<DashboardStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    // Redirect immediately to EditProfile screen which has the full implementation
    navigation.replace('EditProfile');
  }, [navigation]);

  // This component will never render as it immediately redirects
  return null;
};

export default ProfileScreen;

