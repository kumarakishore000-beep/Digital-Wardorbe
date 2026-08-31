import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://vldliftotrfkbxymeuox.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZGxpZnRvdHJma2J4eW1ldW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MDEzMTYsImV4cCI6MjEwMzM3NzMxNn0.Hslqs8VU53WJgY-yMTz0v-3YH6ojWvDUBXO89azhfU8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
