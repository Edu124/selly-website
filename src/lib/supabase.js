import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project URL and anon key
const SUPABASE_URL  = "https://ekughxkikjzkimadyyuk.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdWdoeGtpa2p6a2ltYWR5eXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODkxNzQsImV4cCI6MjA5MjE2NTE3NH0.RMROZ2GAcDC6yxY8YjLW3RmyUk2c5G6HnzQry4qA2xs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
