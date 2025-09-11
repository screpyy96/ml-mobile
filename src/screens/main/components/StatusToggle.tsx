import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../constants/colors';

interface StatusToggleProps {
  isOnline: boolean;
  toggleOnlineStatus: () => void;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ isOnline, toggleOnlineStatus }) => {
  return (
    <View style={styles.section}>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Icon
            name="circle"
            size={12}
            color={isOnline ? colors.success : colors.error}
          />
          <Text style={styles.statusTitle}>
            {isOnline ? 'Disponibil pentru lucru' : 'Indisponibil'}
          </Text>
        </View>
        <Text style={styles.statusDescription}>
          {isOnline
            ? 'Clienții pot să te contacteze pentru lucrări noi'
            : 'Nu vei primi notificări pentru joburi noi'}
        </Text>
        <TouchableOpacity
          style={[
            styles.statusToggle,
            { backgroundColor: isOnline ? colors.errorLight : colors.successLight },
          ]}
          onPress={toggleOnlineStatus}
        >
          <Text
            style={[
              styles.statusToggleText,
              { color: isOnline ? colors.error : colors.success },
            ]}
          >
            {isOnline ? 'Marchează ca indisponibil' : 'Marchează ca disponibil'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 5,
  },
  statusDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  statusToggle: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  statusToggleText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default StatusToggle;
