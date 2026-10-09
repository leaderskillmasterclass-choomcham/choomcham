import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://upxypufbqvtmokxeutrt.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVweHlwdWZicXZ0bW9reGV1dHJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzYyMzkwMywiZXhwIjoyMTAzMTk5OTAzfQ.SWZ_lgeGgfjjSeIp9RaV8OXMBE6hNsgNB8nk7Dn7pl0";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const email = "choomchambranding@gmail.com";
  const password = "123456";
  const fullName = "Choomcham Branding (Admin)";
  const role = "ADMIN";

  console.log(`Checking existing user for ${email}...`);
  const { data: usersList, error: listErr } = await supabase.auth.admin.listUsers();
  
  let user = usersList?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

  if (user) {
    console.log(`Found existing user ${user.id}. Updating password and metadata...`);
    const { data: updated, error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: role }
    });
    if (updateErr) {
      console.error("Update Auth error:", updateErr);
    } else {
      console.log("Auth user updated successfully!");
    }
  } else {
    console.log(`Creating new user ${email}...`);
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: role }
    });
    if (createErr) {
      console.error("Create Auth error:", createErr);
    } else {
      user = created.user;
      console.log("Auth user created successfully with ID:", user?.id);
    }
  }

  const userId = user?.id || "choomchambranding-admin-id";

  console.log("Upserting admin_profiles table...");
  const { data: profile, error: profErr } = await supabase
    .from("admin_profiles")
    .upsert({
      id: userId,
      email: email,
      full_name: fullName,
      role: role,
      updated_at: new Date().toISOString()
    })
    .select();

  if (profErr) {
    console.error("Profile upsert error:", profErr);
  } else {
    console.log("admin_profiles upserted successfully:", profile);
  }

  console.log("DONE!");
}

main().catch(console.error);
