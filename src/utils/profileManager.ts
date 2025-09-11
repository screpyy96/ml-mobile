import { supabase } from '../config/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  account_type?: 'client' | 'worker' | 'guest';
  role?: 'client' | 'worker' | 'guest';
  phone?: string;
  address?: string;
  bio?: string;
  rating?: number;
  total_jobs?: number;
  created_at: string;
  updated_at: string;
}

export const profileManager = {
  // Check if user profile exists
  checkProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error checking profile:', error);
      return null;
    }
  },

  // Create new user profile
  createProfile: async (userData: any): Promise<UserProfile | null> => {
    try {
      const profileData = {
        id: userData.id,
        email: userData.email,
        name: userData.user_metadata?.full_name || userData.user_metadata?.name || '',
        avatar_url: userData.user_metadata?.avatar_url || userData.user_metadata?.picture || '',
        role: 'guest' as const, // Default role - user needs to choose
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },

  // Get current user profile
  getCurrentProfile: async (): Promise<UserProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      return await profileManager.checkProfile(user.id);
    } catch (error) {
      console.error('Error getting current profile:', error);
      return null;
    }
  },

  // Ensure profile exists (check and create if needed)
  ensureProfile: async (userData: any): Promise<UserProfile | null> => {
    try {
      // Check if profile exists
      let profile = await profileManager.checkProfile(userData.id);
      
      if (!profile) {
        // Create new profile
        console.log('📝 Creating new user profile...');
        profile = await profileManager.createProfile(userData);
        
        if (profile) {
          console.log('✅ User profile created successfully');
        } else {
          console.error('❌ Failed to create user profile');
        }
      } else {
        console.log('✅ User profile already exists');
      }
      
      return profile;
    } catch (error) {
      console.error('Error ensuring profile:', error);
      return null;
    }
  },
};
