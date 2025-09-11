import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://rcnpakhabqbqmnvuwjzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbnBha2hhYnFicW1udnV3anpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1ODI3ODcsImV4cCI6MjA0NDE1ODc4N30.IalgVgBGKcLkuypZqiuC99MMSYPDJ3vz7X4trWKiOiE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});