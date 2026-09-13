import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;

  try {
    const body = await request.json() as {
      name: string;
      company: string;
      position: string;
      email_or_line: string;
      team_size?: string;
      score: number;
      result_level: string;
      answers: number[];
      dimensions_scores?: any;
    };

    if (!body.name || !body.company || !body.email_or_line) {
      return new Response(JSON.stringify({ error: "Missing required lead fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Supabase Edge Proxy Insert
    const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

    let savedData: any = { id: `edge-${Date.now()}`, ...body, status: "NEW", created_at: new Date().toISOString() };
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("leads")
        .insert([{
          name: body.name,
          company: body.company,
          position: body.position,
          email_or_line: body.email_or_line,
          team_size: body.team_size || null,
          score: body.score,
          result_level: body.result_level,
          answers: body.answers || [],
          dimensions_scores: body.dimensions_scores || {},
          status: "NEW"
        }])
        .select();

      if (!error && data?.[0]) {
        savedData = data[0];
      }
    }

    // 2. Resend Email Trigger on Edge
    const resendApiKey = env.RESEND_API_KEY;
    const notificationEmail = env.NOTIFICATION_EMAIL || "owner@choomcham.house";
    const senderEmail = env.SENDER_EMAIL || "noreply@choomcham.house";

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: `Choomcham Platform <${senderEmail}>`,
        to: notificationEmail,
        subject: `🧟 [Edge Lead] ${body.name} (${body.company}) - ${body.result_level}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #4044A5;">🧟 New Zombie Organization Diagnostic Lead</h2>
            <p><strong>ผู้ติดต่อ:</strong> ${body.name}</p>
            <p><strong>บริษัท:</strong> ${body.company}</p>
            <p><strong>ตำแหน่ง:</strong> ${body.position}</p>
            <p><strong>ช่องทางติดต่อ:</strong> ${body.email_or_line}</p>
            <p><strong>ผลประเมิน:</strong> ${body.result_level} (${body.score}/40 คะแนน)</p>
            <div style="margin-top: 20px;">
              <a href="https://choomcham.pages.dev/admin/crm" style="background: #4044A5; color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none;">เปิดระบบหลังบ้าน Choomcham House OS</a>
            </div>
          </div>
        `
      }).catch(err => console.error("Edge Resend Error:", err));
    }

    // 3. LINE OA Messaging API Push (Interactive Flex Message on Edge)
    const lineChannelToken = env.LINE_CHANNEL_ACCESS_TOKEN || env.LINE_NOTIFY_TOKEN;
    const lineTargetUserId = env.LINE_TARGET_USER_ID;

    if (lineChannelToken) {
      if (lineTargetUserId) {
        const themeColor = body.result_level === "ZOMBIE" ? "#E11D48" :
                           body.result_level === "FADED" ? "#EA580C" :
                           body.result_level === "TIRED" ? "#D97706" : "#059669";

        const flexMessage = {
          type: "flex",
          altText: `🧟 [Lead ใหม่] ${body.name} (${body.company}) - ${body.result_level}`,
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
                    { type: "text", text: body.company, color: "#0F172A", weight: "bold", size: "sm", flex: 4 }
                  ]
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    { type: "text", text: "ผู้ติดต่อ:", color: "#64748B", size: "sm", flex: 2 },
                    { type: "text", text: `${body.name} (${body.position})`, color: "#0F172A", size: "sm", flex: 4 }
                  ]
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    { type: "text", text: "ติดต่อ:", color: "#64748B", size: "sm", flex: 2 },
                    { type: "text", text: body.email_or_line, color: "#E3346B", weight: "bold", size: "sm", flex: 4 }
                  ]
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    { type: "text", text: "ระดับประเมิน:", color: "#64748B", size: "sm", flex: 2 },
                    { type: "text", text: `${body.result_level} (${body.score}/40 คะแนน)`, color: themeColor, weight: "bold", size: "sm", flex: 4 }
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

        await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lineChannelToken}`,
          },
          body: JSON.stringify({
            to: lineTargetUserId,
            messages: [flexMessage]
          })
        }).catch(err => console.error("Edge LINE Push Error:", err));
      } else {
        const textMsg = `🧟 [Lead ใหม่ - Choomcham House]
👤 ผู้ติดต่อ: ${body.name} (${body.position})
🏢 บริษัท: ${body.company}
📞 ติดต่อ: ${body.email_or_line}
📊 ผลลัพธ์: ${body.result_level} (${body.score}/40 คะแนน)
👉 ดูรายละเอียดบน CRM: https://choomcham.pages.dev/admin/crm`;

        await fetch("https://notify-api.line.me/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${lineChannelToken}`,
          },
          body: new URLSearchParams({ message: `\n${textMsg}` }).toString(),
        }).catch(err => console.error("Edge LINE Notify Error:", err));
      }
    }

    return new Response(JSON.stringify({ success: true, lead: savedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Edge processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
