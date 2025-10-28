import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('⚠️  Supabase credentials are missing. Running in DEVELOPMENT MODE with mock data.');
  console.warn('📝 To use real backend, create a .env file with:');
  console.warn('   VITE_SUPABASE_URL=your_supabase_url');
  console.warn('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : null as any; // Mock client for development
