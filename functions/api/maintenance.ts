import { authorize, json } from "../lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

export const VERIFIED_FIXTURES = [
  { name: "คุณทดสอบ ระบบชุ่มฉ่ำ", company: "Choomcham Test Corp Ltd.", score: 18, expected: 2 },
  { name: "Test Script Lead", company: "CAP Vision Institute", score: 10, expected: 1 },
  { name: "Anon Role Test", company: "TestCo", score: 5, expected: 1 },
  { name: "RLS Test", company: "Test Co", score: 10, expected: 1 },
  { name: "เด่น ทดสอบ 2", company: "เด่น", score: 10, expected: 1 },
];

function getServiceClient(env: any) {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) throw new Error("ระบบฐานข้อมูลยังไม่ได้ตั้งค่า");
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  const auth = await authorize(request, env);
  if (auth.response) return auth.response;
  if (auth.role !== "SUPERADMIN") {
    return json({ error: "ต้องใช้สิทธิ์ Super Admin ในการจัดการฐานข้อมูล" }, 403);
  }

  try {
    const db = getServiceClient(env);

    // 1. Fetch all active leads to match fixtures
    const { data: allActiveLeads, error: activeErr } = await db
      .from("leads")
      .select("id, name, company, score, result_level, created_at, status, is_test, archived")
      .eq("archived", false);

    if (activeErr) throw activeErr;

    // 2. Fetch archived test leads
    const { data: archivedLeads, error: archErr } = await db
      .from("leads")
      .select("id, name, company, score, result_level, created_at, archived_at, is_test")
      .eq("archived", true)
      .order("archived_at", { ascending: false });

    if (archErr) console.warn("Could not fetch archived leads:", archErr);

    // 3. Match against fixtures
    const leadsList = allActiveLeads || [];
    const fixtureReports = VERIFIED_FIXTURES.map((fix) => {
      const matches = leadsList.filter(
        (l) =>
          l.name === fix.name &&
          l.company === fix.company &&
          Number(l.score) === fix.score &&
          ["FADED", "ZOMBIE"].includes(String(l.result_level).toUpperCase())
      );
      return {
        ...fix,
        actual: matches.length,
        matches,
        matchedExpected: matches.length === fix.expected,
      };
    });

    // Target matching IDs
    const targetLeadIds = fixtureReports.flatMap((f) => f.matches.map((m) => m.id));

    // 4. Check for downstream links (transformation_projects and course_designs)
    let linkedProjectsCount = 0;
    let linkedCoursesCount = 0;

    if (targetLeadIds.length > 0) {
      const { data: linkedProjects } = await db
        .from("transformation_projects")
        .select("id, lead_id, client_name")
        .in("lead_id", targetLeadIds);

      linkedProjectsCount = linkedProjects?.length || 0;

      const { data: allCourses } = await db
        .from("course_designs")
        .select("id, document");

      if (allCourses) {
        linkedCoursesCount = allCourses.filter((c: any) =>
          targetLeadIds.includes(c.document?.leadId)
        ).length;
      }
    }

    // 5. Fetch audit records if table exists
    let auditRecords: any[] = [];
    try {
      const { data: audits } = await db
        .from("test_cleanup_audit")
        .select("*")
        .order("archived_at", { ascending: false })
        .limit(50);
      auditRecords = audits || [];
    } catch {
      // Table might be optional
    }

    const totalExpected = VERIFIED_FIXTURES.reduce((acc, f) => acc + f.expected, 0);
    const totalMatched = targetLeadIds.length;
    const safetyPassed = totalMatched === totalExpected && linkedProjectsCount === 0 && linkedCoursesCount === 0;

    return json({
      success: true,
      data: {
        fixtures: fixtureReports,
        targetLeadIds,
        totalExpected,
        totalMatched,
        linkedProjectsCount,
        linkedCoursesCount,
        safetyPassed,
        totalActiveLeadsCount: leadsList.length,
        archivedCount: (archivedLeads || []).length,
        archivedLeads: archivedLeads || [],
        auditRecords,
      },
    });
  } catch (err: any) {
    console.error("[Maintenance GET error]:", err);
    return json({ error: err.message || "ไม่สามารถดึงข้อมูลระบบได้" }, 500);
  }
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
  if (auth.role !== "SUPERADMIN") {
    return json({ error: "ต้องใช้สิทธิ์ Super Admin ในการจัดการฐานข้อมูล" }, 403);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "archive";
    const db = getServiceClient(env);

    if (action === "archive") {
      // 1. Fetch current active fixtures
      const { data: allActiveLeads, error: activeErr } = await db
        .from("leads")
        .select("*")
        .eq("archived", false);

      if (activeErr) throw activeErr;

      const leadsList = allActiveLeads || [];
      const targetLeads = leadsList.filter((l) =>
        VERIFIED_FIXTURES.some(
          (fix) =>
            l.name === fix.name &&
            l.company === fix.company &&
            Number(l.score) === fix.score &&
            ["FADED", "ZOMBIE"].includes(String(l.result_level).toUpperCase())
        )
      );

      if (targetLeads.length === 0) {
        return json({ error: "ไม่พบรายการ Test Leads ที่ตรงกับเงื่อนไขในระบบ หรือถูกจัดเก็บไปแล้ว" }, 400);
      }

      const targetIds = targetLeads.map((l) => l.id);

      // Check linked records
      const { data: linkedProjects } = await db
        .from("transformation_projects")
        .select("id")
        .in("lead_id", targetIds);

      if (linkedProjects && linkedProjects.length > 0) {
        return json({
          error: `ระงับการจัดเก็บ: พบ Test Lead เชื่อมโยงกับ Project จริง (${linkedProjects.length} รายการ)`,
        }, 400);
      }

      const batchId = `verified-test-leads-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;

      // 2. Snapshot into test_cleanup_audit
      try {
        const auditRows = targetLeads.map((l) => ({
          batch_id: batchId,
          lead_id: l.id,
          snapshot: l,
          archived_at: new Date().toISOString(),
        }));
        await db.from("test_cleanup_audit").upsert(auditRows, { onConflict: "batch_id,lead_id" });
      } catch (auditErr) {
        console.warn("[Maintenance archive audit snapshot warning]:", auditErr);
      }

      // 3. Mark as archived in leads
      const { error: updateErr } = await db
        .from("leads")
        .update({
          is_test: true,
          archived: true,
          archived_at: new Date().toISOString(),
        })
        .in("id", targetIds);

      if (updateErr) throw updateErr;

      return json({
        success: true,
        message: `จัดเก็บ Test Leads เรียบร้อยแล้ว (${targetLeads.length} รายการ)`,
        batchId,
        archivedCount: targetLeads.length,
      });
    }

    if (action === "restore") {
      const { batchId, leadIds } = body;
      let query = db.from("leads").update({
        archived: false,
        archived_at: null,
      });

      if (Array.isArray(leadIds) && leadIds.length > 0) {
        query = query.in("id", leadIds);
      } else if (batchId) {
        // Find leads for batchId from audit
        const { data: auditRows } = await db
          .from("test_cleanup_audit")
          .select("lead_id")
          .eq("batch_id", batchId);

        if (!auditRows || auditRows.length === 0) {
          return json({ error: "ไม่พบประวัติ Audit สำหรับ Batch นี้" }, 404);
        }
        const ids = auditRows.map((r) => r.lead_id);
        query = query.in("id", ids);
      } else {
        return json({ error: "กรุณาระบุ batchId หรือ leadIds ที่ต้องการกู้คืน" }, 400);
      }

      const { error: restoreErr } = await query;
      if (restoreErr) throw restoreErr;

      return json({
        success: true,
        message: "กู้คืนข้อมูล Test Leads เรียบร้อยแล้ว",
      });
    }

    return json({ error: "ไม่พบคำสั่งที่ระบุ" }, 400);
  } catch (err: any) {
    console.error("[Maintenance POST error]:", err);
    return json({ error: err.message || "ดำเนินการไม่สำเร็จ" }, 500);
  }
}
