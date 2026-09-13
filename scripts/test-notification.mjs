import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

async function testFullNotificationFlow() {
  console.log("==================================================");
  console.log("🧪 CHOOMCHAM HOUSE — NOTIFICATION & LEAD TEST");
  console.log("==================================================");

  const testLead = {
    name: "คุณทดสอบ ระบบชุ่มฉ่ำ",
    company: "Choomcham Test Corp Ltd.",
    position: "Managing Director",
    email_or_line: "test.executive@choomcham.house / LINE: @choomcham",
    team_size: "50-100 คน",
    score: 18,
    result_level: "FADED",
    answers: [2, 1, 2, 2, 2, 2, 1, 2, 2, 2],
    dimensions_scores: {
      energy: { current: 4, max: 8, percentage: 50 },
      meaning: { current: 4, max: 8, percentage: 50 },
      connection: { current: 4, max: 8, percentage: 50 },
      voice: { current: 3, max: 8, percentage: 38 },
      psychological_safety: { current: 4, max: 8, percentage: 50 },
      ownership: { current: 4, max: 8, percentage: 50 },
      creativity: { current: 3, max: 8, percentage: 38 },
    },
    status: "NEW",
  };

  // 1. Test Supabase Save
  console.log("\n1️⃣  Testing Supabase Database Insertion...");
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("leads")
        .insert([testLead])
        .select();

      if (error) {
        console.error("❌ Supabase Error:", error.message);
      } else {
        console.log("✅ Supabase Lead Inserted Successfully! ID:", data?.[0]?.id);
      }
    } catch (err) {
      console.error("❌ Supabase Exception:", err.message);
    }
  } else {
    console.log("⚠️  Skipping Supabase (Missing credentials)");
  }

  // 2. Test Resend Email Notification
  console.log("\n2️⃣  Testing Resend Email Delivery...");
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || "owner@choomcham.house";
  const senderEmail = process.env.SENDER_EMAIL || "onboarding@resend.dev";

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const emailResult = await resend.emails.send({
        from: "onboarding@resend.dev", // Using verified onboarding sender for testing
        to: "dencapvision@gmail.com", // Test inbox or verified email
        subject: `🧟 [Test Alert] Zombie Check - ${testLead.name} (${testLead.company})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #4044A5;">🧟 [ทดสอบระบบ] Zombie Organization Check™</h2>
            <p>มีข้อมูลแบบประเมินทดสอบส่งเข้ามา:</p>
            <ul>
              <li><strong>ชื่อ:</strong> ${testLead.name}</li>
              <li><strong>บริษัท:</strong> ${testLead.company} (${testLead.position})</li>
              <li><strong>ติดต่อ:</strong> ${testLead.email_or_line}</li>
              <li><strong>ผลประเมิน:</strong> ${testLead.result_level} (${testLead.score}/40 คะแนน)</li>
            </ul>
            <p style="color: #059669; font-weight: bold;">✓ ระบบแจ้งเตือนทางอีเมล Resend ทำงานถูกต้อง</p>
          </div>
        `
      });

      if (emailResult.error) {
        console.error("❌ Resend API Error:", emailResult.error);
      } else {
        console.log("✅ Resend Email Sent Successfully! Email ID:", emailResult.data?.id);
      }
    } catch (err) {
      console.error("❌ Resend Exception:", err.message);
    }
  } else {
    console.log("⚠️  Skipping Resend (Missing RESEND_API_KEY)");
  }

  // 3. Test Live Edge Gateway Endpoint
  console.log("\n3️⃣  Testing Live Cloudflare Edge Endpoint (https://choomcham.pages.dev/api/lead)...");
  try {
    const res = await fetch("https://choomcham.pages.dev/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testLead)
    });
    const data = await res.json();
    console.log("✅ Cloudflare Edge Gateway Response (HTTP", res.status, "):", data);
  } catch (err) {
    console.error("❌ Cloudflare Edge Exception:", err.message);
  }

  console.log("\n==================================================");
  console.log("🎉 TEST SEQUENCE COMPLETED");
  console.log("==================================================");
}

testFullNotificationFlow();
