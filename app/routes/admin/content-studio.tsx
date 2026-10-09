import React, { useState } from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { adminFetch } from "~/lib/admin-api.client";
import {
  Sparkles,
  Copy,
  CheckCircle2,
  Download,
  Layers,
  FileText,
  Video,
  RefreshCw,
  BookOpen,
  Send,
  Sliders,
  ChevronRight,
  Eye,
  Hash,
  Lightbulb,
  Bot,
  Zap,
  Cpu,
  AlertCircle,
} from "lucide-react";

export function meta() {
  return [{ title: "Content Studio · AI & DMF Studio | Choomcham House OS" }];
}

const PRESET_TOPICS = [
  {
    title: "คนยังมาทำงาน แต่ใจไม่ได้อยู่แล้ว (Zombie Worker)",
    category: "ORGANIZATION",
    hook: "สิ่งที่น่ากลัวที่สุดไม่ใช่คนลาออก... แต่คือคนยังอยู่แต่ใจไม่ได้อยู่แล้ว",
    insight:
      "เราไม่ได้เหนื่อยเพราะงานเยอะเสมอไป แต่เราเหนื่อยเพราะไม่รู้ว่าสิ่งที่ทำอยู่มีความหมายอะไร",
  },
  {
    title: "ทำไมยิ่งประชุมเยอะ องค์กรยิ่งเงียบและไร้ไอเดียใหม่ (Silent Silos)",
    category: "TEAM",
    hook: "ห้องประชุมที่เงียบที่สุด มักไม่ใช่ห้องที่ไม่มีปัญหา แต่เป็นห้องที่ไม่มีความปลอดภัย",
    insight:
      "เมื่อ Psychological Safety หายไป คนจะเลือกความอยู่รอดมากกว่าความจริงใจ",
  },
  {
    title: "จากหมดไฟ สู่การเกิดใหม่จากข้างใน (Inner Rebirth)",
    category: "PEOPLE",
    hook: "การหมดไฟ ไม่ใช่เพราะคุณอ่อนแอ แต่เพราะคุณแบกสิ่งที่ไม่มีความหมายมานานเกินไป",
    insight:
      "การฟื้นฟูไม่ใช่แค่การนอนพัก แต่คือการต่อท่อพลังชีวิตและความหมายใหม่ให้ตัวเอง",
  },
  {
    title:
      "ผู้นำที่แท้จริง ไม่ได้มีคำตอบทุกเรื่อง แต่สร้างพื้นที่ให้ทุกคนกล้าหาคำตอบ",
    category: "LEADER",
    hook: "ผู้นำที่เก่งที่สุด ไม่ใช่คนที่รู้ทุกอย่าง แต่คือคนที่ทำให้คนในทีมรู้สึกปลอดภัยที่จะลองผิดลองถูก",
    insight:
      "Empathy และ Presence คืออาวุธที่ทรงพลังที่สุดของการนำการเปลี่ยนแปลง",
  },
  {
    title: "5 ขั้นตอนเปลี่ยน Zombie สู่ Living Organization (5-Stage Model)",
    category: "ORGANIZATION",
    hook: "เปลี่ยนองค์กรแห้งแล้ง ให้กลับมาชุ่มฉ่ำและมีชีวิตชีวาด้วย Reset → Recreate",
    insight: "องค์กรที่มีชีวิต เริ่มต้นจากคนที่มีชีวิต",
  },
];

export default function AdminContentStudio() {
  const [contentType, setContentType] = useState<
    "carousel" | "article" | "reel"
  >("carousel");
  const [selectedAngle, setSelectedAngle] = useState<
    "PEOPLE" | "TEAM" | "LEADER" | "ORGANIZATION"
  >("ORGANIZATION");
  const [customTopic, setCustomTopic] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [targetAudience, setTargetAudience] = useState(
    "ผู้บริหาร, HRD, และคนทำงานยุคใหม่",
  );
  const [useAI, setUseAI] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [providerInfo, setProviderInfo] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate Content with DeepSeek AI or DMF Template
  const handleGenerate = async (topicToUse?: string) => {
    setIsGenerating(true);
    setStatusMessage(null);
    const activeTopic = topicToUse || customTopic || PRESET_TOPICS[0].title;

    if (useAI) {
      try {
        const res = await adminFetch("/api/content-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType,
            angle: selectedAngle,
            topic: activeTopic,
            targetAudience,
            customInstructions,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.data?.content) {
          setGeneratedContent(data.data.content);
          setProviderInfo(`${data.data.provider || "DeepSeek AI"} (${data.data.model || "deepseek-chat"})`);
          setStatusMessage("✨ สร้างสำเร็จด้วย DeepSeek AI ตามหลัก DMF Framework");
          setIsGenerating(false);
          return;
        } else {
          console.warn("AI generation error, falling back to template:", data.error);
          setStatusMessage(`⚠️ AI: ${data.error || "ระบบขัดข้อง"} — ปรับไปใช้ Template อัจฉริยะแทน`);
        }
      } catch (err) {
        console.warn("AI fetch failed, falling back to template:", err);
        setStatusMessage("⚠️ เรียก AI ไม่สำเร็จ — แสดงเนื้อหาจาก Template อัจฉริยะ");
      }
    }

    // Template Fallback
    setTimeout(() => {
      setProviderInfo("Choomcham DMF Template Generator");
      if (contentType === "carousel") {
        setGeneratedContent(
          `
# 🔮 CHOOMCHAM HOUSE — SOCIAL CAROUSEL (10 CARDS)
**หัวข้อ:** ${activeTopic}
**มุมมอง (Angle):** ${selectedAngle}
**กลุ่มเป้าหมาย:** ${targetAudience}
**DMF Journey:** รู้ ➔ เห็น ➔ รู้สึก ➔ สัมผัส ➔ สอดคล้อง

---

### CARD 01 — HOOK (รู้)
* **Headline:** คนยังมาทำงาน... แต่ใจไม่ได้อยู่กับองค์กรแล้วหรือเปล่า?
* **Body Copy:** 
  งานยังเดินไปตาม KPI ปกติ
  แต่หากสังเกตดี ๆ
  พลังงานสร้างสรรค์ ความสดใส และเสียงหัวเราะ
  กำลังค่อย ๆ หดหายไปทีละส่วน
* **Key Message:** ชี้ให้เห็นภาวะ Zombie Worker ที่กำลังเกิดขึ้นเงียบ ๆ
* **Visual Direction:** Typography ตัวหนาสี Brand Purple บนพื้นสีขาว คลื่น Organic Curve สีชมพู Action Pink
* **Caption Bridge:** แล้วอะไรคือความจริงที่ซ่อนอยู่ข้างหลัง? ➔

---

### CARD 02 — PROBLEM (รู้)
* **Headline:** สิ่งที่น่ากลัวที่สุดไม่ใช่ “คนลาออก”
* **Body Copy:**
  แต่คือ...
  คนยังอยู่ครบ
  แต่ไม่มีใจที่จะสร้างสิ่งใหม่
  ทำตามคำสั่งไปวัน ๆ เพื่อรอเวลาเลิกงาน
* **Key Message:** อาการของ Silent Silos และความเหนื่อยสะสม
* **Visual Direction:** Card สี Surface นุ่มตา พร้อม Icon 🧟 และเส้นตัดขวาง

---

### CARD 03 — REALITY CHECK (เห็น)
* **Headline:** เราอาจคิดว่าคนเหนื่อยเพราะ “งานเยอะ”
* **Body Copy:**
  แต่ความจริงคือ...
  คนเราไม่ได้หมดไฟเพราะงานหนักเสมอไป
  เราหมดไฟเพราะ “ไม่รู้ว่าสิ่งที่ทำอยู่มีความหมายอะไร”
  และไม่มีพื้นที่ปลอดภัยให้พูดความจริง
* **Key Message:** Perspective Shift จากแก้ปัญหางาน เป็นแก้ปัญหาความหมายและความสัมพันธ์
* **Visual Direction:** แบ่งครึ่งเปรียบเทียบซ้าย-ขวา (Old Thinking vs Reality)

---

### CARD 04 — MINDSET SHIFT (เห็น)
* **Headline:** จาก “องค์กรหุ่นยนต์” สู่ “องค์กรที่มีชีวิต”
* **Body Copy:**
  องค์กรไม่ใช่เครื่องจักรที่แค่หยอดน้ำมันแล้วจะวิ่งเร็วขึ้น
  แต่องค์กรคือ “สิ่งมีชีวิต”
  ที่ต้องการความไว้วางใจ ความสดชื่น และความหมาย
* **Key Message:** Brand Core Belief: Living Organization เริ่มต้นจากคนที่มีชีวิต
* **Visual Direction:** ไล่เฉดสีจาก Dry (เทาหม่น) ➔ Juicy (เขียว Growth Green + เหลือง Energy)

---

### CARD 05 — CORE INSIGHT (รู้สึก)
* **Headline:** “องค์กรที่มีชีวิต เริ่มจากคนที่มีชีวิต”
* **Body Copy:**
  เมื่อหัวใจของคนในทีมได้รับฟังและปลุกพลังใหม่
  ความร่วมมือ (Collaboration) และนวัตกรรม (Creativity)
  จะผุดขึ้นมาเองโดยไม่ต้องคอยสั่งการ
* **Key Message:** The Big Idea ของ Choomcham House
* **Visual Direction:** Headline ตัวใหญ่เด่นตรงกลาง ล้อมรอบด้วย Brand Glow Aura

---

### CARD 06 — SELF REFLECTION (รู้สึก)
* **Headline:** ลองหยุด 10 วินาที แล้วถามตัวเอง...
* **Body Copy:**
  1. ในการประชุมล่าสุด ทีมของคุณกล้าพูดสิ่งที่คิดจริง ๆ ไหม?
  2. คุณจำได้ไหมว่า ครั้งสุดท้ายที่ทีมทำงานด้วยความสนุกและมีพลังคือเมื่อไร?
* **Key Message:** กระตุ้นการตระหนักรู้และสำรวจบรรยากาศจริงในทีม
* **Visual Direction:** การ์ดคำถามเรียบหรู พื้นหลังสีเข้ม จุดโฟกัสสายตาตรงกลาง

---

### CARD 07 — PRACTICAL METHOD (สัมผัส)
* **Headline:** 3 วิธีคืนลมหายใจให้ทีมในสัปดาห์นี้
* **Body Copy:**
  1. **Check-in ความรู้สึก:** ก่อนเริ่มประชุม ลองถามสั้น ๆ “วันนี้พลังงานใจกี่เต็มสิบ?”
  2. **No-Blame Zone:** เมื่อเกิดข้อผิดพลาด ถามว่า “เราเรียนรู้อะไร” แทน “ใครทำพัง”
  3. **Reconnect 1-on-1:** คุยกันเรื่องความหมาย ไม่ใช่แค่เรื่องงาน
* **Key Message:** มอบเครื่องมือ Micro-Practice ที่นำไปใช้ได้จริงทันที
* **Visual Direction:** 3 กล่องเรียงลำดับ Step ชัดเจน สีสันแยกมิติ

---

### CARD 08 — REAL-LIFE SCENARIO (สัมผัส)
* **Headline:** ตัวอย่างสถานการณ์จริงในที่ทำงาน
* **Body Copy:**
  เมื่อทีมเปิดพื้นที่ปลอดภัยให้พูดความจริง
  กำแพง Silo ระหว่างแผนกที่เคยขัดแย้ง
  กลับกลายเป็นพลังร่วมในการแก้ไขปัญหายาก ๆ ได้สำเร็จใน 2 สัปดาห์
* **Key Message:** ฉายภาพผลลัพธ์ที่เป็นไปได้ของการ Reborn
* **Visual Direction:** Scenario Box พร้อม Quote ความเปลี่ยนแปลง

---

### CARD 09 — MICRO ACTION (สอดคล้อง)
* **Headline:** สิ่งเล็ก ๆ ที่คุณเริ่มทำได้วันนี้
* **Body Copy:**
  ส่งข้อความขอบคุณเพื่อนร่วมทีม 1 คน
  สำหรับความพยายามที่คนอื่นอาจมองไม่เห็น
  เพื่อเติมความชุ่มฉ่ำให้หัวใจของกันและกัน
* **Key Message:** Action เล็กแต่ทรงพลัง
* **Visual Direction:** Card สีชมพู Action Pink สะดุดตา

---

### CARD 10 — TAKEAWAY & CTA (สอดคล้อง)
* **Headline:** เกิดใหม่จากข้างใน ไปด้วยกัน
* **Body Copy:**
  องค์กรของคุณกำลังอยู่ในสภาวะไหน?
  เช็กสุขภาพองค์กร 10 ข้อฟรี พร้อมรับ Rebirth Report
  หรือนัดพูดคุยเพื่อออกแบบ Transformation กับ Choomcham House
* **CTA:** ตรวจสุขภาพองค์กรที่ choomcham.pages.dev
* **Visual Direction:** Logo บ้านชุ่มฉ่ำ Choomcham House พร้อมปุ่ม Call to Action ชัดเจน

---

## 📱 SOCIAL MEDIA CAPTION (FOR POSTING):
คนยังมาทำงาน... แต่ใจไม่ได้อยู่กับงานแล้วหรือเปล่า? 🧟🍂

สิ่งที่น่ากลัวที่สุดในการทำงานยุคนี้ ไม่ใช่การที่คนเก่งลาออก
แต่มันคือการที่คนยังอยู่ครบ แต่ไม่มีจิตวิญญาณและความคิดสร้างสรรค์เหลืออยู่แล้ว

เราไม่ได้เหนื่อยเพราะงานหนักเสมอไป... แต่เราเหนื่อยเพราะไม่รู้ว่าสิ่งที่ทำอยู่มีความหมายอะไร

Swipe ดู 10 สไลด์นี้เพื่อสำรวจสัญญาณ Zombie ในองค์กรของคุณ 
และค้นหา 3 วิธีง่าย ๆ ในการคืนความชุ่มฉ่ำและพลังชีวิตให้ทีม 🌿✨

👉 เช็กระดับสภาวะองค์กรของคุณด้วย Zombie Organization Check™ ได้ที่ลิงก์ใน Bio: choomcham.pages.dev

#ChoomchamHouse #บ้านชุ่มฉ่ำ #LivingOrganization #ZombieOrganization #CultureTransformation #HRD #ผู้นำองค์กร #หมดไฟ
        `.trim(),
        );
      } else if (contentType === "article") {
        setGeneratedContent(
          `
# 📚 THOUGHT LEADERSHIP ARTICLE
## ${activeTopic}
*โดย บ้านชุ่มฉ่ำ Choomcham House — Helping People & Organizations Reborn From Within*

---

### บทนำ: เสียงสะท้อนที่ไร้เสียงในองค์กรยุคใหม่
ท่ามกลางกระแสการเปลี่ยนแปลงทางเทคโนโลยีและการแข่งขันทางธุรกิจที่รวดเร็ว องค์กรจำนวนมากกำลังเผชิญกับวิกฤตการณ์ที่มองไม่เห็นด้วยตัวเลขทางบัญชี นั่นคือ **"ภาวะคนยังทำงานแต่งานใจไม่ได้อยู่แล้ว" (Zombie Organization)**

พนักงานยังคงมาทำงานตรงเวลา นั่งประจำโต๊ะ ส่งงานตาม KPI แต่หากมองลึกลงไปในแววตาและบรรยากาศในห้องประชุม เราจะพบความเงียบ ความระแวดระวัง และกำแพงที่มองไม่เห็น (Silent Silos) ที่คอยขัดขวางไม่ให้ความคิดสร้างสรรค์ใหม่ ๆ ได้ผลิบาน

---

### แก่นของปัญหา: ทำไมการแก้ปัญหาแบบเดิมจึงไม่ได้ผล?
การอบรมเพิ่มทักษะ (Skill Training) หรือการจัดกิจกรรมสันทนาการแบบผิวเผิน มักไม่สามารถแก้ไขปัญหาความเหนื่อยล้าสะสมได้ เพราะรากเหง้าของปัญหาไม่ได้อยู่ที่ "คนทำงานไม่เป็น" แต่อยู่ที่:
1. **การขาดความหมาย (Lack of Meaning & Purpose):** คนไม่เห็นว่างานของตนมีคุณค่าเชื่อมโยงกับเป้าหมายชีวิตอย่างไร
2. **การขาดพื้นที่ปลอดภัยทางจิตวิทยา (No Psychological Safety):** ความกลัวที่จะถูกตัดสินหรือถูกชี้นิ้วหาคนผิด ทำให้คนเลือกที่จะนิ่งเฉย
3. **กำแพงระหว่างแผนก (Structural Silos):** ต่างคนต่างทำงานในพื้นที่ของตนเองเพื่อความอยู่รอด

---

### ทางออก: 5-Stage Rebirth Process Model
Choomcham House ได้ออกแบบกระบวนการฟื้นฟูองค์กรที่มุ่งเน้นการเปลี่ยนแปลงจากภายในสู่ภายนอก ผ่าน 5 ขั้นตอนสำคัญ:

1. **RESET (ล้างความล้า):** คืนพื้นที่ปลอดภัยให้คนในองค์กรได้ปลดปล่อยความตึงเครียดสะสม และได้หยุดพักเพื่อกลับมาสัมผัสความรู้สึกที่แท้จริง
2. **RECONNECT (เชื่อมหัวใจ):** ทลายกำแพง Silo ด้วยการฟังอย่างลึกซึ้ง (Deep Listening) และสร้างความไว้วางใจระหว่างทีม
3. **RECHARGE (เติมไฟในใจ):** จุดประกายความหมายและค้นพบ Passion ร่วมขององค์กร
4. **REIMAGINE (มองมุมใหม่):** มองโจทย์ทางธุรกิจและวัฒนธรรมองค์กรด้วยเลนส์แห่งความเป็นไปได้
5. **RECREATE (ลงมือสร้างใหม่):** ร่วมกันสร้างกติกาใจและวิถีการทำงานใหม่ที่นำไปใช้ได้จริงในชีวิตประจำวัน

---

### บทสรุป
"องค์กรที่มีชีวิต เริ่มต้นจากคนที่มีชีวิต" เมื่อเราให้ความสำคัญกับการดูแลคนจากข้างใน องค์กรจะไม่เพียงแต่เติบโตอย่างยั่งยืน แต่จะกลายเป็นพื้นที่แห่งความสุขและความคิดสร้างสรรค์ที่ทุกคนอยากตื่นขึ้นมาสร้างสิ่งใหม่ในทุก ๆ วัน
        `.trim(),
        );
      } else {
        setGeneratedContent(
          `
# 🎬 60-SECOND REEL / SHORT VIDEO SCRIPT
**หัวข้อ:** ${activeTopic}
**รูปแบบ:** Short Video (TikTok, IG Reel, YouTube Shorts)

---

### [00:00 - 00:05] HOOK (หยุดสายตา)
* **ภาพ (Visual):** ผู้พูดมองกล้องตรง สีหน้าจริงจังแต่นุ่มนวล ตัวหนังสือพาดหัวสีชมพูเด้งขึ้นมา
* **เสียงพูด (Voiceover):** "คุณเคยรู้สึกไหมครับว่า... คนในทีมยังมาทำงานครบ แต่องค์กรกลับเหมือนไม่มีลมหายใจ?"

---

### [00:05 - 00:20] THE TENSION (ขยี้ปัญหา)
* **ภาพ (Visual):** ภาพห้องประชุมที่ทุกคนก้มหน้ามองแล็ปท็อป สลับกับภาพพนักงานนั่งถอนหายใจ
* **เสียงพูด (Voiceover):** "สิ่งนี้น่ากลัวกว่าคนลาออกอีกนะ มันคือภาวะที่เรียกว่า 'Zombie Worker' ตัวยังนั่งทำงาน ทำตามคำสั่งไปวัน ๆ แต่ใจหมดไฟสะสม และไม่มีใครกล้าพูดความจริง"

---

### [00:20 - 00:45] THE INSIGHT & SHIFT (เปลี่ยนมุมมอง)
* **ภาพ (Visual):** ผู้พูดยิ้ม บรรยากาศเริ่มสว่างสดใส มี Graphic 5-Stage Rebirth ปรากฏขึ้น
* **เสียงพูด (Voiceover):** "ความจริงคือ... คนไม่ได้หมดไฟเพราะงานหนักเสมอไปครับ แต่หมดไฟเพราะ 'ขาดความหมาย' และ 'ขาดพื้นที่ปลอดภัย' องค์กรที่มีชีวิต ไม่ได้เกิดจากนโยบาย แต่เกิดจาก 'คนที่มีชีวิต'"

---

### [00:45 - 01:00] ACTION & CTA (ทางออก & ปิดท้าย)
* **ภาพ (Visual):** ตัวอย่างผลประเมิน Zombie Organization Check™ บนมือถือ
* **เสียงพูด (Voiceover):** "ลองตรวจสภาวะองค์กรของคุณฟรี 10 ข้อที่บ้านชุ่มฉ่ำ Choomcham House แล้วมาช่วยคนและองค์กรให้เกิดใหม่จากข้างในไปด้วยกันครับ ลิงก์อยู่ที่ Bio นะครับ!"
        `.trim(),
        );
      }
      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    const blob = new Blob([generatedContent], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `choomcham_content_${contentType}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout
      title="Content Studio · AI & DMF Studio"
      subtitle="ระบบสร้างสรรค์บทความ คอนเทนต์โซเชียล และสคริปต์วิดีโอด้วย DeepSeek AI ตามหลัก DMF Framework ของบ้านชุ่มฉ่ำ"
    >
      {/* Engine Status Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-800 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
            <Bot className="w-5 h-5 text-purple-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Choomcham AI Content Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                DeepSeek AI Active
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              ขับเคลื่อนด้วย DeepSeek V3 + DMF Journey (รู้ ➔ เห็น ➔ รู้สึก ➔ สัมผัส ➔ สอดคล้อง)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl border border-white/10 text-xs self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setUseAI(true)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              useAI
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-200 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>DeepSeek AI</span>
          </button>
          <button
            onClick={() => setUseAI(false)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              !useAI
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-200 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Template</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Controller: Settings & Topics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              1. รูปแบบคอนเทนต์ (Content Format)
            </h3>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                onClick={() => setContentType("carousel")}
                className={`py-3 px-2 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  contentType === "carousel"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>10-Card Carousel</span>
              </button>

              <button
                onClick={() => setContentType("article")}
                className={`py-3 px-2 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  contentType === "article"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>บทความเจาะลึก</span>
              </button>

              <button
                onClick={() => setContentType("reel")}
                className={`py-3 px-2 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  contentType === "reel"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Video className="w-4 h-4" />
                <span>สคริปต์คลิป 60s</span>
              </button>
            </div>

            {/* Angle Selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. มิติมุมมอง (Transformation Angle)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["PEOPLE", "TEAM", "LEADER", "ORGANIZATION"] as const).map(
                  (ang) => (
                    <button
                      key={ang}
                      onClick={() => setSelectedAngle(ang)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        selectedAngle === ang
                          ? "bg-pink-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {ang}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Custom Topic Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. ระบุหัวข้อที่ต้องการสร้าง (Topic Prompt)
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="เช่น การสร้าง Psychological Safety ในทีมวิศวกร"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-purple-500 font-medium"
              />
            </div>

            {/* Custom AI Instructions */}
            {useAI && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  4. คำสั่งเสริม / มิติพิเศษ (Optional Prompt Context)
                </label>
                <input
                  type="text"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="เช่น เน้นเปรียบเทียบก่อน-หลัง, ใช้ภาษากันเองอบอุ่น"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:border-purple-500"
                />
              </div>
            )}

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all hover:scale-101 cursor-pointer disabled:opacity-50"
            >
              <Sparkles
                className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
              />
              <span>
                {isGenerating
                  ? "กำลังรังสรรค์คอนเทนต์ด้วย AI..."
                  : useAI
                    ? "✨ สร้างคอนเทนต์ด้วย DeepSeek AI"
                    : "สร้างร่างจากเทมเพลต"}
              </span>
            </button>
          </div>

          {/* Preset Topics Library */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              หัวข้อยอดนิยม (Signature Choomcham Topics)
            </h4>
            <div className="space-y-2.5">
              {PRESET_TOPICS.map((pt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCustomTopic(pt.title);
                    handleGenerate(pt.title);
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/80 border border-slate-200/80 hover:border-purple-300 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-purple-700">
                      {pt.category}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 mt-1.5 group-hover:text-purple-700 transition-colors">
                    {pt.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                    "{pt.hook}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview & Export Board */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs min-h-[620px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-purple-600 uppercase block">
                      V2.0 Output Preview & Editor
                    </span>
                    {providerInfo && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                        {providerInfo}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {contentType === "carousel"
                      ? "10-Card Social Carousel (DMF Framework)"
                      : contentType === "article"
                        ? "Long-Form Article"
                        : "60-Second Video Script"}
                  </h3>
                </div>

                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copied ? "คัดลอกแล้ว!" : "คัดลอก"}</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.MD</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Content Area */}
              {generatedContent ? (
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="w-full h-[500px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono leading-relaxed text-slate-800 focus:bg-white focus:outline-hidden focus:border-purple-500 resize-none"
                />
              ) : (
                <div className="h-[480px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    ยังไม่มีเนื้อหาที่สร้าง
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    เลือกรูปแบบคอนเทนต์ทางด้านซ้าย
                    หรือคลิกเลือกหัวข้อยอดนิยมเพื่อสร้าง Carousel 10 การ์ด,
                    บทความ, หรือสคริปต์วิดีโอได้ทันที
                  </p>
                  <button
                    onClick={() => handleGenerate(PRESET_TOPICS[0].title)}
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    สร้างตัวอย่างทันที
                  </button>
                </div>
              )}
            </div>

            {generatedContent && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  🌟 มาตรฐานเนื้อหา: DMF (รู้ ➔ เห็น ➔ รู้สึก ➔ สัมผัส ➔
                  สอดคล้อง)
                </span>
                <span>ฟอนต์แบรนด์: Anuphan & Poppins</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
