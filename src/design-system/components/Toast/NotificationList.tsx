/**
 * Design System - NotificationList Component
 * List container for notifications with actions
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { Notification } from './Notification';
import { NotificationListProps } from './types';

export const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    onNotificationPress,
    onMarkAsRead,
    onDelete,
    onClearAll,
    style,
    testID,
}) => {
    const { theme } = useTheme();

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationPress = (notification: any) => {
        onNotificationPress?.(notification);
    };

    const handleMarkAsRead = (id: string) => {
        onMarkAsRead?.(id);
    };

    const handleDelete = (id: string) => {
        onDelete?.(id);
    };

    const handleClearAll = () => {
        onClearAll?.();
    };

    if (notifications.length === 0) {
        return (
            <View
                style={[
                    {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: theme.spacing.xl,
                    },
                    style,
                ]}
                testID={testID}
            >
                <Icon
                    name="notifications-none"
                    size={64}
                    color={theme.colors.text.tertiary}
                    style={{ marginBottom: theme.spacing.md }}
                />
                <Text
                    style={{
                        ...theme.typography.h3,
                        color: theme.colors.text.secondary,
                        textAlign: 'center',
                        marginBottom: theme.spacing.sm,
                    }}
                >
                    No notifications
                </Text>
                <Text
                    style={{
                        ...theme.typography.body,
                        color: theme.colors.text.tertiary,
                        textAlign: 'center',
                    }}
                >
                    You're all caught up! New notifications will appear here.
                </Text>
            </View>
        );
    }

    return (
        <View style={[{ flex: 1 }, style]} testID={testID}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.secondary[200],
                    backgroundColor: theme.colors.background.secondary,
                }}
            >
                <View>
                    <Text
                        style={{
                            ...theme.typography.h3,
                            color: theme.colors.text.primary,
                        }}
                    >
                        Notifications
                    </Text>
                    {unreadCount > 0 && (
                        <Text
                            style={{
                                ...theme.typography.caption,
                                color: theme.colors.text.secondary,
                            }}
                        >
                            {unreadCount} unread
                        </Text>
                    )}
                </View>

                {notifications.length > 0 && onClearAll && (
                    <TouchableOpacity
                        onPress={handleClearAll}
                        style={{
                            paddingHorizontal: theme.spacing.sm,
                            paddingVertical: theme.spacing.xs,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Clear all notifications"
                    >
                        <Text
                            style={{
                                ...theme.typography.bodySmall,
                                color: theme.colors.primary[500],
                                fontWeight: '500' as const,
                            }}
                        >
                            Clear All
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Notifications List */}
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        title={notification.title}
                        message={notification.message}
                        timestamp={notification.timestamp}
                        type={notification.type}
                        read={notification.read}
                        avatar={notification.avatar}
                        onPress={() => handleNotificationPress(notification)}
                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                        onDelete={() => handleDelete(notification.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};