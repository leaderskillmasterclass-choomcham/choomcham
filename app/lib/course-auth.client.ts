import { createClient } from "@supabase/supabase-js";

// Never import the legacy services client: this workspace uses only the public anonymous key.
export const courseAuth = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, { auth: { storageKey: "choomcham-course-auth", persistSession: true, autoRefreshToken: true } })
  : null;
