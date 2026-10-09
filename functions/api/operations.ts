import { authorize, json } from "../lib/admin-auth";
const uuid = (v: any) =>
  typeof v === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  const auth = await authorize(request, env);
  if (auth.response) return auth.response;
  const resource = new URL(request.url).searchParams.get("resource");
  if (!["projects", "partners"].includes(resource || ""))
    return json({ error: "รายการไม่ถูกต้อง" }, 400);
  if (resource === "partners" && auth.role !== "SUPERADMIN")
    return json({ error: "ต้องใช้สิทธิ์ Super Admin" }, 403);
  const { data, error } = await auth
    .db!.from(
      resource === "projects"
        ? "transformation_projects"
        : "partner_contributions",
    )
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });
  return error
    ? json({ error: "โหลดข้อมูลไม่สำเร็จ กรุณาตรวจการตั้งค่าฐานข้อมูล" }, 503)
    : json({ success: true, data });
}
export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  const auth = await authorize(request, env);
  if (auth.response) return auth.response;
  try {
    const text = await request.text();
    if (text.length > 10000) return json({ error: "ข้อมูลใหญ่เกินไป" }, 413);
    const body = JSON.parse(text),
      v = body.document;
    let document: any;
    if (body.resource === "projects") {
      if (
        !v ||
        ![v.client_name, v.lead_consultant].every(
          (x) => typeof x === "string" && x.trim() && x.length <= 300,
        ) ||
        ![
          "REBORN",
          "COMMUNICATION",
          "TEAM",
          "LEADER",
          "CULTURE",
          "LIVING ORGANIZATION",
          "REBORN PEOPLE",
          "ALIVE TEAM",
          "REBORN LEADER",
        ].includes(v.program_name) ||
        !Number.isInteger(v.participants_count) ||
        v.participants_count < 1 ||
        v.participants_count > 10000 ||
        !["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"].includes(
          v.status,
        ) ||
        ![
          "RESET",
          "RECONNECT",
          "RECHARGE",
          "REIMAGINE",
          "RECREATE",
          "COMPLETED",
        ].includes(v.current_stage)
      )
        return json({ error: "กรุณาตรวจข้อมูลโครงการ" }, 400);
      document = {
        client_name: v.client_name.trim(),
        lead_consultant: v.lead_consultant.trim(),
        program_name: v.program_name,
        participants_count: v.participants_count,
        status: v.status,
        current_stage: v.current_stage,
      };
    } else if (body.resource === "partners") {
      if (auth.role !== "SUPERADMIN")
        return json({ error: "ต้องใช้สิทธิ์ Super Admin" }, 403);
      if (
        !v ||
        typeof v.partner_name !== "string" ||
        !v.partner_name.trim() ||
        v.partner_name.length > 300 ||
        !uuid(v.project_id) ||
        !["MARKETING", "SALES", "SOLUTION", "OPERATION"].includes(
          v.contribution_type,
        ) ||
        !Number.isFinite(v.percentage) ||
        v.percentage < 0 ||
        v.percentage > 100 ||
        !Number.isFinite(v.amount) ||
        v.amount < 0 ||
        v.amount > 1e9 ||
        !["PENDING", "VERIFIED", "PAID"].includes(v.status)
      )
        return json({ error: "กรุณาตรวจข้อมูลการมีส่วนร่วม" }, 400);
      document = {
        partner_name: v.partner_name.trim(),
        project_id: v.project_id,
        contribution_type: v.contribution_type,
        percentage: v.percentage,
        amount: v.amount,
        status: v.status,
      };
    } else return json({ error: "รายการไม่ถูกต้อง" }, 400);
    if (body.id && !uuid(body.id))
      return json({ error: "รหัสไม่ถูกต้อง" }, 400);
    const table = auth.db!.from(
      body.resource === "projects"
        ? "transformation_projects"
        : "partner_contributions",
    );
    const query = body.id
      ? table.update(document).eq("id", body.id).eq("archived", false)
      : table.insert(document);
    const { data, error } = await query.select().single();
    return error || !data
      ? json(
          { error: "บันทึกไม่สำเร็จ ตรวจการตั้งค่าฐานข้อมูลและรหัสโครงการ" },
          503,
        )
      : json({ success: true, data });
  } catch {
    return json({ error: "ข้อมูลไม่ถูกต้อง" }, 400);
  }
}
