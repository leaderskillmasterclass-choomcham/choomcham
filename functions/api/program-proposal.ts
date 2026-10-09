import { createClient } from "@supabase/supabase-js";
import { proposalLead, validateProposalBrief } from "../../app/lib/proposal-request";

type Env = { SUPABASE_URL?: string; VITE_SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

// Keep public proposal intake separate from diagnostic scoring and notification delivery.
export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  if (request.headers.get("Origin") && request.headers.get("Origin") !== new URL(request.url).origin) return json({ error: "คำขอนี้ไม่สามารถดำเนินการได้" }, 403);
  if (!request.headers.get("Content-Type")?.includes("application/json")) return json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, 415);
  let input: unknown;
  try {
    const text = await request.text();
    if (text.length > 16000) return json({ error: "ข้อมูลมีขนาดใหญ่เกินไป" }, 413);
    input = JSON.parse(text);
  } catch { return json({ error: "ข้อมูลไม่ถูกต้อง กรุณาลองใหม่" }, 400); }
  const { brief, errors } = validateProposalBrief(input);
  if (brief.website) return json({ error: "ไม่สามารถส่งคำขอนี้ได้" }, 400);
  if (Object.keys(errors).length) return json({ error: "กรุณาตรวจสอบข้อมูลในแบบฟอร์ม", errors }, 400);
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  if (!url || !env.SUPABASE_SERVICE_ROLE_KEY) return json({ error: "ระบบรับคำขอยังไม่พร้อม กรุณาติดต่อทีมงานผ่านหน้าติดต่อ" }, 503);
  try {
    const supabase = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from("leads").insert(proposalLead(brief, new Date().toISOString())).select("id").single();
    if (error || !data?.id) return json({ error: "ยังบันทึกคำขอไม่สำเร็จ กรุณาลองใหม่" }, 503);
    return json({ success: true, request_id: data.id }, 201);
  } catch { return json({ error: "ยังบันทึกคำขอไม่สำเร็จ กรุณาลองใหม่" }, 503); }
}
