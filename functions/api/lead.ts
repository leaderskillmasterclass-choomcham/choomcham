import { createClient } from "@supabase/supabase-js";
import {
  calculateDimensionScores,
  getResultLevelInfo,
} from "../../app/lib/diagnostic";
import { Resend } from "resend";

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;

  try {
    if (
      request.headers.get("Origin") &&
      request.headers.get("Origin") !== new URL(request.url).origin
    )
      return new Response(JSON.stringify({ error: "คำขอไม่ถูกต้อง" }), {
        status: 403,
      });
    if (!request.headers.get("Content-Type")?.includes("application/json"))
      return new Response(JSON.stringify({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }), {
        status: 415,
      });
    const raw = await request.text();
    if (raw.length > 20000)
      return new Response(JSON.stringify({ error: "ข้อมูลใหญ่เกินไป" }), {
        status: 413,
      });
    const body = JSON.parse(raw) as {
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

    if (
      ![body.name, body.company, body.email_or_line].every(
        (v) => typeof v === "string" && v.trim().length > 0 && v.length <= 500,
      ) ||
      (body.position !== undefined &&
        (typeof body.position !== "string" || body.position.length > 500)) ||
      (body.team_size !== undefined &&
        (typeof body.team_size !== "string" || body.team_size.length > 500))
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required lead fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const contactTypes = [
      "CONSULTATION",
      "PROGRAM_INQUIRY",
      "PROPOSAL_REQUEST",
    ];
    const isQuiz = !contactTypes.includes(body.result_level);
    if (isQuiz) {
      if (
        !Array.isArray(body.answers) ||
        body.answers.length !== 10 ||
        !body.answers.every((v) => Number.isInteger(v) && v >= 1 && v <= 4)
      )
        return new Response(
          JSON.stringify({ error: "คำตอบแบบประเมินไม่ถูกต้อง" }),
          { status: 400 },
        );
      body.score = body.answers.reduce((sum, v) => sum + v, 0);
      body.result_level = getResultLevelInfo(body.score).level;
      body.dimensions_scores = calculateDimensionScores(body.answers);
    } else {
      body.score = 0;
      body.answers = [];
      body.dimensions_scores = {
        program_interest:
          typeof body.dimensions_scores?.program_interest === "string"
            ? body.dimensions_scores.program_interest.slice(0, 300)
            : "",
      };
    }
    const supabaseUrl = env.SUPABASE_URL,
      supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey)
      return new Response(
        JSON.stringify({ error: "ระบบรับข้อมูลยังไม่ได้ตั้งค่า" }),
        { status: 503 },
      );
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name: body.name.trim(),
          company: body.company.trim(),
          position: body.position || "",
          email_or_line: body.email_or_line.trim(),
          team_size: body.team_size || null,
          score: body.score,
          result_level: body.result_level,
          answers: body.answers,
          dimensions_scores: body.dimensions_scores || {},
          status: "NEW",
        },
      ])
      .select();
    if (error || !data?.[0]?.id)
      return new Response(
        JSON.stringify({ error: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่" }),
        { status: 503 },
      );
    const savedData = data[0];
    const escapeHtml = (value: string) =>
      String(value || "").replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c]!,
      );

    // 2. Resend Email Trigger on Edge
    const resendApiKey = env.RESEND_API_KEY;
    const notificationEmail =
      env.NOTIFICATION_EMAIL || "leaderskillmasterclass@gmail.com";
    const senderEmail = env.SENDER_EMAIL || "onboarding@resend.dev";

    if (resendApiKey && env.NOTIFICATION_EMAIL && env.SENDER_EMAIL) {
      const resend = new Resend(resendApiKey);
      await resend.emails
        .send({
          from: `Choomcham Platform <${senderEmail}>`,
          to: notificationEmail,
          subject: `🧟 [Edge Lead] ${escapeHtml(body.name)} (${escapeHtml(body.company)}) - ${escapeHtml(body.result_level)}`,
          html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #4044A5;">🧟 New Zombie Organization Diagnostic Lead</h2>
            <p><strong>ผู้ติดต่อ:</strong> ${escapeHtml(body.name)}</p>
            <p><strong>บริษัท:</strong> ${escapeHtml(body.company)}</p>
            <p><strong>ตำแหน่ง:</strong> ${escapeHtml(body.position)}</p>
            <p><strong>ช่องทางติดต่อ:</strong> ${escapeHtml(body.email_or_line)}</p>
            <p><strong>ผลประเมิน:</strong> ${escapeHtml(body.result_level)} (${body.score}/40 คะแนน)</p>
            <div style="margin-top: 20px;">
              <a href="https://choomcham.pages.dev/admin/crm" style="background: #4044A5; color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none;">เปิดระบบหลังบ้าน Choomcham House OS</a>
            </div>
          </div>
        `,
        })
        .catch((err) => console.error("Edge Resend Error:", err));
    }

    // 3. LINE OA Messaging API Push (Interactive Flex Message on Edge)
    const lineChannelToken =
      env.LINE_CHANNEL_ACCESS_TOKEN || env.LINE_NOTIFY_TOKEN;
    const lineTargetUserId = env.LINE_TARGET_USER_ID;

    if (lineChannelToken) {
      const isValidTargetUser =
        lineTargetUserId && /^[UCR][0-9a-f]{32}$/i.test(lineTargetUserId);
      const isProposal =
        body.result_level === "PROPOSAL_REQUEST" ||
        body.result_level === "PROPOSAL";
      const isConsultOrProposal =
        isProposal ||
        body.result_level === "CONSULT_BRIEF" ||
        body.result_level === "PROGRAM_INQUIRY" ||
        body.result_level === "CONSULTATION" ||
        body.result_level === "INQUIRY";

      const badgeText = isProposal
        ? "📑 คำขอ PROPOSAL & ใบเสนอราคา"
        : isConsultOrProposal
          ? "🎯 นัดพูดคุย & ปรึกษาโจทย์องค์กร"
          : "🧟 ZOMBIE ORGANIZATION CHECK™";

      const headerTitle = isProposal
        ? "มีคำขอ Proposal & ใบเสนอราคาหลักสูตร"
        : isConsultOrProposal
          ? "มีนัดพูดคุยปรึกษาโจทย์องค์กรใหม่"
          : "มีผลประเมินสุขภาพองค์กรใหม่";

      const themeColor =
        body.result_level === "ZOMBIE"
          ? "#E11D48"
          : body.result_level === "FADED"
            ? "#EA580C"
            : body.result_level === "TIRED"
              ? "#D97706"
              : isProposal
                ? "#E3346B"
                : isConsultOrProposal
                  ? "#9333EA"
                  : "#059669";

      const selectedProgramName =
        body.dimensions_scores?.program_interest ||
        body.team_size ||
        "ไม่ได้ระบุหลักสูตร";

      const flexMessage = {
        type: "flex",
        altText: isProposal
          ? `📑 [ขอ Proposal] ${escapeHtml(body.name)} (${escapeHtml(body.company)}) - ${selectedProgramName}`
          : isConsultOrProposal
            ? `🎯 [นัดคุย/ปรึกษา] ${escapeHtml(body.name)} (${escapeHtml(body.company)})`
            : `🧟 [Lead ใหม่] ${escapeHtml(body.name)} (${escapeHtml(body.company)}) - ${escapeHtml(body.result_level)}`,
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
                text: badgeText,
                color: "#FDE047",
                weight: "bold",
                size: "xxs",
              },
              {
                type: "text",
                text: headerTitle,
                color: "#FFFFFF",
                weight: "bold",
                size: "lg",
                margin: "xs",
              },
            ],
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
                  {
                    type: "text",
                    text: "บริษัท:",
                    color: "#64748B",
                    size: "sm",
                    flex: 2,
                  },
                  {
                    type: "text",
                    text: body.company,
                    color: "#0F172A",
                    weight: "bold",
                    size: "sm",
                    flex: 4,
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "ผู้ติดต่อ:",
                    color: "#64748B",
                    size: "sm",
                    flex: 2,
                  },
                  {
                    type: "text",
                    text: `${escapeHtml(body.name)} (${body.position || "ไม่ระบุตำแหน่ง"})`,
                    color: "#0F172A",
                    size: "sm",
                    flex: 4,
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "ติดต่อ:",
                    color: "#64748B",
                    size: "sm",
                    flex: 2,
                  },
                  {
                    type: "text",
                    text: body.email_or_line,
                    color: "#E3346B",
                    weight: "bold",
                    size: "sm",
                    flex: 4,
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: isProposal
                      ? "หลักสูตรที่ขอ:"
                      : isConsultOrProposal
                        ? "ความต้องการ:"
                        : "ระดับประเมิน:",
                    color: "#64748B",
                    size: "sm",
                    flex: 2,
                  },
                  {
                    type: "text",
                    text: isConsultOrProposal
                      ? selectedProgramName
                      : `${escapeHtml(body.result_level)} (${body.score}/40 คะแนน)`,
                    color: themeColor,
                    weight: "bold",
                    size: "sm",
                    flex: 4,
                    wrap: true,
                  },
                ],
              },
            ],
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
                  uri: "https://choomcham.pages.dev/admin/crm",
                },
              },
            ],
          },
        },
      };

      if (isValidTargetUser) {
        // Direct Push to specific Admin/User ID
        await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lineChannelToken}`,
          },
          body: JSON.stringify({
            to: lineTargetUserId,
            messages: [flexMessage],
          }),
        }).catch((err) => console.error("Edge LINE Push Error:", err));
      }
    }

    return new Response(JSON.stringify({ success: true, lead: savedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "ข้อมูลไม่ถูกต้องหรือระบบรับข้อมูลไม่พร้อม" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
