import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { calculateDimensionScores, getResultLevelInfo, DIAGNOSTIC_DIMENSIONS } from "./diagnostic";

// Helper to get env variables dynamically on Cloudflare Pages, browser, or Node.js local dev
export function getEnvVar(context: any, key: string): string | undefined {
  if (context?.cloudflare?.env?.[key]) {
    return context.cloudflare.env[key];
  }
  if (typeof process !== "undefined" && process?.env?.[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== "undefined" && (import.meta as any)?.env?.[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof import.meta !== "undefined" && (import.meta as any)?.env?.[`VITE_${key}`]) {
    return (import.meta as any).env[`VITE_${key}`];
  }
  return undefined;
}

// Initialize Supabase Client
export function getSupabaseClient(context?: any) {
  const supabaseUrl = getEnvVar(context, "SUPABASE_URL") || getEnvVar(context, "VITE_SUPABASE_URL");
  const supabaseKey = getEnvVar(context, "SUPABASE_ANON_KEY") || getEnvVar(context, "VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

// 1. Supabase Services
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
  const supabase = getSupabaseClient(context);
  const dimensionScores = calculateDimensionScores(leadData.answers);

  console.log("[Supabase Service] Saving lead for:", leadData.name);

  if (!supabase) {
    console.warn("[Supabase Service] Missing credentials! Simulating DB save in development mode.");
    return { 
      success: true, 
      data: { 
        id: "mock-uuid-12345", 
        ...leadData, 
        dimensions_scores: dimensionScores,
        status: "NEW",
        created_at: new Date().toISOString() 
      }, 
      simulated: true 
    };
  }

  try {
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
          dimensions_scores: dimensionScores,
          status: "NEW",
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
    return { success: false, error: err.message || err };
  }
}

// Fetch all leads for Admin CRM
export async function fetchLeadsFromSupabase(context?: any) {
  const supabase = getSupabaseClient(context);
  if (!supabase) {
    return { success: false, data: [] };
  }

  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error("[Supabase Service] Error fetching leads:", err);
    return { success: false, error: err.message || err, data: [] };
  }
}

// Update Lead Status in CRM
export async function updateLeadStatusInSupabase(context: any, leadId: string, status: string, notes?: string) {
  const supabase = getSupabaseClient(context);
  if (!supabase) {
    return { success: true, simulated: true };
  }

  try {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", leadId)
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    console.error("[Supabase Service] Error updating lead:", err);
    return { success: false, error: err.message || err };
  }
}

// 2. Resend Email Services (Notification to Admin + Rebirth Report to Client)
export async function sendEmailNotification(context: any, lead: {
  name: string;
  company: string;
  position: string;
  email_or_line: string;
  team_size?: string;
  score: number;
  result_level: string;
  answers?: number[];
}) {
  const resendApiKey = getEnvVar(context, "RESEND_API_KEY");
  const notificationEmail = getEnvVar(context, "NOTIFICATION_EMAIL") || "leaderskillmasterclass@gmail.com";
  const senderEmail = getEnvVar(context, "SENDER_EMAIL") || "onboarding@resend.dev";
  const fromAddress = senderEmail.includes("choomcham.house") ? "onboarding@resend.dev" : senderEmail;

  const resultInfo = getResultLevelInfo(lead.score);
  const emailSubject = `🧟 [New Lead] Zombie Quiz - ${lead.name} (${lead.company}) [${lead.result_level}]`;
  
  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="display: inline-block; padding: 6px 14px; background: #faf5ff; border: 1px solid #d8b4fe; color: #6b21a8; font-weight: bold; border-radius: 9999px; font-size: 12px;">
          🧟 ZOMBIE ORGANIZATION CHECK™
        </span>
        <h2 style="color: #4044A5; margin-top: 10px; font-size: 22px;">มีผู้บริหารส่งผลประเมินองค์กรใหม่เข้ามา!</h2>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
        <tr style="background: #f8fafc;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #e2e8f0; color: #475569;">ผู้ติดต่อ:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #e2e8f0; color: #475569;">บริษัท / องค์กร:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; color: #0f172a;">${lead.company}</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #e2e8f0; color: #475569;">ตำแหน่งงาน:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; color: #0f172a;">${lead.position}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #e2e8f0; color: #475569;">ช่องทางติดต่อ:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; color: #E3346B; font-weight: bold;">${lead.email_or_line}</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #e2e8f0; color: #475569;">ขนาดทีม:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; color: #0f172a;">${lead.team_size || "ไม่ได้ระบุ"}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #e2e8f0; color: #475569;">คะแนนประเมิน:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${lead.score} / 40 คะแนน</td>
        </tr>
        <tr style="background: #fff1f2;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #e2e8f0; color: #9f1239;">ผลลัพธ์ประเมิน:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #be123c;">${resultInfo.badge}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #fdf2f8; border-radius: 12px; border: 1px solid #fbcfe8;">
        <p style="margin: 0; color: #9d174d; font-weight: bold; font-size: 14px;">🎯 Next Action Steps:</p>
        <p style="margin: 6px 0 0 0; color: #831843; font-size: 13px; line-height: 1.5;">
          ${resultInfo.recommendation}
        </p>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://choomcham.pages.dev/admin/crm" style="display: inline-block; background: #4044A5; color: #ffffff; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 13px;">
          เปิดดูบน Choomcham House OS
        </a>
      </div>
    </div>
  `;

  if (!resendApiKey) {
    console.warn("[Resend Service] Missing RESEND_API_KEY! Simulated email logged.");
    return { success: true, simulated: true };
  }

  try {
    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: `Choomcham Platform <${fromAddress}>`,
      to: notificationEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    return { success: true, id: result.data?.id, simulated: false };
  } catch (err: any) {
    console.error("[Resend Service] Error sending email:", err);
    return { success: false, error: err.message || err };
  }
}

// 3. LINE OA Messaging API — High-End Flex Message Generator
export function generateLineFlexMessage(lead: {
  name: string;
  company: string;
  position: string;
  email_or_line: string;
  score: number;
  result_level: string;
  team_size?: string;
}) {
  const resultInfo = getResultLevelInfo(lead.score);
  const themeColor = lead.result_level === "ZOMBIE" ? "#E11D48" :
                     lead.result_level === "FADED" ? "#EA580C" :
                     lead.result_level === "TIRED" ? "#D97706" : "#059669";

  return {
    type: "flex",
    altText: `🧟 [Lead ใหม่] ${lead.name} (${lead.company}) - ${lead.result_level}`,
    contents: {
      type: "bubble",
      size: "giga",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#4044A5",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "🧟 ZOMBIE ORGANIZATION CHECK™",
            color: "#FDE047",
            weight: "bold",
            size: "xxs"
          },
          {
            type: "text",
            text: "มีผลประเมินสุขภาพองค์กรใหม่",
            color: "#FFFFFF",
            weight: "bold",
            size: "lg",
            margin: "xs"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "บริษัท:", color: "#64748B", size: "sm", flex: 2 },
              { type: "text", text: lead.company, color: "#0F172A", weight: "bold", size: "sm", flex: 4 }
            ]
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "ผู้ติดต่อ:", color: "#64748B", size: "sm", flex: 2 },
              { type: "text", text: `${lead.name} (${lead.position})`, color: "#0F172A", size: "sm", flex: 4 }
            ]
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "ติดต่อ:", color: "#64748B", size: "sm", flex: 2 },
              { type: "text", text: lead.email_or_line, color: "#E3346B", weight: "bold", size: "sm", flex: 4 }
            ]
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "ระดับประเมิน:", color: "#64748B", size: "sm", flex: 2 },
              { type: "text", text: `${lead.result_level} (${lead.score}/40 คะแนน)`, color: themeColor, weight: "bold", size: "sm", flex: 4 }
            ]
          },
          {
            type: "box",
            layout: "vertical",
            backgroundColor: "#F8FAFC",
            paddingAll: "12px",
            cornerRadius: "10px",
            margin: "md",
            contents: [
              { type: "text", text: "🎯 ข้อเสนอแนะเบื้องต้น:", color: "#334155", weight: "bold", size: "xs" },
              { type: "text", text: resultInfo.recommendation, color: "#64748B", size: "xxs", wrap: true, margin: "xs" }
            ]
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#4044A5",
            action: {
              type: "uri",
              label: "เปิดดูบน Choomcham CRM",
              uri: "https://choomcham.pages.dev/admin/crm"
            }
          }
        ]
      }
    }
  };
}

// 4. LINE OA Messaging API Service (Flex Message + Push)
export async function sendLineNotification(context: any, lead: {
  name: string;
  company: string;
  position: string;
  email_or_line: string;
  score: number;
  result_level: string;
  team_size?: string;
}) {
  const lineChannelToken = getEnvVar(context, "LINE_CHANNEL_ACCESS_TOKEN") || getEnvVar(context, "LINE_NOTIFY_TOKEN");
  const lineTargetUserId = getEnvVar(context, "LINE_TARGET_USER_ID");

  if (!lineChannelToken) {
    console.warn("[LINE Service] Missing LINE credentials! Simulated notification logged.");
    return { success: true, simulated: true };
  }

  try {
    const isValidTargetUser = lineTargetUserId && !lineTargetUserId.includes("PASTE_");
    const flexMessage = generateLineFlexMessage(lead);

    if (isValidTargetUser) {
      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineChannelToken}`,
        },
        body: JSON.stringify({
          to: lineTargetUserId,
          messages: [flexMessage]
        })
      });
      const data: any = await res.json();
      return { success: res.ok, data };
    } else {
      // Broadcast fallback so followers of LINE OA receive it
      const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineChannelToken}`,
        },
        body: JSON.stringify({
          messages: [flexMessage]
        })
      });
      const data: any = await res.json();
      return { success: res.ok, data };
    }
  } catch (err: any) {
    console.error("[LINE Service] Error sending notification:", err);
    return { success: false, error: err.message || err };
  }
}

// 5. Cloudflare R2 Storage Service (Asset Upload Helper)
export async function uploadAssetToR2(context: any, file: File | Blob, fileName: string) {
  const r2Bucket = context?.cloudflare?.env?.CHOOMCHAM_R2_BUCKET;

  if (!r2Bucket) {
    console.warn("[R2 Storage] R2 Bucket binding not found in current context. Returning mock URL.");
    return {
      success: true,
      url: `https://assets.choomcham.house/${fileName}`,
      simulated: true,
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    await r2Bucket.put(fileName, arrayBuffer, {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    const publicUrl = `https://assets.choomcham.house/${fileName}`;
    return { success: true, url: publicUrl, simulated: false };
  } catch (err: any) {
    console.error("[R2 Storage] Error uploading file to R2:", err);
    return { success: false, error: err.message || err };
  }
}

// 6. AI Transformation Consultant & Proposal Generator
export async function generateAiProposalRecommendation(context: any, clientData: {
  company: string;
  result_level: string;
  score: number;
  dominant_pain: string;
  team_size: string;
}) {
  const apiKey = getEnvVar(context, "OPENAI_API_KEY") || getEnvVar(context, "GEMINI_API_KEY");

  // If no AI key provided, return deterministic structured template
  if (!apiKey) {
    return {
      recommendedProgram: clientData.score < 20 ? "REBORN PEOPLE & ALIVE TEAM (2 Days Custom Workshop)" : "LIVING ORGANIZATION TRANSFORMATION (Quarterly Program)",
      investmentRange: "฿120,000 - ฿280,000",
      keyTransformationObjectives: [
        "ทลายกำแพง Silo และความกลัวในการออกความคิดเห็น (Psychological Safety)",
        "ชุบชีวิตและจุดประกายความหมายในการทำงานใหม่ (Meaning & Purpose Rebirth)",
        "สร้างกติกาใจของทีมในการขับเคลื่อนเป้าหมายร่วมกัน (Team Alignment)"
      ],
      estimatedTimeline: "4 - 8 สัปดาห์",
    };
  }

  // AI Prompt Integration can be called dynamically here
  return {
    recommendedProgram: "AI Custom Transformation Blueprint for " + clientData.company,
    investmentRange: "Custom Proposal",
    keyTransformationObjectives: ["Custom Diagnostic Assessment", "Leadership Alignment", "Culture Rebirth"],
    estimatedTimeline: "6 สัปดาห์"
  };
}
