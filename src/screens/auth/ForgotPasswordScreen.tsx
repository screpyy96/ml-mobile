import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Screen } from '../../design-system';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { supabase } from '../../config/supabase';
import { colors } from '../../constants/colors';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Eroare', 'Te rog introdu adresa de email');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      setSent(true);
      Alert.alert(
        'Email trimis',
        'Verifică-ți emailul pentru instrucțiunile de resetare a parolei',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Eroare', error.message || 'A apărut o eroare');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={colors.background}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require('../../../temp-icons/logo-1024.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Resetează parola</Text>
          <Text style={styles.subtitle}>
            Introdu adresa de email și îți vom trimite instrucțiunile pentru resetarea parolei
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            disabled={sent}
          />

          <Button
            mode="contained"
            onPress={handleResetPassword}
            loading={loading}
            disabled={loading || sent}
            style={styles.resetButton}
            contentStyle={styles.buttonContent}
          >
            {sent ? 'Email trimis' : 'Trimite instrucțiuni'}
          </Button>
        </View>

        <View style={styles.footer}>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
          >
            Înapoi la conectare
          </Button>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 40,
  },
  input: {
    marginBottom: 24,
  },
  resetButton: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
  },
});

export default ForgotPasswordScreen;
