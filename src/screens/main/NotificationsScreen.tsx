import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Screen } from '../../design-system';
import { colors } from '../../constants/colors';

const NotificationsScreen: React.FC = () => {
  return (
    <Screen backgroundColor={colors.background}>
      <ScrollView>
        <Text style={styles.placeholder}>Ecran notificări - în dezvoltare</Text>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  placeholder: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default NotificationsScreen;
