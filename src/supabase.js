import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ozlvbjzsnkkyjpegpmai.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bHZianpzbmtreWpwZWdwbWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5Njk3MzUsImV4cCI6MjA5MzU0NTczNX0.6yLJHdWWqZLTaZvCs8tCPgglZhemUL5BEHLI32_cwuc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
