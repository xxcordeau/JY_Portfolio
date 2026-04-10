import { createClient } from '@jsr/supabase__supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdedhluxoicizxqojadx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZWRobHV4b2ljaXp4cW9qYWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjkwNDAsImV4cCI6MjA5MTIwNTA0MH0.SI9KL0LiGVVm_TWB4n6hr0rwKSh_IUWmo4qx8aNqXmw';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZWRobHV4b2ljaXp4cW9qYWR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYyOTA0MCwiZXhwIjoyMDkxMjA1MDQwfQ.t9e-5X7dBjttY0co5fH_RZUwDIkSoktjZyGJ4Va20JM';

// Public read-only client (used by public-facing pages, anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service_role key – bypasses RLS.
// ONLY use this from the admin editor routes. Never expose from public pages.
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
