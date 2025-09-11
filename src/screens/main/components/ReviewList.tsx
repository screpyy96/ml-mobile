import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../constants/colors';
import { Review } from '../../../types';

interface ReviewListProps {
  reviews: Review[];
  onSeeAll: () => void;
  totalReviewsCount: number;
  showSeeAll?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onSeeAll, totalReviewsCount, showSeeAll = true }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recenzii recente</Text>
        {showSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>{`Vezi toate (${totalReviewsCount})`}</Text>
          </TouchableOpacity>
        )}
      </View>
      {reviews.length > 0 ? (
        reviews.slice(0, 2).map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.client?.name || 'Client'}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name={star <= review.rating ? 'star' : 'star-border'}
                    size={16}
                    color={colors.warning}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewComment} numberOfLines={3}>
              {review.comment || 'Fără comentariu'}
            </Text>
            <Text style={styles.reviewDate}>
              {review.created_at ? new Date(review.created_at).toLocaleDateString('ro-RO') : 'Data necunoscută'}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="star-border" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>Nu ai recenzii încă</Text>
          <Text style={styles.emptyStateSubtext}>Finalizează lucrări pentru a primi recenzii</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ReviewList;
