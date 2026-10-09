import { createClient } from "@supabase/supabase-js";
export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
export type AdminEnv = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  ADMIN_EMAILS?: string;
  SUPER_ADMIN_EMAILS?: string;
  OPERATOR_EMAILS?: string;
  COURSE_ADMIN_EMAILS?: string;
};
export const DEFAULT_SUPER_ADMIN_EMAILS = [
  "dencapvision@gmail.com",
  "dend3v@gmail.com",
];

export const DEFAULT_ADMIN_EMAILS = [
  "dencapvision@gmail.com",
  "dend3v@gmail.com",
  "choomchambranding@gmail.com",
];

export const emails = (value?: string) =>
  (value || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

export function getAllowedEmails(env: AdminEnv): string[] {
  const fromEnv = emails(env.ADMIN_EMAILS || env.COURSE_ADMIN_EMAILS);
  return fromEnv.length ? fromEnv : DEFAULT_ADMIN_EMAILS;
}

export function getSuperAdminEmails(env: AdminEnv): string[] {
  const fromEnv = emails(env.SUPER_ADMIN_EMAILS);
  return fromEnv.length ? fromEnv : DEFAULT_SUPER_ADMIN_EMAILS;
}

export async function authorize(request: Request, env: AdminEnv & Record<string, any>) {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  const allowed = getAllowedEmails(env);
  const supers = getSuperAdminEmails(env);

  if (!supabaseUrl || !supabaseKey)
    return { response: json({ error: "ระบบผู้ดูแลยังไม่ได้ตั้งค่าฐานข้อมูล" }, 503) };

  const token = request.headers
    .get("Authorization")
    ?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return { response: json({ error: "กรุณาเข้าสู่ระบบ" }, 401) };

  try {
    const db = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await db.auth.getUser(token);
    if (error || !data.user?.email || !data.user.email_confirmed_at)
      return { response: json({ error: "กรุณาเข้าสู่ระบบใหม่ หรือยืนยันอีเมลใน Supabase" }, 401) };

    const emailLower = data.user.email.toLowerCase();
    if (!allowed.includes(emailLower))
      return { response: json({ error: "บัญชีนี้ไม่มีสิทธิ์ผู้ดูแล" }, 403) };

    const role = supers.includes(emailLower)
      ? "SUPERADMIN"
      : emails(env.OPERATOR_EMAILS).includes(emailLower)
      ? "OPERATOR"
      : "ADMIN";

    return { db, user: data.user, role };
  } catch {
    return { response: json({ error: "ตรวจสอบสิทธิ์ไม่สำเร็จ" }, 503) };
  }
}
