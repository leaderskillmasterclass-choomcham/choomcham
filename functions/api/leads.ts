import { createClient } from "@supabase/supabase-js";

// Helper to initialize Supabase client on Cloudflare Pages Function
function getEdgeSupabase(env: any) {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || "https://upxypufbqvtmokxeutrt.supabase.co";
  // Prioritize service role key on server-side to bypass RLS for admin operations
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVweHlwdWZicXZ0bW9reGV1dHJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYyMzkwMywiZXhwIjoyMTAzMTk5OTAzfQ.SWZ_lgeGgfjjSeIp9RaV8OXMBE6hNsgNB8nk7Dn7pl0";
  return createClient(supabaseUrl, supabaseKey);
}

// GET /api/leads - Fetch all leads for Admin CRM & Dashboard
export async function onRequestGet(context: { env: any }) {
  try {
    const supabase = getEdgeSupabase(context.env);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Edge /api/leads GET error]:", error);
      return new Response(JSON.stringify({ success: false, error: error.message, data: [] }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, data: data || [] }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err: any) {
    console.error("[Edge /api/leads GET catch]:", err);
    return new Response(JSON.stringify({ success: false, error: err.message, data: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// PUT /api/leads - Update lead status or notes
export async function onRequestPut(context: { request: Request; env: any }) {
  try {
    const body = await context.request.json() as { id: string; status?: string; notes?: string };
    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: "Missing lead id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabase = getEdgeSupabase(context.env);
    const updates: any = { updated_at: new Date().toISOString() };
    if (body.status !== undefined) updates.status = body.status;
    if (body.notes !== undefined) updates.notes = body.notes;

    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", body.id)
      .select();

    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, data: data?.[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// DELETE /api/leads - Delete lead by id
export async function onRequestDelete(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "Missing lead id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabase = getEdgeSupabase(context.env);
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
