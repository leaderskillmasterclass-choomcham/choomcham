import { createClient } from "@supabase/supabase-js";
import { designReadiness, parseCourseDesign } from "../../app/lib/course-design";

type Env = { SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string; COURSE_ADMIN_EMAILS?: string };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const uuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

async function authorize(request: Request, env: Env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.COURSE_ADMIN_EMAILS?.trim()) return { response: json({ error: "ระบบหลักสูตรยังไม่ได้ตั้งค่าสิทธิ์ผู้ดูแล" }, 503) };
  const token = request.headers.get("Authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return { response: json({ error: "กรุณาเข้าสู่ระบบเพื่อใช้ข้อมูลทีม" }, 401) };
  const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user?.email || !data.user.email_confirmed_at) return { response: json({ error: "กรุณาเข้าสู่ระบบใหม่" }, 401) };
  const allowed = env.COURSE_ADMIN_EMAILS.split(",").map(email => email.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(data.user.email.toLowerCase())) return { response: json({ error: "บัญชีนี้ไม่มีสิทธิ์จัดการหลักสูตร" }, 403) };
  return { db, user: data.user };
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  try {
    const auth = await authorize(request, env); if (auth.response) return auth.response;
    const url = new URL(request.url), resource = url.searchParams.get("resource");
    if (resource === "leads") {
      const { data, error } = await auth.db!.from("leads").select("id,company,name,team_size,dimensions_scores").eq("result_level", "PROPOSAL_REQUEST").order("created_at", { ascending: false }).limit(100);
      return error ? json({ error: "โหลดคำขอ Proposal ไม่สำเร็จ" }, 503) : json({ data });
    }
    if (resource === "history") {
      const id = url.searchParams.get("id"); if (!uuid(id)) return json({ error: "รหัสหลักสูตรไม่ถูกต้อง" }, 400);
      const { data, error } = await auth.db!.from("course_design_versions").select("version,status,document,created_at,created_by").eq("course_id", id).order("version", { ascending: false }).limit(50);
      return error ? json({ error: "โหลดประวัติไม่สำเร็จ" }, 503) : json({ data });
    }
    const { data, error } = await auth.db!.from("course_designs").select("id,version,status,document,updated_at,updated_by").order("updated_at", { ascending: false }).limit(100);
    return error ? json({ error: "โหลดหลักสูตรไม่สำเร็จ กรุณาตรวจการตั้งค่าฐานข้อมูล" }, 503) : json({ data });
  } catch { return json({ error: "เชื่อมต่อระบบหลักสูตรไม่สำเร็จ" }, 503); }
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  if (request.headers.get("Origin") && request.headers.get("Origin") !== new URL(request.url).origin) return json({ error: "คำขอไม่ถูกต้อง" }, 403);
  if (!request.headers.get("Content-Type")?.includes("application/json")) return json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, 415);
  try {
    const auth = await authorize(request, env); if (auth.response) return auth.response;
    const text = await request.text(); if (text.length > 100000) return json({ error: "หลักสูตรมีขนาดใหญ่เกินไป" }, 413);
    let body; try { body = JSON.parse(text); } catch { return json({ error: "ข้อมูลไม่ถูกต้อง" }, 400); }
    const design = parseCourseDesign(body?.document);
    if (!design || !uuid(body.id) || !Number.isInteger(body.expectedVersion) || body.expectedVersion < 0 || !["DRAFT", "REVIEW", "APPROVED"].includes(body.status)) return json({ error: "กรุณาตรวจข้อมูลหลักสูตร" }, 400);
    const missing = designReadiness(design);
    if (body.status !== "DRAFT" && missing.length) return json({ error: "หลักสูตรยังไม่พร้อมตรวจ กรุณาเติมข้อมูลที่ขาด", missing }, 422);
    const { data, error } = await auth.db!.rpc("save_course_design", { p_id: body.id, p_expected_version: body.expectedVersion, p_document: design, p_status: body.status, p_actor: auth.user!.id });
    if (error?.code === "40001") return json({ error: "มีคนแก้ไขหลักสูตรนี้แล้ว กรุณาเก็บร่างของคุณและโหลดฉบับทีมล่าสุดก่อนรวมการแก้ไข" }, 409);
    if (error || !data?.id) return json({ error: "บันทึกหลักสูตรไม่สำเร็จ กรุณาตรวจการตั้งค่าฐานข้อมูล" }, 503);
    return json({ success: true, data });
  } catch { return json({ error: "เชื่อมต่อระบบหลักสูตรไม่สำเร็จ" }, 503); }
}
