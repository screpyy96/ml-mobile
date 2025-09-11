import { supabase } from '../config/supabase';

export const debugAuth = {
  // Verifică structura tabelei profiles
  checkProfilesTable: async () => {
    try {
      console.log('🔍 Verificare structură tabelă profiles...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('❌ Eroare la verificarea tabelei profiles:', error.message);
        return false;
      }
      
      console.log('✅ Tabela profiles există și este accesibilă');
      console.log('📋 Structura primului rând:', data?.[0] ? Object.keys(data[0]) : 'Tabela este goală');
      
      return true;
    } catch (error) {
      console.error('❌ Eroare la verificarea tabelei:', error);
      return false;
    }
  },

  // Verifică utilizatorii existenți
  listUsers: async () => {
    try {
      console.log('👥 Listare utilizatori din tabela profiles...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, role, created_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Eroare la listarea utilizatorilor:', error.message);
        return;
      }
      
      console.log('📋 Utilizatori găsiți:', data?.length || 0);
      data?.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
      
    } catch (error) {
      console.error('❌ Eroare la listarea utilizatorilor:', error);
    }
  },

  // Testează logarea pentru un utilizator specific
  testLogin: async (email: string, password: string) => {
    try {
      console.log(`🔐 Testare logare pentru: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Eroare la testarea logării:', error.message);
        return false;
      }
      
      console.log('✅ Logare reușită pentru test');
      console.log('👤 User ID:', data.user?.id);
      
      // Verifică profilul
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('❌ Eroare la încărcarea profilului:', profileError.message);
        } else {
          console.log('📋 Profil găsit:', profile);
          console.log('🎯 Rol:', profile.role);
        }
      }
      
      // Deconectează pentru test
      await supabase.auth.signOut();
      console.log('🚪 Deconectat după test');
      
      return true;
    } catch (error) {
      console.error('❌ Eroare în testarea logării:', error);
      return false;
    }
  }
};
