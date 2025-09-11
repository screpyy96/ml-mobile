import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { googleSignIn } from '../config/googleAuth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  needsProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileComplete, setNeedsProfileComplete] = useState(false);

  // Remove any stale Supabase auth tokens to avoid auto-refresh errors when logged out
  const purgeSupabaseSession = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sbKeys = keys.filter((k) => k.includes('sb-') && k.includes('-auth-token'));
      if (sbKeys.length) {
        await AsyncStorage.multiRemove(sbKeys);
        console.log('🧹 Supabase auth tokens purged from storage');
      }
    } catch (e) {
      console.warn('⚠️ Failed to purge Supabase session keys:', e);
    }
  };

  useEffect(() => {
    checkAuthState();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          await purgeSupabaseSession();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        // Handle invalid refresh token errors gracefully
        const msg = (error as any)?.message || '';
        if (typeof msg === 'string' && msg.toLowerCase().includes('invalid refresh token')) {
          await purgeSupabaseSession();
        }
        throw error;
      }
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        // No session -> ensure no stale tokens remain that could trigger refresh attempts
        await purgeSupabaseSession();
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('👤 Încărcare profil pentru user ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Eroare la încărcarea profilului:', error.message);
        throw error;
      }
      
      console.log('📋 Date profil găsite:', data);
      
      // Convertim role din 'worker'/'client' în 'meserias'/'client' pentru compatibilitate
      const userData: User & { address?: string; bio?: string } = {
        ...data,
        name: data.name || '',
        userType: data.role === 'worker' ? 'meserias' : data.role || 'client',
        avatar: data.avatar_url || data.avatar || undefined,
        isVerified: data.is_verified || false,
        createdAt: data.created_at || new Date().toISOString(),
        address: data.address || '',
        bio: data.bio || ''
      };
      
      console.log('🎯 User type convertit:', userData.userType);
      console.log('👤 User setat cu succes:', userData.name, '(', userData.userType, ')');
      
      setUser(userData);
      const incomplete = !userData.name || !userData.phone;
      setNeedsProfileComplete(incomplete);
    } catch (error) {
      console.error('❌ Eroare la încărcarea profilului:', error);
      // Setăm un user default pentru a evita erorile
      const defaultUser: User = {
        id: userId,
        email: '',
        name: 'User',
        userType: 'client',
        isVerified: false,
        createdAt: new Date().toISOString()
      };
      setUser(defaultUser);
      setNeedsProfileComplete(true);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Încercare de conectare pentru:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Eroare la autentificare:', error.message);
        throw error;
      }
      
      if (data.user) {
        console.log('✅ Autentificare reușită pentru user ID:', data.user.id);
        await loadUserProfile(data.user.id);
      }
    } catch (error) {
      console.error('❌ Eroare în procesul de conectare:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Convertim userType în role pentru tabela profiles
        const role = userData.userType === 'meserias' ? 'worker' : 'client';
        
        const newUser = {
          id: data.user.id,
          email,
          name: userData.name,
          phone: userData.phone,
          role: role,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([newUser]);

        if (profileError) throw profileError;
        
        // Setăm user-ul cu userType pentru compatibilitate
        setUser({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name || '',
          userType: userData.userType,
          isVerified: newUser.is_verified,
          createdAt: newUser.created_at,
          phone: newUser.phone
        } as User);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Începere proces deconectare...');
      
      // Sign out from Supabase and clear only auth-related storage
      await supabase.auth.signOut();
      // Also sign out from Google if previously used
      try {
        await googleSignIn.signOut();
      } catch (e) {
        // Non-fatal; continue
        console.warn('⚠️ Google Sign-Out optional step failed:', e);
      }
      setUser(null);
      // Avoid clearing entire AsyncStorage; remove only Supabase auth tokens
      await purgeSupabaseSession();
      
      console.log('✅ Deconectare reușită');
    } catch (error) {
      console.error('❌ Eroare la deconectare:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Convertim userType în role dacă este prezent
      const updateData: any = { ...userData };
      if (userData.userType) {
        updateData.role = userData.userType === 'meserias' ? 'worker' : 'client';
        delete updateData.userType;
      }
      if (userData.name) {
        updateData.name = userData.name;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
      const updated = { ...user, ...userData } as User;
      setUser(updated);
      const incomplete = !updated.name || !updated.phone;
      setNeedsProfileComplete(incomplete);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    needsProfileComplete,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
