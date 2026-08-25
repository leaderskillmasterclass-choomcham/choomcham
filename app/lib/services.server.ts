import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Helper to get env variables dynamically on Cloudflare Pages or Node.js local dev
export function getEnvVar(context: any, key: string): string | undefined {
  if (context?.cloudflare?.env?.[key]) {
    return context.cloudflare.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

// 1. Supabase Service
export async function saveLeadToSupabase(context: any, leadData: {
  name: string;
  company: string;
  position: string;
  email_or_line: string;
  team_size?: string;
  score: number;
  result_level: string;
  answers: number[];
}) {
  const supabaseUrl = getEnvVar(context, "SUPABASE_URL");
  const supabaseKey = getEnvVar(context, "SUPABASE_ANON_KEY");

  console.log("[Supabase Service] Saving lead for:", leadData.name);

  if (!supabaseUrl || !supabaseKey) {
    console.warn("[Supabase Service] Missing credentials! Simulating DB save in development mode.");
    return { success: true, data: { id: "mock-uuid-12345", ...leadData }, simulated: true };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name: leadData.name,
          company: leadData.company,
          position: leadData.position,
          email_or_line: leadData.email_or_line,
          team_size: leadData.team_size || null,
          score: leadData.score,
          result_level: leadData.result_level,
          answers: leadData.answers,
        }
      ])
      .select();

    if (error) {
      console.error("[Supabase Service] Error inserting lead:", error.message);
      throw error;
    }

    return { success: true, data: data?.[0], simulated: false };
  } catch (err: any) {
    console.error("[Supabase Service] Catch block error:", err);
    // Return simulated success to not block user experience in case of db errors
    return { success: false, error: err.message || err };
  }
}

// 2. Resend Email Service
export async function sendEmailNotification(context: any, lead: {
  name: string;
  company: string;
  position: string;
  email_or_line: string;
  team_size?: string;
  score: number;
  result_level: string;
}) {
  const resendApiKey = getEnvVar(context, "RESEND_API_KEY");
  const notificationEmail = getEnvVar(context, "NOTIFICATION_EMAIL") || "owner@choomcham.house";
  const senderEmail = getEnvVar(context, "SENDER_EMAIL") || "noreply@choomcham.house";

  const emailSubject = `🧟 [New Lead] Zombie Quiz Submission - ${lead.name} (${lead.company})`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #FF6B6B; border-bottom: 2px solid #FF6B6B; padding-bottom: 10px;">🧟 Zombie Organization Check™</h2>
      <p style="font-size: 16px; color: #555;">มีผู้ส่งแบบประเมินองค์กรใหม่เข้ามา รายละเอียดดังนี้:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">ชื่อ-นามสกุล:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">บริษัท / องค์กร:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.company}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">ตำแหน่งงาน:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.position}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">ข้อมูลติดต่อ (Email / LINE):</td>
          <td style="padding: 10px; border: 1px solid #ddd; color: #FF6B6B; font-weight: bold;">${lead.email_or_line}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">ขนาดทีม:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${lead.team_size || "ไม่ได้ระบุ"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">คะแนนรวม:</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${lead.score} / 40 คะแนน</td>
        </tr>
        <tr style="background: #fff5f5; color: #c53030;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">ผลลัพธ์ประเมิน:</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${lead.result_level}</td>
        </tr>
      </table>

      <div style="margin-top: 25px; padding: 15px; background: #f0fff4; border-radius: 6px; border: 1px solid #c6f6d5;">
        <p style="margin: 0; color: #22543d; font-weight: bold;">🎯 Next Action Steps:</p>
        <ol style="margin-top: 5px; color: #2f855a; font-size: 14px; padding-left: 20px;">
          <li>ติดต่อกลับภายใน 24 ชั่วโมง เพื่อให้คำปรึกษาเบื้องต้น</li>
          <li>ส่งเอกสารแนะนำ "Organization Rebirth" ตามโจทย์ของบริษัท</li>
        </ol>
      </div>

      <p style="font-size: 12px; color: #aaa; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        ส่งโดยระบบอัตโนมัติ Choomcham House Platform
      </p>
    </div>
  `;

  console.log("[Resend Service] Preparing to send email notification.");

  if (!resendApiKey) {
    console.warn("[Resend Service] Missing RESEND_API_KEY! Simulating email output below:");
    console.log("---- SIMULATED EMAIL ----");
    console.log("To:", notificationEmail);
    console.log("Subject:", emailSubject);
    console.log("Body excerpt:", emailHtml.slice(0, 500) + "...");
    console.log("-------------------------");
    return { success: true, simulated: true };
  }

  try {
    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: `Choomcham Platform <${senderEmail}>`,
      to: notificationEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    if (result.error) {
      console.error("[Resend Service] API returned error:", result.error);
      throw new Error(result.error.message);
    }

    return { success: true, id: result.data?.id, simulated: false };
  } catch (err: any) {
    console.error("[Resend Service] Catch block error:", err);
    return { success: false, error: err.message || err };
  }
}

// 3. LINE Notify Service
export async function sendLineNotification(context: any, lead: {
  name: string;
  company: string;
  position: string;
  email_or_line: string;
  score: number;
  result_level: string;
}) {
  const lineToken = getEnvVar(context, "LINE_NOTIFY_TOKEN");

  const message = `
🧟 [Lead ใหม่ - Choomcham House]
👤 คุณ ${lead.name}
🏢 บริษัท: ${lead.company}
💼 ตำแหน่ง: ${lead.position}
📞 ติดต่อ: ${lead.email_or_line}
📊 ผลลัพธ์: ${lead.result_level} (${lead.score}/40 คะแนน)

กรุณาติดต่อกลับภายใน 24 ชม. เพื่อชุบชีวิตองค์กรของลูกค้า!`;

  console.log("[LINE Notify Service] Preparing to send notification.");

  if (!lineToken) {
    console.warn("[LINE Notify Service] Missing LINE_NOTIFY_TOKEN! Simulating LINE Alert:");
    console.log("---- SIMULATED LINE NOTIFY ----");
    console.log(message);
    console.log("-------------------------------");
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${lineToken}`,
      },
      body: new URLSearchParams({ message }).toString(),
    });

    const resData: any = await response.json();

    if (!response.ok || resData.status !== 200) {
      console.error("[LINE Notify Service] API returned error:", resData);
      throw new Error(resData.message || "Failed to notify");
    }

    console.log("[LINE Notify Service] Successfully sent notification.");
    return { success: true, simulated: false };
  } catch (err: any) {
    console.error("[LINE Notify Service] Catch block error:", err);
    return { success: false, error: err.message || err };
  }
}
