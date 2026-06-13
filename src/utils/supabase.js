/* eslint-disable no-undef */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder-ueibtdpzixmirngpapus.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
  console.warn("Warning: Missing Supabase environment variables. Using placeholder for build time.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);