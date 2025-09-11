import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

const MessagesScreen: React.FC = () => {
  const mockConversations = [
    {
      id: '1',
      name: 'Ion Popescu',
      lastMessage: 'Mulțumesc pentru lucrare, totul arată perfect!',
      timestamp: '10:30',
      unreadCount: 0,
      avatar: '👨‍🔧',
      isOnline: true,
      jobTitle: 'Reparație robinet bucătărie',
    },
    {
      id: '2',
      name: 'Maria Ionescu',
      lastMessage: 'Când puteți să veniți pentru evaluare?',
      timestamp: '09:15',
      unreadCount: 2,
      avatar: '👩‍🔧',
      isOnline: false,
      jobTitle: 'Instalare priză electrică',
    },
    {
      id: '3',
      name: 'Gheorghe Dumitrescu',
      lastMessage: 'Am trimis oferta, vă rog să o verificați',
      timestamp: 'Ieri',
      unreadCount: 1,
      avatar: '👨‍🎨',
      isOnline: true,
      jobTitle: 'Vopsire cameră copil',
    },
    {
      id: '4',
      name: 'Ana Popescu',
      lastMessage: 'Perfect, ne vedem mâine la ora 14:00',
      timestamp: 'Ieri',
      unreadCount: 0,
      avatar: '👩',
      isOnline: false,
      jobTitle: 'Reparație ușă intrare',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesaje</Text>
      </View>

      <ScrollView style={styles.content}>
        {mockConversations.map((conversation) => (
          <Card key={conversation.id} style={styles.conversationCard}>
            <Card.Content style={styles.conversationContent}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{conversation.avatar}</Text>
                {conversation.isOnline && (
                  <View style={styles.onlineIndicator} />
                )}
              </View>
              
              <View style={styles.conversationDetails}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationName}>{conversation.name}</Text>
                  <View style={styles.conversationMeta}>
                    <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                    {conversation.unreadCount > 0 && (
                      <Badge style={styles.unreadBadge}>
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </View>
                </View>
                
                <Text style={styles.jobTitle}>{conversation.jobTitle}</Text>
                
                <Text 
                  style={[
                    styles.lastMessage,
                    conversation.unreadCount > 0 && styles.unreadMessage
                  ]}
                  numberOfLines={2}
                >
                  {conversation.lastMessage}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}

        {mockConversations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💬</Text>
            <Text style={styles.emptyStateTitle}>Niciun mesaj încă</Text>
            <Text style={styles.emptyStateDescription}>
              Mesajele cu meșteșugarii și clienții vor apărea aici
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  conversationCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 1,
  },
  conversationContent: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 40,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  conversationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    color: '#ffffff',
    fontSize: 10,
  },
  jobTitle: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default MessagesScreen;