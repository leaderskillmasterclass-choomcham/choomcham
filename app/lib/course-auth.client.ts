import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://upxypufbqvtmokxeutrt.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVweHlwdWZicXZ0bW9reGV1dHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MjM5MDMsImV4cCI6MjEwMzE5OTkwM30.A3pGgeeySw6bPfdYlHMCIynQHbFV7ZEzSe31yB7z0XY";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const courseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: "choomcham-course-auth",
    persistSession: true,
    autoRefreshToken: true,
  },
});

