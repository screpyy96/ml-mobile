import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../constants/colors';
import { Notification } from '../../../types';

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  return (
    <>
      {notifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificări recente</Text>
          {notifications.slice(0, 2).map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <Icon name="notifications" size={20} color={colors.primary} />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>{notification.message || 'Notificare'}</Text>
                <Text style={styles.notificationDate}>
                  {notification.created_at ? new Date(notification.created_at).toLocaleDateString('ro-RO') : 'Data necunoscută'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    marginLeft: 10,
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default NotificationList;
