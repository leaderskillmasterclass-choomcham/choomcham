import { createClient } from "@supabase/supabase-js";

function getEdgeSupabase(env: any) {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || "https://upxypufbqvtmokxeutrt.supabase.co";
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVweHlwdWZicXZ0bW9reGV1dHJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYyMzkwMywiZXhwIjoyMTAzMTk5OTAzfQ.SWZ_lgeGgfjjSeIp9RaV8OXMBE6hNsgNB8nk7Dn7pl0";
  return createClient(supabaseUrl, supabaseKey);
}

// Default Seed Super Admins
const DEFAULT_SUPERADMINS = [
  {
    id: "756695d0-48e1-44b9-b214-d2530145cfa8",
    email: "dend3v@gmail.com",
    full_name: "ครูเด่น (DenD3v)",
    role: "SUPERADMIN",
    created_at: new Date().toISOString()
  },
  {
    id: "267820d3-7d0d-4203-8d51-aaa22f31558e",
    email: "dencapvision@gmail.com",
    full_name: "ครูเด่น (CAP Vision)",
    role: "SUPERADMIN",
    created_at: new Date().toISOString()
  },
  {
    id: "3500fda1-5763-41ac-a3ba-680f192da85e",
    email: "choomchambranding@gmail.com",
    full_name: "Choomcham Branding (Admin)",
    role: "ADMIN",
    created_at: new Date().toISOString()
  }
];

// GET /api/users - List all admin profiles & roles
export async function onRequestGet(context: { env: any }) {
  try {
    const supabase = getEdgeSupabase(context.env);
    const { data, error } = await supabase
      .from("admin_profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return new Response(JSON.stringify({ success: true, data: DEFAULT_SUPERADMINS }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: true, data: DEFAULT_SUPERADMINS }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST /api/users - Create new admin user & profile
export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const body = await context.request.json() as {
      email: string;
      password?: string;
      full_name: string;
      role: "SUPERADMIN" | "ADMIN" | "OPERATOR" | string;
    };

    if (!body.email || !body.full_name) {
      return new Response(JSON.stringify({ success: false, error: "กรุณากรอกอีเมลและชื่อ-นามสกุล" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabase = getEdgeSupabase(context.env);

    // 1. Create or invite user in Supabase Auth
    const pwd = body.password || "choomcham2026";
    const authRes = await supabase.auth.admin.createUser({
      email: body.email,
      password: pwd,
      email_confirm: true,
      user_metadata: { full_name: body.full_name, role: body.role || "ADMIN" }
    });

    let userId = authRes.data?.user?.id;
    if (!userId) {
      // If user already exists in auth, find existing ID
      const { data: usersList } = await supabase.auth.admin.listUsers();
      const existing = usersList?.users?.find(u => u.email === body.email);
      userId = existing ? existing.id : `user-${Date.now()}`;
    }

    // 2. Upsert admin profile
    const safeRole = ["SUPERADMIN", "ADMIN", "OPERATOR"].includes(body.role) ? body.role : "ADMIN";
    const { data: profileData, error: profileErr } = await supabase
      .from("admin_profiles")
      .upsert({
        id: userId,
        email: body.email,
        full_name: body.full_name,
        role: safeRole,
        updated_at: new Date().toISOString()
      })
      .select();

    if (profileErr) {
      return new Response(JSON.stringify({ success: false, error: profileErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, data: profileData?.[0] }), {
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

// PUT /api/users - Update user role or full_name
export async function onRequestPut(context: { request: Request; env: any }) {
  try {
    const body = await context.request.json() as {
      id: string;
      full_name?: string;
      role?: string;
    };

    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: "Missing user id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabase = getEdgeSupabase(context.env);
    const updates: any = { updated_at: new Date().toISOString() };
    if (body.full_name) updates.full_name = body.full_name;
    if (body.role) {
      updates.role = ["SUPERADMIN", "ADMIN", "OPERATOR"].includes(body.role) ? body.role : "ADMIN";
    }

    const { data, error } = await supabase
      .from("admin_profiles")
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

// DELETE /api/users - Delete user (Protected)
export async function onRequestDelete(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    const email = url.searchParams.get("email");

    // Protect master super admins
    if (email === "dend3v@gmail.com" || email === "dencapvision@gmail.com") {
      return new Response(JSON.stringify({ success: false, error: "ไม่สามารถลบ Super Admin หลักของระบบได้" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabase = getEdgeSupabase(context.env);
    if (id) {
      await supabase.auth.admin.deleteUser(id).catch(() => {});
      await supabase.from("admin_profiles").delete().eq("id", id);
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
