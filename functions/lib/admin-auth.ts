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
  COURSE_ADMIN_EMAILS?: string;
};
export const emails = (value?: string) =>
  (value || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
export async function authorize(request: Request, env: AdminEnv) {
  const allowed = emails(env.ADMIN_EMAILS || env.COURSE_ADMIN_EMAILS);
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !allowed.length)
    return { response: json({ error: "ระบบผู้ดูแลยังไม่ได้ตั้งค่า" }, 503) };
  const token = request.headers
    .get("Authorization")
    ?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return { response: json({ error: "กรุณาเข้าสู่ระบบ" }, 401) };
  try {
    const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await db.auth.getUser(token);
    if (error || !data.user?.email || !data.user.email_confirmed_at)
      return { response: json({ error: "กรุณาเข้าสู่ระบบใหม่" }, 401) };
    if (!allowed.includes(data.user.email.toLowerCase()))
      return { response: json({ error: "บัญชีนี้ไม่มีสิทธิ์ผู้ดูแล" }, 403) };
    const role = emails(env.SUPER_ADMIN_EMAILS).includes(
      data.user.email.toLowerCase(),
    )
      ? "SUPERADMIN"
      : "ADMIN";
    return { db, user: data.user, role };
  } catch {
    return { response: json({ error: "ตรวจสอบสิทธิ์ไม่สำเร็จ" }, 503) };
  }
}
