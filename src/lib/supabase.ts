import { createClient } from '@jsr/supabase__supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdedhluxoicizxqojadx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZWRobHV4b2ljaXp4cW9qYWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjkwNDAsImV4cCI6MjA5MTIwNTA0MH0.SI9KL0LiGVVm_TWB4n6hr0rwKSh_IUWmo4qx8aNqXmw';

// Single client using anon key.
// Write access is gated by Supabase RLS policies:
//   - anon role      → SELECT only (public pages)
//   - authenticated  → SELECT / INSERT / UPDATE / DELETE (admin pages after login)
// After supabase.auth.signInWithPassword(...), the same client automatically
// uses the user's JWT and satisfies authenticated policies.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
