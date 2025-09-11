import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logoutTest = {
  // Testează procesul complet de logout
  testLogoutProcess: async () => {
    try {
      console.log('🧪 Începere test logout...');
      
      // 1. Verifică starea inițială
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📋 Sesiune inițială:', session ? 'Activă' : 'Inactivă');
      
      if (!session) {
        console.log('⚠️ Nu există sesiune activă pentru test');
        return false;
      }
      
      // 2. Testează deconectarea
      console.log('🚪 Testare deconectare...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Eroare la deconectare:', error.message);
        return false;
      }
      
      console.log('✅ Deconectare reușită');
      
      // 3. Verifică starea după deconectare
      const { data: { session: newSession } } = await supabase.auth.getSession();
      console.log('📋 Sesiune după deconectare:', newSession ? 'Activă' : 'Inactivă');
      
      // 4. Testează AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      console.log('🗂️ Chei AsyncStorage după deconectare:', keys.length);
      
      if (keys.length === 0) {
        console.log('✅ AsyncStorage gol (corect)');
      } else {
        console.log('⚠️ AsyncStorage conține încă date:', keys);
      }
      
      console.log('🎉 Test logout completat cu succes!');
      return true;
      
    } catch (error) {
      console.error('❌ Eroare în testul de logout:', error);
      return false;
    }
  },

  // Verifică dacă utilizatorul este deconectat
  checkLogoutStatus: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const keys = await AsyncStorage.getAllKeys();
      
      const status = {
        isLoggedOut: !session,
        hasLocalData: keys.length > 0,
        sessionExists: !!session,
        localDataCount: keys.length
      };
      
      console.log('🔍 Status logout:', status);
      return status;
      
    } catch (error) {
      console.error('❌ Eroare la verificarea status-ului:', error);
      return null;
    }
  },

  // Simulează logout-ul din aplicație
  simulateAppLogout: async () => {
    try {
      console.log('🎭 Simulare logout din aplicație...');
      
      // 1. Deconectare Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // 2. Ștergere AsyncStorage
      await AsyncStorage.clear();
      
      // 3. Verificare finală
      const status = await logoutTest.checkLogoutStatus();
      
      if (status?.isLoggedOut && !status?.hasLocalData) {
        console.log('✅ Simulare logout reușită!');
        return true;
      } else {
        console.log('❌ Simulare logout eșuată:', status);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Eroare în simularea logout-ului:', error);
      return false;
    }
  }
};
