import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured with valid credentials (not placeholders)
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  // Check if it's not a placeholder
  if (url.includes('your_supabase') || url === 'your_supabase_project_url') return false;
  // Check if it's a valid HTTP/HTTPS URL
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidKey = (key: string): boolean => {
  if (!key) return false;
  // Check if it's not a placeholder
  if (key.includes('your_supabase') || key === 'your_supabase_anon_key') return false;
  // Supabase keys are usually long
  return key.length > 20;
};

export const isSupabaseConfigured = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('⚠️  Supabase credentials are missing. Running in DEVELOPMENT MODE with mock data.');
  console.warn('📝 To use real backend, create a .env file with:');
  console.warn('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('   VITE_SUPABASE_ANON_KEY=your_actual_anon_key');
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
