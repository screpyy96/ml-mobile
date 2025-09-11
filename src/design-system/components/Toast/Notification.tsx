/**
 * Design System - Notification Component
 * Individual notification item for lists
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../themes/ThemeProvider';
import { NotificationProps } from './types';

export const Notification: React.FC<NotificationProps> = ({
    title,
    message,
    timestamp,
    type = 'info',
    read = false,
    avatar,
    onPress,
    onMarkAsRead,
    onDelete,
    style,
    accessibilityLabel,
    testID,
}) => {
    const { theme } = useTheme();

    // Get notification colors based on type
    const getNotificationColors = () => {
        switch (type) {
            case 'success':
                return {
                    iconColor: theme.colors.status.success,
                    iconName: 'check-circle',
                    backgroundColor: theme.colors.status.success + '10',
                };
            case 'error':
                return {
                    iconColor: theme.colors.status.error,
                    iconName: 'error',
                    backgroundColor: theme.colors.status.error + '10',
                };
            case 'warning':
                return {
                    iconColor: theme.colors.status.warning,
                    iconName: 'warning',
                    backgroundColor: theme.colors.status.warning + '10',
                };
            case 'info':
            default:
                return {
                    iconColor: theme.colors.status.info,
                    iconName: 'info',
                    backgroundColor: theme.colors.status.info + '10',
                };
        }
    };

    const colors = getNotificationColors();

    const handlePress = () => {
        if (!read && onMarkAsRead) {
            onMarkAsRead();
        }
        onPress?.();
    };

    const handleMarkAsRead = (e: any) => {
        e.stopPropagation();
        onMarkAsRead?.();
    };

    const handleDelete = (e: any) => {
        e.stopPropagation();
        onDelete?.();
    };

    return (
        <TouchableOpacity
            style={[
                {
                    backgroundColor: read 
                        ? theme.colors.background.primary 
                        : colors.backgroundColor,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.secondary[200],
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                },
                style,
            ]}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || `Notification: ${title}`}
            accessibilityState={{ selected: !read }}
            testID={testID}
            activeOpacity={0.7}
        >
            {/* Avatar or Icon */}
            <View style={{ marginRight: theme.spacing.sm }}>
                {avatar ? (
                    <Image
                        source={avatar}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                        }}
                    />
                ) : (
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: colors.backgroundColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            name={colors.iconName}
                            size={20}
                            color={colors.iconColor}
                        />
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
                <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'flex-start',
                    marginBottom: theme.spacing.xs,
                }}>
                    <Text
                        style={{
                            ...theme.typography.body,
                            color: theme.colors.text.primary,
                            fontWeight: read ? '400' : '600',
                            flex: 1,
                        }}
                        numberOfLines={2}
                    >
                        {title}
                    </Text>
                    
                    {/* Unread indicator */}
                    {!read && (
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.colors.primary[500],
                                marginLeft: theme.spacing.xs,
                                marginTop: 6,
                            }}
                        />
                    )}
                </View>

                {message && (
                    <Text
                        style={{
                            ...theme.typography.bodySmall,
                            color: theme.colors.text.secondary,
                            marginBottom: theme.spacing.xs,
                            lineHeight: 18,
                        }}
                        numberOfLines={3}
                    >
                        {message}
                    </Text>
                )}

                {timestamp && (
                    <Text
                        style={{
                            ...theme.typography.caption,
                            color: theme.colors.text.tertiary,
                        }}
                    >
                        {timestamp}
                    </Text>
                )}
            </View>

            {/* Actions */}
            <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: theme.spacing.sm,
            }}>
                {!read && onMarkAsRead && (
                    <TouchableOpacity
                        onPress={handleMarkAsRead}
                        style={{
                            padding: theme.spacing.xs,
                            marginRight: theme.spacing.xs / 2,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Mark as read"
                    >
                        <Icon
                            name="check"
                            size={20}
                            color={theme.colors.text.secondary}
                        />
                    </TouchableOpacity>
                )}

                {onDelete && (
                    <TouchableOpacity
                        onPress={handleDelete}
                        style={{
                            padding: theme.spacing.xs,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Delete notification"
                    >
                        <Icon
                            name="close"
                            size={20}
                            color={theme.colors.text.secondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};