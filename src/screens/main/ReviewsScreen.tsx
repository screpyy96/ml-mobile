import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { Review } from '../../types';
import ReviewList from './components/ReviewList';

type RootStackParamList = {
  WorkerDashboard: undefined;
  Reviews: { reviews: Review[], totalReviewsCount: number };
};

type ReviewsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Reviews'
>;

interface ReviewsScreenProps {
  route?: {
    params?: {
      reviews?: Review[];
      totalReviewsCount?: number;
    };
  };
}

const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ route }) => {
  // Safely extract params with defaults
  const params = route?.params || {};
  const { 
    reviews = [], 
    totalReviewsCount = 0 
  } = params;
  
  const navigation = useNavigation<ReviewsScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <ReviewList
        reviews={reviews}
        onSeeAll={() => {}}
        totalReviewsCount={totalReviewsCount}
        showSeeAll={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: 20,
  },
});

export default ReviewsScreen;
