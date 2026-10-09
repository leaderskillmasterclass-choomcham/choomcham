import { createClient } from "@supabase/supabase-js";

// Helper to initialize Supabase client on Cloudflare Pages Function
function getEdgeSupabase(env: any) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("ระบบฐานข้อมูลยังไม่ได้ตั้งค่า");
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

// GET /api/leads - Fetch all leads for Admin CRM & Dashboard
export async function onRequestGet(context: { env: any }) {
  try {
    const supabase = getEdgeSupabase(context.env);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Edge /api/leads GET error]:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "ฐานข้อมูลดำเนินการไม่สำเร็จ",
          data: [],
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true, data: data || [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("[Edge /api/leads GET catch]:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "ฐานข้อมูลดำเนินการไม่สำเร็จ",
        data: [],
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// PUT /api/leads - Update lead status or notes
export async function onRequestPut(context: { request: Request; env: any }) {
  try {
    const body = (await context.request.json()) as {
      id: string;
      status?: string;
      notes?: string;
    };
    if (
      !/^[0-9a-f-]{36}$/i.test(body.id) ||
      (body.status !== undefined &&
        ![
          "NEW",
          "CONTACTED",
          "CONSULTATION",
          "PROPOSAL",
          "WON",
          "LOST",
        ].includes(body.status)) ||
      (body.notes !== undefined &&
        (typeof body.notes !== "string" || body.notes.length > 10000))
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing lead id" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const supabase = getEdgeSupabase(context.env);
    const updates: any = { updated_at: new Date().toISOString() };
    if (body.status !== undefined) updates.status = body.status;
    if (body.notes !== undefined) updates.notes = body.notes;

    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", body.id)
      .eq("archived", false)
      .select();

    if (error || !data?.[0]) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "ฐานข้อมูลดำเนินการไม่สำเร็จ",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true, data: data?.[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: "ฐานข้อมูลดำเนินการไม่สำเร็จ" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// DELETE /api/leads - Delete lead by id
export async function onRequestDelete(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing lead id" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const supabase = getEdgeSupabase(context.env);
    const { data, error } = await supabase
      .from("leads")
      .update({ archived: true, archived_at: new Date().toISOString() })
      .eq("id", id)
      .eq("archived", false)
      .select("id");

    if (error || !data?.[0]) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "ฐานข้อมูลดำเนินการไม่สำเร็จ",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: "ฐานข้อมูลดำเนินการไม่สำเร็จ" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
