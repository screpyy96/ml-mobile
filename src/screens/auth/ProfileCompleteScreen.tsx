import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const ProfileCompleteScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useAuth();
  const [role, setRole] = useState<'client' | 'meserias'>(user?.userType === 'meserias' ? 'meserias' : 'client');
  const [name, setName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [address, setAddress] = useState<string>(user?.address || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateProfile({
        name,
        phone,
        address,
        bio,
        userType: role === 'meserias' ? 'meserias' : 'client',
      });
      // După completare mergem spre Main (Dashboard)
      // @ts-ignore
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e) {
      console.error('Failed to complete profile', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Completează profilul</Text>

        <Text style={styles.label}>Rol</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.chip, role === 'client' && styles.chipActive]}
            onPress={() => setRole('client')}
          >
            <Text style={[styles.chipText, role === 'client' && styles.chipTextActive]}>Client</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, role === 'meserias' && styles.chipActive]}
            onPress={() => setRole('meserias')}
          >
            <Text style={[styles.chipText, role === 'meserias' && styles.chipTextActive]}>Meseriaș</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nume</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Numele tău"
          style={styles.input}
        />

        <Text style={styles.label}>Telefon</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="07xxxxxxxx"
          style={styles.input}
        />

        <Text style={styles.label}>Adresă</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Oraș, stradă..."
          style={styles.input}
        />

        <Text style={styles.label}>Descriere</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Spune-ne despre tine"
          style={[styles.input, { height: 100 }]} multiline
        />

        <TouchableOpacity style={[styles.button, submitting && { opacity: 0.6 }]} onPress={onSubmit} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Se salvează...' : 'Finalizează profilul'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Înapoi</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { color: '#111827' },
  chipTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  button: { marginTop: 20, backgroundColor: '#111827', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  linkBtn: { alignItems: 'center', marginTop: 12 },
  linkText: { color: '#6b7280' },
});

export default ProfileCompleteScreen;
