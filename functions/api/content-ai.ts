import { authorize, json } from "../lib/admin-auth";

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  const auth = await authorize(request, env);
  if (auth.response) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const {
      contentType = "carousel",
      angle = "ORGANIZATION",
      topic = "จาก Zombie Worker สู่ Living Organization",
      targetAudience = "ผู้บริหาร, HRD, และคนทำงานยุคใหม่",
      customInstructions = "",
    } = body as any;

    const apiKey =
      env.DEEPSEEK_API_KEY ||
      env.Deepseek_API_Key ||
      env.OPENAI_API_KEY ||
      env.GEMINI_API_KEY;

    if (!apiKey) {
      return json(
        {
          error:
            "ยังไม่ได้ตั้งค่า DEEPSEEK_API_KEY หรือ OPENAI_API_KEY ในระบบ Environment Variables",
        },
        400,
      );
    }

    const systemPrompt = `คุณคือ "Choomcham AI Content Strategist" ที่ปรึกษาและนักสร้างสรรค์เนื้อหาระดับสูงของแบรนด์ "บ้านชุ่มฉ่ำ (Choomcham House)"
สโลแกนแบรนด์: Helping People & Organizations Reborn From Within (ฟื้นฟูคนและองค์กรให้เกิดใหม่จากข้างใน)

หลักการและแก่นความคิดของบ้านชุ่มฉ่ำ:
1. ปัญหาหลักในองค์กร: ภาวะ Zombie Worker (คนยังอยู่แต่ใจไม่อยู่), Silent Silos (ความเงียบในห้องประชุม), Burnout จากการขาดความหมาย
2. Brand Belief: "องค์กรที่มีชีวิต เริ่มต้นจากคนที่มีชีวิต" (Living Organization starts with Living People)
3. เครื่องมือหลัก: 5-Stage Rebirth Model (1. RESET ล้างความล้า ➔ 2. RECONNECT เชื่อมหัวใจ ➔ 3. RECHARGE เติมไฟในใจ ➔ 4. REIMAGINE มองมุมใหม่ ➔ 5. RECREATE ลงมือสร้างใหม่)
4. โทนเสียง (Tone of Voice): ลึกซึ้ง (Profound), อบอุ่น (Warm), เข้าอกเข้าใจ (Empathetic), ปราศจากการตัดสิน (Psychological Safety), ทันสมัยและกระตุ้นการตระหนักรู้ (Transformational)
5. กรอบ DMF Journey ในการรังสรรค์เนื้อหา:
   - รู้ (Hook / Problem awareness)
   - เห็น (Reality check / Perspective shift)
   - รู้สึก (Core insight / Self reflection)
   - สัมผัส (Practical micro-practice / Real scenario)
   - สอดคล้อง (Micro action / Call to Action)

โปรดสร้างสรรค์เนื้อหาภาษาไทยอย่างประณีต สละสลวย ตรงประเด็น ทรงพลัง และมีโครงสร้าง Markdown ที่ชัดเจนพร้อมนำไปใช้งาน`;

    let userPrompt = "";

    if (contentType === "carousel") {
      userPrompt = `กรุณาสร้างเนื้อหาสำหรับ **10-Card Social Media Carousel (DMF Framework)**
- **หัวข้อ:** ${topic}
- **มุมมอง (Angle):** ${angle} (PEOPLE / TEAM / LEADER / ORGANIZATION)
- **กลุ่มเป้าหมาย:** ${targetAudience}
${customInstructions ? `- **คำสั่งเพิ่มเติม:** ${customInstructions}` : ""}

โครงสร้างที่ต้องมี:
1. สรุปหัวข้อ, Angle, และ DMF Journey
2. รายละเอียดการ์ดครบ 10 ใบ โดยแต่ละใบระบุ:
   - Headline
   - Body Copy (เว้นบรรทัดให้อ่านง่าย)
   - Key Message
   - Visual Direction (คำแนะนำเรื่องสี/ภาพ/สัญลักษณ์)
   - Caption Bridge (ถ้ามี)
3. ส่วนท้าย: Social Media Caption พร้อม Emoji และ Hashtags ที่เกี่ยวข้อง พร้อม Call to Action ให้ตรวจสุขภาพองค์กรที่ choomcham.pages.dev`;
    } else if (contentType === "article") {
      userPrompt = `กรุณาเขียนบทความ **Thought Leadership Article (เจาะลึก 5-Stage Model)**
- **หัวข้อ:** ${topic}
- **มุมมอง (Angle):** ${angle}
- **กลุ่มเป้าหมาย:** ${targetAudience}
${customInstructions ? `- **คำสั่งเพิ่มเติม:** ${customInstructions}` : ""}

โครงสร้างบทความ:
1. บทนำ: สัญญาณและเสียงสะท้อนที่ไร้เสียงในองค์กรยุคใหม่
2. แก่นของปัญหา (Root Cause): ทำไมวิธีแก้แบบเดิมถึงไม่ได้ผล
3. ทางออกด้วย 5-Stage Rebirth Process (RESET, RECONNECT, RECHARGE, REIMAGINE, RECREATE) ที่ปรับใช้กับหัวข้อนี้
4. ตัวอย่างการปฏิบัติจริงและผลลัพธ์
5. บทสรุปสร้างแรงบันดาลใจและคำถามปลายเปิด`;
    } else {
      userPrompt = `กรุณาเขียน **สคริปต์คลิปสั้น 60 วินาที (60s Video Script for TikTok / Reels / Shorts)**
- **หัวข้อ:** ${topic}
- **มุมมอง (Angle):** ${angle}
- **กลุ่มเป้าหมาย:** ${targetAudience}
${customInstructions ? `- **คำสั่งเพิ่มเติม:** ${customInstructions}` : ""}

โครงสร้างเวลา (Timing):
- [00:00 - 00:05] HOOK (หยุดสายตา + คำพูดเปิดกระแทกใจ)
- [00:05 - 00:20] THE TENSION (ขยี้ปัญหา + ภาพประกอบ)
- [00:20 - 00:45] THE INSIGHT & SHIFT (เปลี่ยนมุมมอง + 5-Stage Concept)
- [00:45 - 01:00] ACTION & CTA (ชวนเช็ก Zombie Check ฟรีที่ choomcham.pages.dev)`;
    }

    // Call DeepSeek API (OpenAI Compatible)
    const isDeepSeek = Boolean(env.DEEPSEEK_API_KEY || env.Deepseek_API_Key);
    const endpoint = isDeepSeek
      ? "https://api.deepseek.com/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const model = isDeepSeek ? "deepseek-chat" : "gpt-4o-mini";

    const aiRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return json(
        {
          error: `AI Provider ตอบกลับผิดพลาด (${aiRes.status}): ${errText}`,
        },
        502,
      );
    }

    const aiData: any = await aiRes.json();
    const generatedContent =
      aiData.choices?.[0]?.message?.content || "ไม่สามารถสร้างเนื้อหาได้";

    return json({
      success: true,
      data: {
        content: generatedContent,
        provider: isDeepSeek ? "DeepSeek V3" : "OpenAI",
        model,
      },
    });
  } catch (error) {
    return json(
      { error: (error as Error).message || "เกิดข้อผิดพลาดในการเรียก AI" },
      500,
    );
  }
}
