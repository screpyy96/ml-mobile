import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { transitionPresets } from '../design-system/components/Navigation/transitions';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import JobsScreen from '../screens/main/JobsScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import JobDetailsScreen from '../screens/main/JobDetailsScreen';
import MeseriasProfileScreen from '../screens/main/MeseriasProfileScreen';
import CreateJobScreen from '../screens/main/CreateJobScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import WorkerDashboardScreen from '../screens/main/WorkerDashboardScreen';
import ClientDashboardScreen from '../screens/main/ClientDashboardScreen';
import ApplicationsScreen from '../screens/main/ApplicationsScreen';
import SavedJobsScreen from '../screens/main/SavedJobsScreen';
import ReviewsScreen from '../screens/main/ReviewsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import SubscriptionScreen from '../screens/main/SubscriptionScreen';
import JobSuccessScreen from '../screens/main/JobSuccessScreen';
import SubscriptionSuccessScreen from '../screens/main/SubscriptionSuccessScreen';
import CreditsSuccessScreen from '../screens/main/CreditsSuccessScreen';

// Removed MainTabParamList as we're using drawer navigation now

export type HomeStackParamList = {
  HomeIndex: undefined;
  JobDetails: { jobId: string };
  CreateJob: undefined;
  EditProfile: undefined;
  JobSuccess: undefined;
};

export type JobsStackParamList = {
  Jobs: undefined;
  JobDetails: { jobId: string };
  MeseriasProfile: { meseriasId: string; meseriasData?: any };
  EditProfile: undefined;
};

export type SearchStackParamList = {
  SearchIndex: { hideSearch?: boolean } | undefined;
  MeseriasProfile: { meseriasId: string; meseriasData?: any };
  EditProfile: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  WorkerDashboard: undefined;
  ClientDashboard: undefined;
  Jobs: { jobs: any[], onSave: (jobId: string) => void, onApply: (jobId: string) => void, availableJobsCount: number };
  Applications: { applications: any[], pendingApplicationsCount: number };
  SavedJobs: { jobs: any[], onSave: (jobId: string) => void, onApply: (jobId: string) => void, availableJobsCount: number };
  Reviews: { reviews: any[], totalReviewsCount: number };
  Settings: undefined;
  Subscription: undefined;
  EditProfile: undefined;
};

export type ProfileStackParamList = {
  ProfileIndex: undefined;
  EditProfile: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const JobsStack = createStackNavigator<JobsStackParamList>();
const SearchStack = createStackNavigator<SearchStackParamList>();
const DashboardStack = createStackNavigator<DashboardStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const SubscriptionStack = createStackNavigator();
const WorkerDashboardStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// WorkerDashboardStack
const WorkerDashboardStackNavigator: React.FC = () => {
  return (
    <WorkerDashboardStack.Navigator
      screenOptions={{
        headerShown: false,
        ...transitionPresets.default
      }}
    >
      <WorkerDashboardStack.Screen name="WorkerDashboard" component={WorkerDashboardScreen} />
      <WorkerDashboardStack.Screen name="Jobs" component={JobsScreen} />
      <WorkerDashboardStack.Screen name="Applications" component={ApplicationsScreen} />
      <WorkerDashboardStack.Screen name="SavedJobs" component={SavedJobsScreen} />
      <WorkerDashboardStack.Screen name="Reviews" component={ReviewsScreen} />
      <WorkerDashboardStack.Screen name="Settings" component={SettingsScreen} />
      <WorkerDashboardStack.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{ 
          headerShown: true, 
          title: 'Abonament',
          ...transitionPresets.slide
        }}
      />
      <WorkerDashboardStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          headerShown: true, 
          title: 'Editare Profil',
          ...transitionPresets.slide
        }}
      />
    </WorkerDashboardStack.Navigator>
  );
};

// Home Stack Navigator
const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        ...transitionPresets.default
      }}
    >
      <HomeStack.Screen name="HomeIndex" component={HomeScreen} />
      <HomeStack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ 
          headerShown: true, 
          title: 'Detalii lucrare',
          ...transitionPresets.slide
        }}
      />
      <HomeStack.Screen
        name="CreateJob"
        component={CreateJobScreen}
        options={{ 
          headerShown: true, 
          title: 'Cerere nouă',
          ...transitionPresets.modal
        }}
      />
      <HomeStack.Screen
        name="JobSuccess"
        component={JobSuccessScreen}
        options={{ 
          headerShown: false,
          ...transitionPresets.fade
        }}
      />
      <HomeStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          headerShown: true, 
          title: 'Editare Profil',
          ...transitionPresets.slide
        }}
      />
    </HomeStack.Navigator>
  );
};

// Jobs Stack Navigator
const JobsStackNavigator: React.FC = () => {
  return (
    <JobsStack.Navigator
      screenOptions={{
        headerShown: false,
        ...transitionPresets.default
      }}
    >
      <JobsStack.Screen name="Jobs" component={JobsScreen} />
      <JobsStack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ 
          headerShown: true, 
          title: 'Detalii lucrare',
          ...transitionPresets.slide
        }}
      />
      <JobsStack.Screen
        name="MeseriasProfile"
        component={MeseriasProfileScreen}
        options={{ 
          headerShown: true, 
          title: 'Profil meseriaș',
          ...transitionPresets.slide
        }}
      />
      <JobsStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          headerShown: true, 
          title: 'Editare Profil',
          ...transitionPresets.slide
        }}
      />
    </JobsStack.Navigator>
  );
};

// Subscription Stack Navigator
const SubscriptionStackNavigator: React.FC = () => {
  return (
    <SubscriptionStack.Navigator
      screenOptions={{
        headerShown: false,
        ...transitionPresets.default
      }}
    >
      <SubscriptionStack.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{ 
          headerShown: true, 
          title: 'Abonament',
          ...transitionPresets.slide
        }}
      />
      <SubscriptionStack.Screen 
        name="SubscriptionSuccess" 
        component={SubscriptionSuccessScreen}
        options={{ 
          headerShown: false,
          ...transitionPresets.fade
        }}
      />
      <SubscriptionStack.Screen 
        name="CreditsSuccess" 
        component={CreditsSuccessScreen}
        options={{ 
          headerShown: false,
          ...transitionPresets.fade
        }}
      />
    </SubscriptionStack.Navigator>
  );
};

// Search Stack Navigator
const SearchStackNavigator: React.FC = () => {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
        ...transitionPresets.default
      }}
    >
      <SearchStack.Screen 
        name="SearchIndex" 
        component={SearchScreen}
        initialParams={{ hideSearch: false }}
      />
      <SearchStack.Screen
        name="MeseriasProfile"
        component={MeseriasProfileScreen}
        options={{ 
          headerShown: true, 
          title: 'Profil meseriaș',
          ...transitionPresets.slide
        }}
      />
      <SearchStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          headerShown: true, 
          title: 'Editare Profil',
          ...transitionPresets.slide
        }}
      />
    </SearchStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        ...transitionPresets.default
      }}
    >
      <ProfileStack.Screen name="ProfileIndex" component={ProfileScreen} />
      <ProfileStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          headerShown: true, 
          title: 'Editare Profil',
          ...transitionPresets.slide
        }}
      />
    </ProfileStack.Navigator>
  );
};

// Dashboard Stack Navigator
const DashboardStackNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Default component if user is not loaded yet
  const getDashboardComponent = () => {
    if (loading || !user) return JobsScreen;
    
    switch (user.userType) {
      case 'meserias':
        return WorkerDashboardStackNavigator;
      case 'client':
        return ClientDashboardScreen;
      default:
        return JobsScreen;
    }
  };
  
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerShown: false,
        ...transitionPresets.default
      }}
    >
      <DashboardStack.Screen 
        name="DashboardIndex" 
        component={getDashboardComponent()}
      />
      <DashboardStack.Screen
        name="WorkerDashboard"
        component={WorkerDashboardStackNavigator}
        options={{ 
          headerShown: false,
          ...transitionPresets.fade
        }}
      />
      <DashboardStack.Screen
        name="ClientDashboard"
        component={ClientDashboardScreen}
        options={{ 
          headerShown: false,
          ...transitionPresets.fade
        }}
      />
      <DashboardStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ 
          headerShown: true, 
          title: 'Editare Profil',
          ...transitionPresets.slide
        }}
      />
    </DashboardStack.Navigator>
  );
};

const MainTabs: React.FC = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          let icon = 'home';
          switch (route.name) {
            case 'Home':
              icon = 'home';
              break;
            case 'Search':
              icon = 'search';
              break;
            case 'Dashboard':
              icon = user?.userType === 'meserias' ? 'dashboard' : 'work';
              break;
            case 'Messages':
              icon = 'chat';
              break;
            case 'Profile':
              icon = 'person';
              break;
            default:
              icon = 'home';
          }
          return <Icon name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Acasă' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{
          tabBarLabel: user?.userType === 'meserias' ? 'Alți meseriași' : 'Meșeriași',
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{
          tabBarLabel: user?.userType === 'meserias' ? 'Dashboard' : 'Cereri',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarLabel: 'Mesaje' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
