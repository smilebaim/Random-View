import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvihtymxpdqlpcyqmpzq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2aWh0eW14cGRxbHBjeXFtcHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTQ0MDAsImV4cCI6MjA1ODMzMDQwMH0.NWwHGKOrTLs7zb7pKgYvmVqDycjjFc8ullM_tYj756w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
  }
});