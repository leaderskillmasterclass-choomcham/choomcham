import { useFetcher } from "react-router";
import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { 
  Flame, Users, Award, ShieldAlert, Sparkles, Send, 
  CheckCircle, ArrowRight, Zap, Target, BookOpen, AlertCircle,
  HelpCircle, MessageSquare, Check, Phone, ArrowUpRight, ChevronRight, ChevronLeft,
  RefreshCw, Smile, Heart, RefreshCcw, Compass, Lightbulb
} from "lucide-react";
import { saveLeadToSupabase, sendEmailNotification, sendLineNotification } from "~/lib/services";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE | ชุบชีวิตคนและองค์กร เกิดใหม่จากข้างใน" },
    { name: "description", content: "ช่วยคนและองค์กรที่กำลังหมดไฟ เหี่ยวเฉา หรือทำงานแบบ Zombie กลับมามีพลัง มี Connection และมีชีวิตชีวาอีกครั้งด้วยหลักสูตรและประสบการณ์แบบ Custom" },
    { name: "keywords", content: "บ้านชุ่มฉ่ำ, Choomcham House, พัฒนาองค์กร, จัดอบรม, HRD, Team Building, หมดไฟ, Burnout, Organizational Rebirth" },
    { property: "og:title", content: "บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE | Organizational Rebirth" },
    { property: "og:description", content: "เปลี่ยน Zombie Organization ให้เป็น Living Organization กลับมามีพลังชีวิตอีกครั้ง" },
    { property: "og:image", content: "/logo.jpg" },
  ];
}

// Interactive Quiz Questions Data (Zombie Organization Check™)
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "เช้าวันจันทร์ ในออฟฟิศของคุณ บรรยากาศส่วนใหญ่เป็นอย่างไร?",
    answers: [
      { text: "ซึมเศร้าเหมือนเดินอยู่ใน The Walking Dead ทุกคนจ้องจอเงียบงันสะท้อนความเหี่ยวเฉา", score: 1 },
      { text: "ทุกคนรีบเดินเข้าห้องทำงานตัวเอง หลีกเลี่ยงการสบตาและการคุยกันโดยไม่จำเป็น", score: 2 },
      { text: "ทักทายกันพอเป็นพิธีตามมารยาท แต่หน้าตาดูไม่มีความสุข", score: 3 },
      { text: "เต็มไปด้วยพลังงานบวก ทักทายกันด้วยรอยยิ้มและเสียงหัวเราะอย่างเป็นธรรมชาติ", score: 4 }
    ]
  },
  {
    id: 2,
    question: "เมื่อมีการประชุมทีม ไอเดียใหม่ๆ หรือการแลกเปลี่ยนความเห็นเกิดขึ้นบ่อยแค่ไหน?",
    answers: [
      { text: "เงียบกริบเหมือนป่าช้า... ทุกคนพยักหน้าเห็นด้วยเพื่อรีบจบการประชุมและแยกย้าย", score: 1 },
      { text: "หัวหน้าพูดคนเดียว 90% ของเวลา ที่เหลือฟังอย่างเดียวและจดบันทึก", score: 2 },
      { text: "มีเสนอไอเดียบ้าง แต่เป็นไอเดียเดิมๆ ที่ปลอดภัยและไม่เสี่ยงต่อการโดนวิจารณ์", score: 3 },
      { text: "ไอเดียพรั่งพรู ทุกคนกล้าเสนอความคิดเห็น กล้าทดลอง และกล้าท้าทายกันอย่างสร้างสรรค์", score: 4 }
    ]
  },
  {
    id: 3,
    question: "เวลาเกิดข้อผิดพลาดหรือปัญหาในงาน ทีมของคุณมีปฏิกิริยาอย่างไร?",
    answers: [
      { text: "ชี้นิ้วหาคนผิดทันที และหาทางปัดความรับผิดชอบให้พ้นตัวโดยเร็วที่สุด", score: 1 },
      { text: "พยายามปิดบังซ่อนปัญหาไว้ใต้พรมจนกว่าจะทนไม่ไหวและเกิดระเบิดขึ้น", score: 2 },
      { text: "รายงานปัญหาตามระบบ ส่งอีเมลอย่างเป็นทางการ แต่ต่างคนต่างแก้ในส่วนตัวเอง", score: 3 },
      { text: "เผชิญหน้าร่วมมือกันทันที วิเคราะห์หาสาเหตุจริงเพื่อแก้ไขและเรียนรู้ร่วมกันโดยไม่มีกำแพงแผนก", score: 4 }
    ]
  },
  {
    id: 4,
    question: "ลักษณะการทำงานของพนักงานในองค์กรของคุณเป็นแบบใด?",
    answers: [
      { text: "ทำงานเหมือนหุ่นยนต์ สั่งอะไรทำแค่นั้น ไร้ความเห็น ไร้คำถาม และไร้การพัฒนาใดๆ", score: 1 },
      { text: "ทำตาม KPI ให้ผ่านไปวันๆ เพื่อเอาตัวรอด แต่ไม่เข้าใจหรือสนใจภาพใหญ่ขององค์กร", score: 2 },
      { text: "ตั้งใจทำงานตามหน้าที่ดี แต่ขาดความกระตือรือร้นและพลังริเริ่มสร้างสรรค์สิ่งใหม่", score: 3 },
      { text: "มีความรู้สึกเป็นเจ้าของงาน (Ownership) พร้อมลงมือทำ ทดลองสิ่งใหม่ และแก้ปัญหาเชิงรุก", score: 4 }
    ]
  },
  {
    id: 5,
    question: "ความร่วมมือกันระหว่างแผนกต่างๆ (Cross-functional Collaboration) เป็นอย่างไร?",
    answers: [
      { text: "ทำสงครามเย็นระหว่างแผนก โยนงาน ทะเลาะ และไม่ยอมแบ่งปันข้อมูลใดๆ", score: 1 },
      { text: "ประสานงานเฉพาะเท่าที่มีเอกสารส่งคำขออย่างเป็นทางการเท่านั้น ไม่อะลุ้มอล่วย", score: 2 },
      { text: "พูดคุยกันด้วยดีเมื่อเจอกัน แต่ลึกๆ ยังคงรักษาและปกป้องผลประโยชน์เฉพาะแผนกตัวเอง", score: 3 },
      { text: "ทำงานเชื่อมประสานเหมือนทีมเดียวกัน ช่วยเหลือเกื้อกูลเพื่อเป้าหมายรวมของบริษัท", score: 4 }
    ]
  },
  {
    id: 6,
    question: "หัวหน้าทีมส่วนใหญ่ในองค์กรของคุณ ทำหน้าที่แบบใด?",
    answers: [
      { text: "คอยจับผิด ไมโครแมนเนจ สั่งงานและควบคุมแบบเบ็ดเสร็จทุกขั้นตอน", score: 1 },
      { text: "ทำตัวเหมือนเป็นบุรุษไปรษณีย์ ส่งผ่านคำสั่งจากเบื้องบนโดยไม่มีการแปลความหรือสร้างพลังใจ", score: 2 },
      { text: "คอยแก้ปัญหาเฉพาะหน้าให้ลูกน้อง เป็นนักดับเพลิงที่เหนื่อยและแบกรับความรับผิดชอบไว้คนเดียว", score: 3 },
      { text: "สร้างแรงบันดาลใจ สนับสนุน ปลดล็อกศักยภาพทีม และทำหน้าที่เป็นผู้นำแบบ Coach", score: 4 }
    ]
  },
  {
    id: 7,
    question: "คนเก่งๆ มีฝีมือ (Talents) ในองค์กรของคุณมักจะอยู่ได้นานแค่ไหน?",
    answers: [
      { text: "เข้ามาแล้วหมดไฟและลาออกอย่างรวดเร็วภายใน 3-6 เดือนแรก", score: 1 },
      { text: "อยู่ไปสักพักแล้วไฟค่อยๆ มอดลง สุดท้ายกลายเป็นคนเฉื่อยชาไหลไปตามระบบ", score: 2 },
      { text: "อยู่ได้เรื่อยๆ เพราะเงินเดือนสวัสดิการดี แต่ไม่มีความรู้สึกตื่นเต้นท้าทายในงาน", score: 3 },
      { text: "เติบโตขึ้นเรื่อยๆ มีพื้นที่ให้สร้างผลงาน ได้เรียนรู้ และนำการขับเคลื่อนการเติบโตขององค์กร", score: 4 }
    ]
  },
  {
    id: 8,
    question: "เมื่อองค์กรต้องเผชิญกับการเปลี่ยนแปลงเชิงโครงสร้างหรือระบบใหม่ คนตอบรับอย่างไร?",
    answers: [
      { text: "ต่อต้านอย่างรุนแรงแบบเงียบ บ่นในกลุ่มไลน์ลับ และปฏิเสธการปฏิบัติตาม", score: 1 },
      { text: "ยอมรับทำตามเพราะโดนบังคับ แต่เป็นการทำงานที่ปราศจากพลังและความใส่ใจ", score: 2 },
      { text: "คอยสังเกตการณ์อยู่ห่างๆ รอให้คนอื่นทำนำไปก่อน ค่อยๆ ปรับตัวตามอย่างช้าๆ", score: 3 },
      { text: "ตื่นเต้นกับการเปลี่ยนแปลง มองหาความท้าทาย และพร้อมทดลองคิดทำสิ่งใหม่ๆ ร่วมกัน", score: 4 }
    ]
  },
  {
    id: 9,
    question: "พนักงานระดับปฏิบัติการรู้สึกว่า 'เสียงหรือความคิดเห็น' ของพวกเขามีความหมายเพียงใด?",
    answers: [
      { text: "ไม่มีความหมายเลย พูดไปก็มีแต่ภัยเข้าตัว เงียบปากไว้คือทางรอดที่ดีที่สุด", score: 1 },
      { text: "มีกล่องรับฟังความคิดเห็น แต่ส่งไปแล้วก็เงียบหายเหมือนไม่มีอะไรเกิดขึ้น", score: 2 },
      { text: "หัวหน้ารับฟังในระดับแผนก แต่การตัดสินใจหลักของบริษัทมาจากผู้บริหารเบื้องบนเท่านั้น", score: 3 },
      { text: "เสียงทุกคนได้รับการใส่ใจ ความคิดเห็นดีๆ ถูกนำไปทดลองและเปลี่ยนเป็นแนวปฏิบัติจริง", score: 4 }
    ]
  },
  {
    id: 10,
    question: "ระดับพลังชีวิตของคนในองค์กรในตอนเย็นวันศุกร์ เป็นอย่างไร?",
    answers: [
      { text: "หมดสภาพเป็นศพเดินได้ ไร้พลังวิญญาณ นับถอยหลังรอเวลาเลิกงานตั้งแต่วันพุธ", score: 1 },
      { text: "รู้สึกโล่งอกที่รอดพ้นไปอีกหนึ่งสัปดาห์ แต่ก็เริ่มกังวลถึงวันจันทร์ล่วงหน้าตั้งแต่วันเสาร์", score: 2 },
      { text: "เหนื่อยล้าจากการทำงานปกติ แต่พึงพอใจและพร้อมใช้วันหยุดพักผ่อนเงียบๆ", score: 3 },
      { text: "มีความสุข ได้สร้างความสำเร็จร่วมกับทีม พลังงานยังเหลือล้นไปใช้ชีวิตและเรียนรู้เรื่องอื่น", score: 4 }
    ]
  }
];

// Symptoms and Program Mapping
const SYMPTOMS = [
  { id: "burnout", label: "คนหมดไฟ / เฉื่อยชา", programId: "reborn-people", programName: "REBORN PEOPLE" },
  { id: "silo", label: "ทีมต่างคนต่างทำ / เกิด Silo", programId: "alive-team", programName: "ALIVE TEAM" },
  { id: "fear", label: "คนไม่กล้าเสนอไอเดีย", programId: "reborn-people", programName: "REBORN PEOPLE" },
  { id: "no-innovation", label: "Innovation ลดลง / ขาดไอเดียใหม่", programId: "living-org", programName: "LIVING ORGANIZATION" },
  { id: "leader-burnout", label: "ผู้นำแบกทุกอย่าง / ไมโครแมนเนจ", programId: "reborn-leader", programName: "REBORN LEADER" },
  { id: "talent-loss", label: "คนเก่งเริ่มหมดพลัง / ลาออกเงียบ", programId: "reborn-people", programName: "REBORN PEOPLE" },
  { id: "dead-culture", label: "Culture เหี่ยว / บรรยากาศซึมเศร้า", programId: "alive-team", programName: "ALIVE TEAM" },
  { id: "change-resistance", label: "องค์กรเปลี่ยน แต่คนต้านเงียบ", programId: "living-org", programName: "LIVING ORGANIZATION" }
];

const PROGRAMS = [
  {
    id: "reborn-people",
    title: "REBORN PEOPLE",
    subtitle: "โปรแกรมสำหรับคน",
    description: "สำหรับคนทำงานที่กำลังหมดไฟ ต้องการกลับมาค้นหาพลัง ความหมาย และความสดใหม่ในการทำงาน ชุบชีวิตคนทำงานด้วยกระบวนการสร้าง Mindset และการกลับมาเห็นคุณค่าในตัวเอง",
    highlights: ["ค้นหาความหมายการทำงานใหม่ (Re-anchoring)", "ปรับทัศนคติฟื้นฟูแรงใจ (Energy Management)", "ดึงไฟในตัวคนทำงานกลับมามีพลังสร้างสรรค์"],
    tags: ["People Reborn", "Mindset Shift", "Burnout Recovery"]
  },
  {
    id: "alive-team",
    title: "ALIVE TEAM",
    subtitle: "โปรแกรมสำหรับทีม",
    description: "เปลี่ยนทีมที่ต่างคนต่างทำ ให้กลับมาเชื่อมกัน สื่อสารกัน และสร้างสิ่งใหม่ร่วมกันอย่างมีประสิทธิภาพและไว้วางใจกัน ไร้ขอบเขต Silo",
    highlights: ["สลายกำแพง Silo และความเฉยชาในทีม", "สร้าง Psychological Safety ในการคุยและแชร์ไอเดีย", "กิจกรรม Experiential Learning เชื่อมใจทีมงาน"],
    tags: ["Team Reconnect", "Psychological Safety", "Collaboration"]
  },
  {
    id: "reborn-leader",
    title: "REBORN LEADER",
    subtitle: "โปรแกรมสำหรับผู้นำ",
    description: "สำหรับผู้นำที่ต้องการเปลี่ยนตัวเองและปรับกระบวนการทำงานก่อนพาทีมไปสู่การเปลี่ยนแปลง ปลดภาระไมโครแมนเนจและหันมาสนับสนุนปลดล็อกทีม",
    highlights: ["ปรับบทบาทจากผู้ควบคุม (Manager) สู่ผู้เอื้ออำนวย (Facilitative Leader)", "สร้าง Ownership ให้กับทีมงานหน้างาน", "การนำทีมด้วยเป้าหมายและ Empathy"],
    tags: ["Leader Shift", "Facilitation Skills", "Empowerment"]
  },
  {
    id: "living-org",
    title: "LIVING ORGANIZATION",
    subtitle: "โปรแกรมสำหรับองค์กร",
    description: "กระบวนการ Transformation สำหรับองค์กรที่ต้องการสร้างวัฒนธรรมใหม่จากข้างใน ให้ลื่นไหลปรับตัวได้เองตามสถานการณ์และเกิดนวัตกรรมระดับรากหญ้า",
    highlights: ["ร่วมออกแบบวัฒนธรรมองค์กรในทางปฏิบัติ", "กระบวนการสร้างแนวร่วมการเปลี่ยนแปลง (Change Alliance)", "วางระบบที่เอื้อต่อการมีส่วนร่วมและความคิดสร้างสรรค์"],
    tags: ["Org Rebirth", "Culture Design", "Agile Transformation"]
  }
];

const TRANSFORMATION_STEPS = [
  {
    id: "reset",
    title: "RESET",
    subtitle: "หยุดวงจรเดิม",
    desc: "หยุดวงจรการทำงานแบบหุ่นยนต์ เพื่อมองเห็นสิ่งที่กำลังเกิดขึ้นกับตัวเองและทีมอย่างแท้จริง สะท้อนความตระหนักรู้แรก"
  },
  {
    id: "reconnect",
    title: "RECONNECT",
    subtitle: "กลับมาเชื่อมกัน",
    desc: "กลับมาเชื่อมโยงกับตัวเอง ค้นพบความต้องการที่แท้จริง และเปิดใจเชื่อมโยงกับคนรอบข้างแบบไร้กำแพงกั้น"
  },
  {
    id: "recharge",
    title: "RECHARGE",
    subtitle: "เติมพลังชีวิต",
    desc: "เติมพลังงานความสดใหม่ แรงบันดาลใจ และความรื่นเริงใจที่เป็นธรรมชาติของจิตวิญญาณมนุษย์"
  },
  {
    id: "reimagine",
    title: "REIMAGINE",
    subtitle: "มองมุมใหม่",
    desc: "มองงาน มองทีม และมองอนาคตขององค์กรด้วยเลนส์และมุมมองใหม่ที่เป็นไปได้และสร้างสรรค์"
  },
  {
    id: "recreate",
    title: "RECREATE",
    subtitle: "ลงมือสร้างใหม่",
    desc: "นำสิ่งที่คุณและทีมร่วมค้นพบกลับไปสร้างวิธีทำงาน วิธีการสื่อสาร และการลงมือทำจริงในออฟฟิศ"
  }
];

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const position = formData.get("position") as string;
    const email_or_line = formData.get("email_or_line") as string;
    const team_size = formData.get("team_size") as string;
    const score = parseInt(formData.get("score") as string, 10);
    const result_level = formData.get("result_level") as string;
    const answersStr = formData.get("answers") as string;
    const answers = answersStr ? JSON.parse(answersStr) : [];

    // Save lead to Database (Supabase)
    const dbResult = await saveLeadToSupabase(null, {
      name,
      company,
      position,
      email_or_line,
      team_size,
      score,
      result_level,
      answers
    });

    // Send email alert to admin (Resend)
    await sendEmailNotification(null, {
      name,
      company,
      position,
      email_or_line,
      team_size,
      score,
      result_level
    });

    // Send LINE alert to admin (LINE Notify)
    await sendLineNotification(null, {
      name,
      company,
      position,
      email_or_line,
      score,
      result_level
    });

    return { success: true, dbResult };
  } catch (error: any) {
    console.error("Action error:", error);
    return { success: false, error: error.message || "Failed to process lead submission" };
  }
}

export default function Home() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const hasSubmitted = fetcher.data && (fetcher.data as any).success;

  // Quiz States
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Result Mapping based on CI color rule
  const getResultLevel = (score: number) => {
    if (score >= 34) {
      return { 
        level: "ALIVE", 
        title: "ALIVE - องค์กรมีพลังชีวิตเต็มเปี่ยม", 
        color: "text-brand-green border-brand-green bg-brand-green/10", 
        glow: "glow-green", 
        desc: "องค์กรของคุณมีพลังชีวิตที่ดีเยี่ยม คนมี Ownership กล้าแสดงความเห็น และทีมร่วมมือร่วมใจกันสร้างสรรค์สิ่งใหม่ ขอชื่นชมวัฒนธรรมองค์กรที่แข็งแกร่งนี้! จุดท้าทายคือจะรักษามาตรฐานและช่วยให้องค์กรขยายสเกลโดยไม่สูญเสียจิตวิญญาณแห่งความเป็นมนุษย์ไปอย่างไร" 
      };
    }
    if (score >= 26) {
      return { 
        level: "TIRED", 
        title: "TIRED - เริ่มมีสัญญาณความเหนื่อยสะสม", 
        color: "text-brand-yellow border-brand-yellow bg-brand-yellow/10", 
        glow: "glow-amber", 
        desc: "องค์กรเริ่มมีสัญญาณความเฉื่อยและการสะสมความเหนื่อยล้า พนักงานยังคงทำงานได้ดีตาม KPI แต่เริ่มสูญเสียพลังสร้างสรรค์และความสนุกสนานในการสร้างสรรค์สิ่งใหม่ หากปล่อยทิ้งไว้โดยไม่เติมนวัตกรรมหรือการดูแลคน มีความเสี่ยงที่จะไหลลึกไปสู่ระดับ Faded" 
      };
    }
    if (score >= 18) {
      return { 
        level: "FADED", 
        title: "FADED - พลังของคนเริ่มจางหาย", 
        color: "text-brand-blue border-brand-blue bg-brand-blue/10", 
        glow: "glow-blue", 
        desc: "คนทำงานเริ่มแยกตัว ต่างคนต่างทำเพื่อเอาตัวรอด ประชุมค่อนข้างเงียบและมีการสื่อสารแนวราบที่ลดลง ความเฉื่อยชากำลังกลายเป็นนิสัยปกติใหม่ในบริษัท ความคิดสร้างสรรค์และนวัตกรรมเริ่มหดหายไป ต้องการการรื้อฟื้นแนวคิดและเติมพลังความเชื่อมโยงในทีมด่วน" 
      };
    }
    return { 
      level: "ZOMBIE", 
      title: "ZOMBIE - ร่างยังทำแต่งาน ใจไม่ได้อยู่แล้ว", 
      color: "text-brand-pink border-brand-pink bg-brand-pink/10", 
      glow: "glow-pink", 
      desc: "องค์กรของคุณอยู่ในขีดอันตรายสูงสุด พนักงานทำงานแบบไร้วิญญาณเหมือนซอมบี้ ทำตามคำสั่งไปวันๆ เพื่อรอเวลาเลิกงาน ไม่กล้าพูด ไม่มีความสุข และ Silo แยกส่วนขัดแย้งรุนแรง ปล่อยไว้อนาคตองค์กรจะโตยากเพราะคนข้างในหมดไฟสะสม ต้องการการฟื้นฟู Transformation จากข้างในด่วนที่สุด!" 
    };
  };

  const currentScore = quizAnswers.reduce((sum, val) => sum + val, 0);
  const resultInfo = getResultLevel(currentScore);

  // Symptom Checker State
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  // Transformation Animation State (0 to 4 steps)
  const [transStep, setTransStep] = useState(0);

  // Auto transition animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTransStep((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (score: number) => {
    const newAnswers = [...quizAnswers, score];
    setQuizAnswers(newAnswers);

    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowLeadForm(true);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQIndex(0);
    setQuizAnswers([]);
    setShowLeadForm(false);
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-black font-sans selection:bg-brand-pink selection:text-brand-white relative">
      
      {/* HEADER & NAVIGATION */}
      <header className="sticky top-0 z-50 glass-panel border-b border-brand-border/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <img 
              src="/logo.jpg" 
              alt="บ้านชุ่มฉ่ำ Choomcham House Logo" 
              className="w-10 h-10 rounded-2xl shadow-sm object-cover group-hover:scale-105 transition-transform duration-300 border border-brand-purple/15 bg-white p-0.5" 
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-brand-purple leading-none group-hover:text-brand-pink transition-colors">
                บ้านชุ่มฉ่ำ
              </span>
              <span className="font-display font-bold text-[9px] sm:text-[10px] tracking-widest text-brand-pink uppercase leading-tight mt-0.5">
                CHOOMCHAM HOUSE
              </span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-brand-gray font-display">
            <a href="#zombie-check" className="hover:text-brand-purple transition-colors">Why Choomcham</a>
            <a href="#model" className="hover:text-brand-purple transition-colors">Transformation</a>
            <a href="#programs" className="hover:text-brand-purple transition-colors">Programs</a>
            <a href="#work" className="hover:text-brand-purple transition-colors">How We Work</a>
            <a href="#about" className="hover:text-brand-purple transition-colors">About</a>
          </nav>
          <div>
            <a 
              href="#zombie-check" 
              className="px-5 py-2.5 rounded-pill bg-brand-pink text-brand-white font-display font-semibold text-xs tracking-wide hover:shadow-[0_4px_14px_rgba(227,52,107,0.35)] hover:-translate-y-0.5 transition-all duration-300 block text-center uppercase"
            >
              Zombie Check
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10">

        {/* SECTION 1: HERO */}
        <section id="hero" className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 overflow-hidden bg-brand-purple text-brand-white">
          {/* Decorative organic shapes */}
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

          <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
            
            {/* Official Logo Badge */}
            <div className="mb-6 relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-2.5 shadow-2xl shadow-brand-pink/25 ring-4 ring-white/20 group-hover:scale-105 transition-transform duration-300 mx-auto">
                <img 
                  src="/logo.jpg" 
                  alt="บ้านชุ่มฉ่ำ Choomcham House" 
                  className="w-full h-full object-contain rounded-2xl" 
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill border border-brand-pink/30 bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-widest mb-8 font-display">
              <Zap className="w-3.5 h-3.5" />
              ช่วยคนและองค์กร “เกิดใหม่จากข้างใน”
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold tracking-tight leading-tight mb-8 max-w-4xl text-balance">
              องค์กรของคุณกำลังมีคนที่ยังมาทำงาน <br />
              แต่<span className="text-brand-yellow relative">
                ไม่มีพลัง
                <span className="absolute left-0 bottom-1 w-full h-1.5 bg-brand-yellow/20 rounded"></span>
              </span>ในการสร้างอะไรใหม่หรือเปล่า?
            </h1>

            <p className="text-lg sm:text-xl text-brand-surface max-w-3xl leading-relaxed mb-12 text-balance font-normal">
              คนยังอยู่ครบ งานยังเดิน แต่ความสดใส ความกระตือรือร้น <br className="hidden sm:inline" />
              และพลังบางอย่างกำลังหายไป... Choomcham House ช่วยองค์กรปลุกพลังคน <br className="hidden sm:inline" />
              เชื่อมทีม และสร้างการเปลี่ยนแปลงจากข้างใน
            </p>

            {/* Metaphor Visual Banner */}
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-md bg-brand-white/10 border border-brand-white/10 mb-12 text-xs sm:text-sm font-semibold tracking-wide font-display">
              <span className="text-brand-gray line-through">Zombie Organization</span>
              <span className="text-brand-yellow font-display">→</span>
              <span className="text-brand-green font-display glow-green">Living Organization</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full max-w-md">
              <a 
                href="#zombie-check" 
                className="w-full sm:w-auto px-8 py-4 rounded-pill bg-brand-pink text-brand-white font-display font-bold text-lg tracking-wide hover:shadow-[0_0_25px_rgba(227,52,107,0.5)] hover:scale-105 transition-all duration-300 text-center"
              >
                ให้ทีมของคุณเกิดใหม่
              </a>
              <a 
                href="#contact" 
                className="w-full sm:w-auto px-8 py-4 rounded-pill border border-brand-white/30 bg-brand-white/5 hover:bg-brand-white/15 text-brand-white font-display font-semibold text-lg transition-all duration-300 text-center"
              >
                คุยกับเรา
              </a>
            </div>

          </div>
        </section>


        {/* SECTION 2: ZOMBIE CHECK (Zombie Organization Check™) */}
        <section id="zombie-check" className="py-24 px-6 relative bg-brand-white text-brand-black border-b border-brand-border">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <span className="text-brand-pink text-xs font-bold tracking-widest uppercase block font-display">01 — คุณกำลังมี “Zombie Organization” หรือเปล่า?</span>
                <h2 className="text-3xl sm:text-5xl font-sans font-extrabold leading-tight">
                  คนในองค์กรไม่ได้แย่ลง แต่พวกเขาอาจกำลัง <span className="text-brand-pink">“หมดชีวิต”</span> กับการทำงาน
                </h2>
                <p className="text-brand-gray leading-relaxed">
                  งานยังดำเนินไปได้ปกติ แต่หากสังเกตดีๆ พลังงานสร้างสรรค์ในองค์กรของคุณกำลังหดหายและกลายเป็นซอมบี้ไปทีละส่วน
                </p>
                <div className="p-6 rounded-lg border border-brand-pink/20 bg-brand-pink/5 relative overflow-hidden">
                  <h4 className="text-sm font-bold text-brand-black mb-1">🚨 สิ่งที่น่ากลัวที่สุดไม่ใช่คนลาออก...</h4>
                  <p className="text-brand-pink font-display font-black text-xl md:text-2xl leading-snug">
                    แต่คือ... คนยังอยู่ แต่ใจไม่ได้อยู่กับองค์กรแล้ว
                  </p>
                </div>
              </div>

              {/* Symptoms Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "มาทำงานตรงเวลา แต่ทำแค่ตามหน้าที่",
                  "ประชุมเยอะ แต่ไม่มีไอเดียใหม่",
                  "ทุกคนทำงานของตัวเอง แต่ไม่รู้สึกเป็นทีม",
                  "ไม่ค่อยกล้าเสนอความคิดเห็น",
                  "ต้องคอยกระตุ้นตลอด",
                  "คนเก่งเริ่มหมดไฟ",
                  "งานยังเดิน แต่ไม่มีพลัง",
                  "ทุกคนรอวันหยุด"
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-md bg-brand-surface border border-brand-border hover:border-brand-pink/25 transition-all flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-pink/15 text-brand-pink flex items-center justify-center text-xs shrink-0 mt-0.5">🧟</span>
                    <span className="text-sm sm:text-base text-brand-gray font-medium">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Quiz Container Box */}
            <div className="max-w-4xl mx-auto glass-panel rounded-lg p-8 md:p-12 relative overflow-hidden border border-brand-border shadow-sm">
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-bold uppercase tracking-wider mb-3 font-display">
                  <HelpCircle className="w-3.5 h-3.5 glow-pink" />
                  Zombie Organization Check™
                </div>
                <h3 className="text-2xl sm:text-3xl font-sans font-bold">องค์กรของคุณกำลังเป็นซอมบี้แค่ไหน? 🧟</h3>
                <p className="text-brand-gray text-sm mt-2">
                  ตอบ 10 คำถามเพื่อวัดสภาวะจริง เพื่อค้นหาว่าองค์กรมีพลังแค่ไหนและควรเริ่มพัฒนาที่จุดใด
                </p>
              </div>

              {!quizStarted && !showLeadForm && !hasSubmitted && (
                <div className="text-center py-8">
                  <p className="text-brand-gray text-sm mb-6 max-w-md mx-auto">
                    ใช้เวลาประเมินเพียง 2 นาที พร้อมรับรายงานเบื้องต้นประกอบการเกิดใหม่ขององค์กร
                  </p>
                  <button 
                    onClick={() => setQuizStarted(true)}
                    className="px-8 py-4 rounded-pill bg-brand-pink text-brand-white font-display font-bold text-lg tracking-wide hover:shadow-[0_4px_14px_rgba(227,52,107,0.35)] transition-all duration-300"
                  >
                    เริ่มตรวจสภาวะซอมบี้
                  </button>
                </div>
              )}

              {quizStarted && !showLeadForm && (
                <div>
                  <div className="flex items-center justify-between mb-6 text-xs sm:text-sm font-display">
                    <span className="font-semibold text-brand-purple">คำถาม {QUIZ_QUESTIONS[currentQIndex].id} / 10</span>
                    <span className="text-brand-gray">ความคืบหน้า {Math.round(((currentQIndex) / QUIZ_QUESTIONS.length) * 100)}%</span>
                  </div>

                  <div className="w-full bg-brand-surface rounded-pill h-2 mb-8 overflow-hidden">
                    <div 
                      className="bg-brand-pink h-full transition-all duration-500"
                      style={{ width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-8 leading-snug">
                    {QUIZ_QUESTIONS[currentQIndex].question}
                  </h3>

                  <div className="grid grid-cols-1 gap-3.5">
                    {QUIZ_QUESTIONS[currentQIndex].answers.map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(answer.score)}
                        className="w-full text-left p-4.5 rounded-md border border-brand-border hover:border-brand-purple bg-brand-white hover:bg-brand-surface text-brand-black transition-all duration-300 flex items-start gap-4 group text-sm sm:text-base"
                      >
                        <span className="w-6 h-6 rounded-pill border border-brand-border group-hover:border-brand-purple flex items-center justify-center text-xs font-semibold text-brand-gray group-hover:text-brand-purple shrink-0 mt-0.5 font-display">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{answer.text}</span>
                      </button>
                    ))}
                  </div>

                  {currentQIndex > 0 && (
                    <button 
                      onClick={() => {
                        setCurrentQIndex(currentQIndex - 1);
                        setQuizAnswers(quizAnswers.slice(0, -1));
                      }}
                      className="mt-6 text-xs text-brand-gray hover:text-brand-purple transition-colors flex items-center gap-1 font-display"
                    >
                      <ChevronLeft className="w-4 h-4" /> ย้อนกลับ
                    </button>
                  )}
                </div>
              )}

              {showLeadForm && !hasSubmitted && (
                <div className="max-w-lg mx-auto">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">ประเมินสภาวะเสร็จสิ้น!</h3>
                    <p className="text-brand-gray text-xs">
                      กรอกรายละเอียดเพื่อประมวลผลลัพธ์และรับ **Organization Rebirth Report** แบบเต็มรูปแบบผ่านอีเมลหรือไลน์
                    </p>
                  </div>

                  <fetcher.Form method="post" className="space-y-4">
                    <input type="hidden" name="score" value={currentScore} />
                    <input type="hidden" name="result_level" value={resultInfo.level} />
                    <input type="hidden" name="answers" value={JSON.stringify(quizAnswers)} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        name="name" 
                        required
                        placeholder="ชื่อ-นามสกุล"
                        className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-2.5 text-sm text-brand-black outline-none transition-colors"
                      />
                      <input 
                        type="text" 
                        name="company" 
                        required
                        placeholder="บริษัท / องค์กร"
                        className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-2.5 text-sm text-brand-black outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        name="position" 
                        required
                        placeholder="ตำแหน่งงาน"
                        className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-2.5 text-sm text-brand-black outline-none transition-colors"
                      />
                      <select 
                        name="team_size"
                        className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-2.5 text-sm text-brand-black outline-none transition-colors appearance-none"
                      >
                        <option value="">เลือกขนาดทีม</option>
                        <option value="1-20 คน">ต่ำกว่า 20 คน</option>
                        <option value="21-100 คน">21 - 100 คน</option>
                        <option value="101-500 คน">101 - 500 คน</option>
                        <option value="500+ คน">500 คนขึ้นไป</option>
                      </select>
                    </div>

                    <input 
                      type="text" 
                      name="email_or_line" 
                      required
                      placeholder="อีเมล หรือ ID LINE สำหรับส่งข้อมูล"
                      className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-2.5 text-sm text-brand-black outline-none transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-pill bg-brand-pink text-brand-white font-display font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_4px_14px_rgba(227,52,107,0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "กำลังวิเคราะห์..." : "รับผลประเมินของคุณเลย"}
                    </button>
                  </fetcher.Form>
                </div>
              )}

              {hasSubmitted && (
                <div className="text-center py-4 max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill border border-brand-green/30 bg-brand-green/10 text-brand-green text-xs font-semibold mb-4 font-display">
                    <CheckCircle className="w-3.5 h-3.5" /> วิเคราะห์เสร็จสิ้น
                  </div>

                  <h3 className="text-xl font-bold mb-2">สภาวะองค์กรของคุณ:</h3>
                  <div className={`inline-block border rounded-lg px-6 py-2.5 font-display font-black text-xl mb-6 ${resultInfo.color} ${resultInfo.glow}`}>
                    {resultInfo.title}
                  </div>

                  <p className="text-brand-gray text-sm leading-relaxed mb-6 text-left p-5 rounded-lg bg-brand-surface border border-brand-border">
                    {resultInfo.desc}
                  </p>

                  <div className="flex gap-4 justify-center">
                    <a href="#contact" className="px-6 py-3 rounded-pill bg-brand-pink text-brand-white font-display font-bold text-sm tracking-wide transition-all hover:scale-105">
                      นัดวิเคราะห์โจทย์องค์กร
                    </a>
                    <button onClick={restartQuiz} className="px-5 py-3 rounded-pill border border-brand-border text-brand-gray hover:text-brand-purple text-xs font-display transition-colors">
                      ทำแบบประเมินอีกครั้ง
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>


        {/* SECTION 3: PAIN (คุณกำลังมี “Zombie Organization” หรือเปล่า?) */}
        <section id="pain" className="py-24 px-6 bg-brand-surface border-b border-brand-border relative">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-brand-pink text-xs font-bold tracking-widest uppercase block font-display">01 — คุณกำลังมี “Zombie Organization” หรือเปล่า?</span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold max-w-3xl mx-auto leading-tight mt-2">
                เมื่อองค์กรเริ่มขาดลมหายใจ... มันคือภาวะกัดกินพลังสร้างสรรค์
              </h2>
            </div>

            {/* Asymmetric / Offset cards layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              
              <div className="p-8 rounded-lg bg-brand-white border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-md bg-brand-pink/10 flex items-center justify-center mb-6">
                  <ShieldAlert className="w-6 h-6 text-brand-pink" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-display">Zombie Workers</h3>
                <p className="text-brand-gray text-sm leading-relaxed">
                  พนักงานมาตรงเวลา แต่ทำงานเฉพาะตามสั่งแบบเฉื่อยชา ไร้จิตวิญญาณและความคิดริเริ่ม
                </p>
              </div>

              <div className="p-8 rounded-lg bg-brand-white border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300 md:translate-y-4">
                <div className="w-12 h-12 rounded-md bg-brand-yellow/10 flex items-center justify-center mb-6">
                  <AlertCircle className="w-6 h-6 text-brand-yellow" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-display">Idea Graveyard</h3>
                <p className="text-brand-gray text-sm leading-relaxed">
                  ห้องประชุมที่เงียบงัน ทุกคนพยักหน้าเห็นด้วยเพื่อรีบจบประชุม แต่ไม่มีใครเสนออะไรใหม่ๆ
                </p>
              </div>

              <div className="p-8 rounded-lg bg-brand-white border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-md bg-brand-blue/10 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-display">Silo Division</h3>
                <p className="text-brand-gray text-sm leading-relaxed">
                  การแยกขอบเขตปกป้องเขตแดน ไม่มีความร่วมมือในแนวราบ ต่างฝ่ายต่างอยู่สงครามเย็น
                </p>
              </div>

              <div className="p-8 rounded-lg bg-brand-white border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300 md:translate-y-4">
                <div className="w-12 h-12 rounded-md bg-brand-pink/10 flex items-center justify-center mb-6">
                  <Flame className="w-6 h-6 text-brand-pink" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-display">Talent Burnout</h3>
                <p className="text-brand-gray text-sm leading-relaxed">
                  คนเก่งแบกงานจนหมดพลัง มอดไหม้ไปกับระบบจับผิด และเงียบถอดจิตรอลาออกเงียบๆ
                </p>
              </div>

            </div>

            {/* Overlap Statement Card */}
            <div className="relative bg-brand-white rounded-lg p-10 md:p-12 text-center border border-brand-pink/20 max-w-4xl mx-auto shadow-md mt-24">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none"></div>
              
              <h3 className="text-2xl sm:text-4xl font-display font-black text-brand-black mb-6 leading-tight">
                “สิ่งที่น่ากลัวที่สุดไม่ใช่คนลาออก <br className="hidden sm:inline" />
                แต่คือ... <span className="text-brand-pink">คนยังอยู่ แต่ใจไม่ได้อยู่กับองค์กรแล้ว</span>”
              </h3>
              <p className="text-brand-gray max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                การฟื้นฟูสภาวะนี้ไม่ใช่อัดชุดวิชาการธรรมดากลบปัญหา แต่คือการพาพวกเขากลับมารู้สึกตัว เชื่อมต่อกับคนรอบข้าง และเกิดความหมายในการสร้างสรรค์ใหม่อีกครั้ง
              </p>
            </div>

          </div>
        </section>


        {/* SECTION 4: BRAND BELIEF */}
        <section id="belief" className="py-24 px-6 relative bg-brand-purple text-brand-white">
          <div className="max-w-5xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <span className="text-brand-yellow text-xs font-bold tracking-widest uppercase block font-display">02 — เราเชื่อว่า...</span>
                <h2 className="text-3xl sm:text-5xl font-sans font-extrabold leading-tight">
                  องค์กรจะมีชีวิตได้ <br />
                  เมื่อคนข้างใน <br />
                  <span className="text-brand-yellow relative">
                    มีชีวิต
                    <span className="absolute left-0 bottom-1 w-full h-1 bg-brand-yellow/30 rounded"></span>
                  </span>
                </h2>
                <p className="text-brand-surface leading-relaxed text-sm sm:text-base">
                  องค์กรไม่สามารถเปลี่ยนได้อย่างยั่งยืนด้วยการเปลี่ยนแค่ Strategy, Process หรือ KPI ใหม่ๆ เพราะสุดท้ายแล้ว...
                </p>
                <div className="text-xl sm:text-2xl font-display font-black text-brand-yellow">
                  คนคือคนที่ทำให้องค์กรมีชีวิต
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { num: "01 / หยุด", title: "Stop", desc: "หยุดการทำงานสภาวะหุ่นยนต์มาส่องดูสภาวะตัวเอง" },
                  { num: "02 / มองตัวเอง", title: "Reflect", desc: "มองลึกทำความเข้าใจความจริงของความคิดและสภาวะในปัจจุบัน" },
                  { num: "03 / เชื่อมกับคนอื่น", title: "Connect", desc: "เปิดใจสร้างความเชื่อมโยงที่จริงใจกับคนในทีมงาน" },
                  { num: "04 / เติมพลัง", title: "Re-energize", desc: "ฟื้นไฟพลังงานความสดใหม่ แรงบันดาลใจในการทำงาน" },
                  { num: "05 / เห็นความเป็นไปได้ใหม่", title: "Re-frame", desc: "มองเห็นมุมมองแปลกใหม่ในการแก้ไขปัญหาร่วมกัน" },
                  { num: "06 / กลับไปสร้างสิ่งใหม่", title: "Recreate", desc: "นำทัศนคติที่ดีกลับไปสรรค์สร้างพฤติกรรมในที่ทำงาน" }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-lg bg-brand-white/10 border border-brand-white/10 hover:bg-brand-white/15 transition-all">
                    <div className="text-brand-yellow font-display font-bold text-sm mb-2">{item.num}</div>
                    <h4 className="font-bold text-base mb-1 text-brand-white">{item.title}</h4>
                    <p className="text-brand-surface text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>


        {/* SECTION 5: CHOOMCHAM HOUSE คืออะไร? */}
        <section id="about" className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-brand-purple text-xs font-bold tracking-widest uppercase block font-display">03 — CHOOMCHAM HOUSE คืออะไร?</span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-4 mt-2">
                บ้านสำหรับการเกิดใหม่ของคนทำงาน
              </h2>
              <p className="text-brand-gray text-base sm:text-lg max-w-2xl mx-auto">
                เราออกแบบประสบการณ์การเรียนรู้และการพัฒนาคน สำหรับองค์กรที่ต้องการให้คน “เปลี่ยนจากข้างใน”
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 p-8 rounded-lg bg-brand-surface border border-brand-border">
                <h4 className="text-lg font-bold mb-4 text-brand-purple font-display">ไม่ใช่แค่กลับไปทำงานเก่งขึ้น...</h4>
                <p className="text-brand-gray text-sm leading-relaxed mb-6">
                  แต่เป็นการกลับไปแบบมีพลังชีวิต มีความสัมพันธ์ที่ดีกับคนรอบข้าง และต้องการขับเคลื่อนสิ่งใหม่ร่วมกันอย่างแท้จริง
                </p>
                <div className="w-16 h-1 bg-brand-pink rounded-full"></div>
              </div>

              {/* Qualities list */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "มีพลังขึ้น", desc: "ปลุกจิตวิญญาณแห่งความตื่นตัว ฟื้นคืนไฟแรงบันดาลใจ" },
                  { title: "เชื่อมกันมากขึ้น", desc: "สลายกำแพงแผนก คุยกันลึกซึ้งด้วยความเข้าใจ" },
                  { title: "กล้าคิดมากขึ้น", desc: "สลายความกลัวการล้มเหลว กล้าปลดปล่อยพลังจินตนาการ" },
                  { title: "กล้าสร้างมากขึ้น", desc: "มีสภาวะผู้เริ่มทำ ลงมือสร้างสรรค์สิ่งใหม่แบบเชิงรุก" },
                  { title: "อยากมีส่วนร่วมกับองค์กรอีกครั้ง", desc: "เชื่อมโยงความเชื่อมั่นเข้ากับเป้าหมายองค์กร" }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 rounded-lg bg-brand-surface border border-brand-border hover:border-brand-purple/20 transition-all ${
                      idx === 4 ? "sm:col-span-2" : ""
                    }`}
                  >
                    <h4 className="font-display font-bold text-lg text-brand-purple mb-1.5 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-pink" /> {item.title}
                    </h4>
                    <p className="text-brand-gray text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>


        {/* SECTION 6: OUR TRANSFORMATION (ZOMBIE -> ALIVE SLIDER) */}
        <section id="model" className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-brand-pink text-xs font-bold tracking-widest uppercase block font-display">04 — OUR TRANSFORMATION</span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-4 mt-2">
                จาก Zombie → Alive
              </h2>
              <p className="text-brand-gray text-sm sm:text-base max-w-2xl mx-auto">
                โมเดลการเรียนรู้เปลี่ยนผ่านระดับพลังงานขององค์กรคุณ
              </p>
            </div>

            {/* Slider container grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Graphic side */}
              <div className="lg:col-span-6 flex flex-col items-center">
                
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-full bg-brand-surface border border-brand-border shadow-inner">
                  
                  {/* Dynamic Backdrop Glow based on Step */}
                  <div className={`absolute inset-0 rounded-full blur-[45px] opacity-25 transition-all duration-1000 ${
                    transStep === 0 ? "bg-brand-gray" :
                    transStep === 1 ? "bg-brand-purple" :
                    transStep === 2 ? "bg-brand-pink" :
                    transStep === 3 ? "bg-brand-yellow" : "bg-brand-green"
                  }`}></div>

                  {/* Transforming Center Orb */}
                  <div className={`relative w-44 h-44 rounded-full border flex flex-col items-center justify-center text-center p-5 transition-all duration-1000 shadow-lg ${
                    transStep === 0 ? "border-brand-gray/30 bg-brand-white text-brand-gray" :
                    transStep === 1 ? "border-brand-purple/30 bg-brand-purple/10 text-brand-purple glow-purple" :
                    transStep === 2 ? "border-brand-pink/30 bg-brand-pink/10 text-brand-pink glow-pink" :
                    transStep === 3 ? "border-brand-yellow/30 bg-brand-yellow/10 text-brand-yellow glow-amber" :
                    "border-brand-green/30 bg-brand-green/10 text-brand-green glow-green"
                  }`}>
                    
                    <div className="absolute -inset-1 border border-dashed rounded-full animate-spin" style={{ animationDuration: '24s' }}></div>

                    <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 font-display">Journey Stage</span>
                    <span className="text-lg md:text-xl font-display font-black tracking-wider mt-1.5 uppercase">
                      {TRANSFORMATION_STEPS[transStep].title}
                    </span>
                    <span className="text-xs font-semibold mt-1">
                      {TRANSFORMATION_STEPS[transStep].subtitle}
                    </span>
                    
                  </div>

                </div>

                {/* Bullets control */}
                <div className="flex gap-3 mt-8">
                  {TRANSFORMATION_STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTransStep(i)}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        transStep === i 
                          ? "bg-brand-pink scale-125 w-8" 
                          : "bg-brand-gray/30 hover:bg-brand-gray/70"
                      }`}
                    ></button>
                  ))}
                </div>

              </div>

              {/* Steps control column */}
              <div className="lg:col-span-6 space-y-4">
                {TRANSFORMATION_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setTransStep(idx)}
                    className={`w-full text-left p-5 rounded-lg border transition-all duration-500 block ${
                      transStep === idx 
                        ? "border-brand-pink bg-brand-pink/5 shadow-md translate-x-2" 
                        : "border-brand-border hover:border-brand-border/15 bg-brand-white hover:bg-brand-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display ${
                        transStep === idx 
                          ? "bg-brand-pink text-brand-white" 
                          : "bg-brand-surface border border-brand-border text-brand-gray"
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className={`text-base font-display font-black tracking-wider ${
                          transStep === idx ? "text-brand-pink" : "text-brand-black"
                        }`}>
                          {step.title}
                        </h4>
                        <span className="text-xs text-brand-gray font-semibold">{step.subtitle}</span>
                      </div>
                    </div>
                    {transStep === idx && (
                      <p className="mt-3 text-brand-gray text-xs sm:text-sm leading-relaxed animate-fade-in pl-11">
                        {step.desc}
                      </p>
                    )}
                  </button>
                ))}
              </div>

            </div>

            {/* Rebirth Output block */}
            <div className="mt-16 p-8 rounded-lg bg-brand-surface border border-brand-border text-center text-lg md:text-xl font-bold font-display">
              คนมีชีวิต <span className="text-brand-pink font-semibold">→</span> ทีมมีพลัง <span className="text-brand-purple font-semibold">→</span> องค์กรมีชีวิต <span className="text-brand-green font-semibold">Living Organization</span>
            </div>

          </div>
        </section>


        {/* SECTION 7: PROGRAMS & SYMPTOM RECOMMENDATION */}
        <section id="programs" className="py-24 px-6 bg-brand-surface border-b border-brand-border relative">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-brand-purple text-xs font-bold tracking-widest uppercase block mb-3 font-display">05 — PROGRAMS</span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-4 mt-2">
                โปรแกรมปรับแต่งพัฒนาองค์กร
              </h2>
              <p className="text-brand-gray text-sm sm:text-base max-w-2xl mx-auto">
                เลือกโปรแกรมที่เหมาะสมกับสภาวะปัญหา หรือคัดกรองตามอาการที่พบบ่อยด้านล่างนี้
              </p>
            </div>

            {/* Symptom Checker */}
            <div className="bg-brand-white border border-brand-border rounded-lg p-6 md:p-8 mb-16 text-center shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-4 font-display">🔍 เลือกสภาวะที่พบบ่อยในองค์กรคุณตอนนี้:</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => setSelectedSymptom(selectedSymptom === symptom.id ? null : symptom.id)}
                    className={`px-4 py-2.5 rounded-pill border text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                      selectedSymptom === symptom.id
                        ? "bg-brand-pink border-brand-pink text-brand-white glow-pink scale-105"
                        : "border-brand-border hover:border-brand-pink/50 bg-brand-white hover:bg-brand-surface text-brand-gray hover:text-brand-black"
                    }`}
                  >
                    {symptom.label}
                  </button>
                ))}
              </div>
              
              {selectedSymptom && (
                <div className="mt-5 text-sm text-brand-black flex items-center justify-center gap-2 animate-bounce">
                  <Check className="w-4 h-4 text-brand-green" />
                  <span>แนะนำให้เลือกโปรแกรม:</span>
                  <a 
                    href={`#prog-${SYMPTOMS.find(s => s.id === selectedSymptom)?.programId}`}
                    className="text-brand-pink font-bold hover:underline"
                  >
                    {SYMPTOMS.find(s => s.id === selectedSymptom)?.programName}
                  </a>
                </div>
              )}
            </div>

            {/* Programs Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROGRAMS.map((prog) => {
                const isRecommended = selectedSymptom && SYMPTOMS.find(s => s.id === selectedSymptom)?.programId === prog.id;
                return (
                  <div
                    key={prog.id}
                    id={`prog-${prog.id}`}
                    className={`rounded-lg p-8 md:p-10 border transition-all duration-500 relative flex flex-col justify-between ${
                      isRecommended 
                        ? "border-brand-pink bg-brand-pink/5 shadow-md scale-[1.01]" 
                        : "border-brand-border bg-brand-white hover:border-brand-gray/30"
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-pill bg-brand-pink text-brand-white text-xs font-bold tracking-wider uppercase font-display glow-pink">
                        Recommended
                      </span>
                    )}

                    <div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {prog.tags.map((t, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-brand-surface text-brand-gray text-[10px] uppercase font-bold tracking-wider font-display">
                            {t}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-2xl font-display font-extrabold text-brand-purple mb-2">{prog.title}</h3>
                      <h4 className="text-lg font-bold text-brand-black mb-4">{prog.subtitle}</h4>
                      <p className="text-brand-gray text-sm leading-relaxed mb-6 border-b border-brand-border pb-6">
                        {prog.description}
                      </p>

                      <ul className="space-y-2.5 mb-8">
                        {prog.highlights.map((h, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-brand-gray flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0 animate-pulse"></span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="#contact"
                      className="w-full py-3.5 rounded-pill border border-brand-border hover:border-brand-pink bg-brand-white hover:bg-brand-surface text-center text-sm font-bold tracking-wider hover:text-brand-pink transition-all duration-300 font-display"
                    >
                      ออกแบบโปรแกรมสำหรับองค์กรคุณ
                    </a>
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* SECTION 8: เราไม่ได้ทำ Training แบบเดิม */}
        <section className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-brand-pink text-xs font-bold tracking-widest uppercase block mb-3 font-display">06 — เราไม่ได้ทำ Training แบบเดิม</span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-6 leading-tight mt-2">
                เพราะคนไม่ได้เปลี่ยนเพราะ “ฟังเก่งขึ้น”
              </h2>
              <p className="text-brand-gray text-base sm:text-lg max-w-2xl mx-auto">
                คนเปลี่ยนเมื่อเขารู้สึก เห็น เข้าใจ และเกิดการตัดสินใจนำไปลงมือทำด้วยตนเอง
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
              <div className="space-y-6">
                <p className="text-brand-gray text-sm sm:text-base leading-relaxed">
                  พนักงานจะเกิดการมีส่วนร่วมและตกผลึกจนเปลี่ยนสภาวะในที่ทำงานได้จริง ต้องผ่าน 4 จุดสัมผัสความรู้สึก:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4.5 rounded-md bg-brand-surface border border-brand-border">
                    <span className="text-brand-pink font-display font-bold text-base block mb-1">รู้สึกบางอย่าง</span>
                    <span className="text-brand-gray text-xs">เกิดความเข้าใจและอารมณ์ร่วมภายใน</span>
                  </div>
                  <div className="p-4.5 rounded-md bg-brand-surface border border-brand-border">
                    <span className="text-brand-yellow font-display font-bold text-base block mb-1">เห็นบางอย่าง</span>
                    <span className="text-brand-gray text-xs">มองเห็นความผิดปกติและทางออกในสภาวะจริง</span>
                  </div>
                  <div className="p-4.5 rounded-md bg-brand-surface border border-brand-border">
                    <span className="text-brand-blue font-display font-bold text-base block mb-1">เข้าใจบางอย่าง</span>
                    <span className="text-brand-gray text-xs">เข้าใจความหมายในภาพใหญ่และการประสาน</span>
                  </div>
                  <div className="p-4.5 rounded-md bg-brand-pink/5 border border-brand-pink/20 text-brand-pink">
                    <span className="font-display font-bold text-base block mb-1">ตัดสินใจทำบางอย่าง</span>
                    <span className="text-xs">ลงมือเปลี่ยนพฤติกรรมด้วยพลังสมัครใจ</span>
                  </div>
                </div>
              </div>

              {/* Choomcham formula box */}
              <div className="p-8 rounded-lg bg-brand-surface border border-brand-border relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none"></div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-brand-purple mb-6 font-display">⚡ Choomcham Learning Framework:</h4>
                <div className="space-y-4 text-xs sm:text-sm font-semibold">
                  <div className="p-3 bg-brand-white rounded-md border border-brand-border flex items-center justify-between">
                    <span>Learning + Experience</span>
                    <span className="text-brand-pink font-bold">+</span>
                  </div>
                  <div className="p-3 bg-brand-white rounded-md border border-brand-border flex items-center justify-between">
                    <span>Reflection + Connection</span>
                    <span className="text-brand-yellow font-bold">+</span>
                  </div>
                  <div className="p-3 bg-brand-green/10 rounded-md border border-brand-green/20 text-brand-green flex items-center justify-between">
                    <span>Action (ลงมือจริง)</span>
                    <span className="font-bold">= Reborn</span>
                  </div>
                </div>
                <p className="text-brand-gray text-xs leading-relaxed mt-6">
                  *เพื่อสร้างความเปลี่ยนแปลงที่ยังอยู่กับทีมงานหลังจบการอบรม ไม่หายไปเมื่อเดินออกจากห้องเรียน
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 9: เหมาะกับองค์กรที่... */}
        <section className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-brand-green text-xs font-bold tracking-widest uppercase block mb-3 font-display">07 — เหมาะกับองค์กรที่...</span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-4 mt-2">
                เหมาะกับองค์กรที่กำลังต้องการ...
              </h2>
            </div>

            {/* Target grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "คนกำลังหมดไฟ",
                "ทีมเริ่มเฉื่อย",
                "อยากสร้างวัฒนธรรมใหม่",
                "กำลังเปลี่ยนแปลงองค์กร",
                "ต้องการพัฒนาผู้นำ",
                "ต้องการสร้างทีมที่เชื่อมกันมากขึ้น",
                "ต้องการปลุก Creativity และ Innovation",
                "ต้องการสร้าง Employee Experience ที่มีความหมาย",
                "ต้องการให้คนกลับมา “อยากมีส่วนร่วม” กับองค์กร"
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-md bg-brand-surface border border-brand-border hover:border-brand-green/30 transition-all flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-green glow-green"></span>
                  <span className="text-sm font-semibold text-brand-gray">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* SECTION 10: WHAT WE CREATE */}
        <section className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border relative">
          <div className="max-w-4xl mx-auto text-center">
            
            <span className="text-brand-blue text-xs font-bold tracking-widest uppercase block mb-3 font-display">08 — WHAT WE CREATE</span>
            <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-6 mt-2">
              ไม่ใช่แค่ “วันอบรมที่สนุก”
            </h2>
            <p className="text-brand-gray text-base sm:text-lg max-w-2xl mx-auto mb-16">
              แต่คือการสร้างกระบวนการต่อเนื่องส่งมอบคุณค่าที่แท้จริง
            </p>

            {/* Connection chain */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-green opacity-20 -translate-y-1/2 hidden md:block"></div>

              {[
                { title: "คนที่มีพลัง", color: "border-brand-pink text-brand-pink bg-brand-pink/5", glow: "glow-pink" },
                { title: "ทีมที่มี Connection", color: "border-brand-purple text-brand-purple bg-brand-purple/5", glow: "glow-purple" },
                { title: "วัฒนธรรมที่มีชีวิต", color: "border-brand-yellow text-brand-yellow bg-brand-yellow/5", glow: "glow-amber" },
                { title: "องค์กรที่คนอยากเติบโตไปด้วยกัน", color: "border-brand-green text-brand-green bg-brand-green/5", glow: "glow-green" }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  className={`w-full md:w-64 p-6 rounded-md border flex flex-col items-center justify-center relative z-10 ${step.color} ${step.glow}`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2 font-display">Phase {idx + 1}</span>
                  <span className="text-base sm:text-lg font-bold text-brand-black">{step.title}</span>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* SECTION 11: WHY CHOOMCHAM HOUSE? */}
        <section id="why" className="py-24 px-6 relative bg-brand-purple text-brand-white">
          <div className="max-w-4xl mx-auto text-center">
            
            <span className="text-brand-yellow text-xs font-bold tracking-widest uppercase block mb-3 font-display">09 — WHY CHOOMCHAM HOUSE?</span>
            <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-10 mt-2">
              เราไม่ได้เชื่อว่าคนต้องถูก “แก้”
            </h2>

            <div className="bg-brand-white/10 border border-brand-white/10 rounded-lg p-10 md:p-12 text-left relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none"></div>

              <p className="text-lg sm:text-xl text-brand-surface leading-relaxed mb-8">
                เราเชื่อว่าคนทำงานจำนวนมากไม่ได้มีความบกพร่องที่ต้องสั่งซ่อมแซมแก้ไขแบบเครื่องจักร <br className="hidden sm:inline" />
                พวกเขาเพียงต้องการ **พื้นที่ที่อนุญาตให้เขาได้:**
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs font-bold mb-8 font-display">
                <div className="p-4 rounded-md bg-brand-white/5 border border-brand-white/10 text-brand-white">หยุด</div>
                <div className="p-4 rounded-md bg-brand-white/5 border border-brand-white/10 text-brand-yellow">หายใจ</div>
                <div className="p-4 rounded-md bg-brand-white/5 border border-brand-white/10 text-brand-green">มองเห็นตัวเอง</div>
                <div className="p-4 rounded-md bg-brand-white/5 border border-brand-white/10 text-brand-blue">กลับมาเชื่อมกับคนอื่น</div>
                <div className="p-4 rounded-md bg-brand-white/10 border border-brand-yellow/30 text-brand-yellow bg-brand-yellow/5">ค้นพบพลังของตัวเอง</div>
              </div>

              <div className="text-center md:text-right text-lg md:text-xl font-display font-black text-brand-yellow tracking-wider">
                นี่คือเหตุผลที่เราเรียกที่นี่ว่า <span className="underline decoration-brand-yellow">CHOOMCHAM HOUSE</span> — บ้านสำหรับการเกิดใหม่
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 12: ABOUT CHOOMCHAM */}
        <section id="work" className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border">
          <div className="max-w-5xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <span className="text-brand-purple text-xs font-bold tracking-widest uppercase block font-display">10 — ABOUT CHOOMCHAM</span>
                <h2 className="text-3xl sm:text-5xl font-sans font-extrabold leading-tight mt-2">
                  จักรวาลชุ่มฉ่ำ <br />
                  <span className="text-brand-purple">CHOOMCHAM</span>
                </h2>
                <p className="text-brand-gray leading-relaxed text-sm sm:text-base">
                  Choomcham House เป็นหนึ่งในธุรกิจภายใต้จักรวาล CHOOMCHAM ผู้ช่วยขับเคลื่อนการปฏิรูปแบรนด์และการตื่นรู้ทางธุรกิจ
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="p-8 rounded-lg bg-brand-surface border border-brand-border hover:border-brand-purple/20 transition-all">
                  <span className="text-brand-purple font-display font-black text-lg block mb-3 uppercase">Choomcham Branding</span>
                  <p className="text-brand-gray text-xs sm:text-sm leading-relaxed mb-4">
                    ช่วยธุรกิจวิเคราะห์ วางทิศทางแบรนด์ ออกแบบภาพลักษณ์แบรนด์ และการทำการตลาดเพื่อสร้างการเกิดใหม่ภายนอกในสายตาตลาด
                  </p>
                  <span className="text-xs font-bold text-brand-purple font-display">“เกิดใหม่ในสายตาตลาด”</span>
                </div>

                <div className="p-8 rounded-lg bg-brand-surface border border-brand-pink/20 bg-brand-pink/5 hover:border-brand-pink/30 transition-all">
                  <span className="text-brand-pink font-display font-black text-lg block mb-3 uppercase">Choomcham House</span>
                  <p className="text-brand-gray text-xs sm:text-sm leading-relaxed mb-4">
                    มุ่งสร้างประสบการณ์การเรียนรู้ ประสานวัฒนธรรมองค์กร พัฒนาศักยภาพผู้นำและพนักงาน เพื่อการเกิดใหม่ทางสภาวะจิตวิญญาณจากข้างใน
                  </p>
                  <span className="text-xs font-bold text-brand-pink font-display">“เกิดใหม่จากข้างใน”</span>
                </div>

              </div>

            </div>

            <div className="mt-16 text-center text-xl font-display font-black text-brand-green tracking-wide">
              เพราะเราเชื่อว่า: แบรนด์ที่มีชีวิต ต้องเริ่มจากคนที่มีชีวิต
            </div>

          </div>
        </section>


        {/* SECTION 13: FINAL CTA & CONTACT FORM */}
        <section id="contact" className="py-24 px-6 bg-brand-purple text-brand-white relative">
          <div className="max-w-4xl mx-auto">
            
            <div className="bg-brand-white/5 border border-brand-white/10 rounded-lg p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/10 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="text-center mb-12">
                <span className="text-brand-yellow text-xs font-bold tracking-widest uppercase block mb-3 font-display">11 — CTA</span>
                <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-6 leading-tight mt-2 text-brand-white">
                  องค์กรของคุณพร้อมกลับมามีชีวิตหรือยัง?
                </h2>
                
                <div className="text-left max-w-2xl mx-auto p-6 rounded-lg bg-brand-white/10 border border-brand-white/10 mb-8 space-y-4">
                  <p className="text-brand-surface text-sm sm:text-base leading-relaxed">
                    หากคุณรู้สึกว่าทีมของคุณกำลังทำงานแบบเดิม ด้วยพลังแบบเดิม และได้ผลลัพธ์แบบเดิม...
                  </p>
                  <p className="text-lg font-bold text-brand-yellow font-display">
                    บางทีสิ่งที่องค์กรต้องการ อาจไม่ใช่ “การอบรมอีกหนึ่งครั้ง” ... แต่อาจเป็น... “การเกิดใหม่”
                  </p>
                </div>

                <p className="text-base text-brand-surface font-semibold">
                  คุยกับ Choomcham House เพื่อออกแบบประสบการณ์ที่เหมาะกับคนและองค์กรของคุณ
                </p>
              </div>

              {/* Form submission response message */}
              {fetcher.data && !(fetcher.data as any).answers && (fetcher.data as any).success ? (
                <div className="p-8 rounded-lg bg-brand-green/10 border border-brand-green/30 text-center max-w-xl mx-auto">
                  <CheckCircle className="w-16 h-16 text-brand-green mx-auto mb-4 glow-green animate-bounce" />
                  <h3 className="text-2xl font-bold text-brand-green mb-2">ส่งข้อมูลสำเร็จ!</h3>
                  <p className="text-brand-surface text-sm">
                    ขอบคุณที่ติดต่อ Choomcham House ทีมผู้ออกแบบจะติดต่อกลับหาคุณภายใน 24 ชั่วโมง เพื่อวิเคราะห์โจทย์เบื้องต้นร่วมกันครับ
                  </p>
                </div>
              ) : (
                <div className="max-w-xl mx-auto text-brand-black">
                  <fetcher.Form method="post" className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-surface mb-2 font-display">ชื่อผู้ติดต่อ</label>
                        <input 
                          type="text" 
                          name="name" 
                          required
                          placeholder="ชื่อ-นามสกุลของคุณ"
                          className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-3 text-brand-black outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-surface mb-2 font-display">บริษัท / องค์กร</label>
                        <input 
                          type="text" 
                          name="company" 
                          required
                          placeholder="ชื่อบริษัทหรือหน่วยงาน"
                          className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-3 text-brand-black outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-surface mb-2 font-display">ตำแหน่งงาน</label>
                        <input 
                          type="text" 
                          name="position" 
                          required
                          placeholder="เช่น HR, Founder, CEO"
                          className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-3 text-brand-black outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-surface mb-2 font-display">ข้อมูลติดต่อ (อีเมล / ID LINE)</label>
                        <input 
                          type="text" 
                          name="email_or_line" 
                          required
                          placeholder="email@company.com หรือ ID Line"
                          className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-3 text-brand-black outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-surface mb-2 font-display">เล่าอาการองค์กรหรือเป้าหมายที่ต้องการปรับแต่ง</label>
                      <textarea 
                        name="team_size" 
                        required
                        rows={4}
                        placeholder="เช่น ทีมขาดความเชื่อมโยง ทำงานแบบหุ่นยนต์, ต้องการกระตุ้นความริเริ่มสร้างสรรค์, พนักงานเฉื่อยชาหมดไฟสะสม"
                        className="w-full bg-brand-white border border-brand-border focus:border-brand-purple rounded-md px-4 py-3 text-brand-black outline-none transition-colors resize-none text-sm"
                      />
                    </div>

                    <input type="hidden" name="score" value="0" />
                    <input type="hidden" name="result_level" value="CONSULT_BRIEF" />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 mt-4 rounded-pill bg-brand-pink text-brand-white font-display font-bold text-lg tracking-wide hover:shadow-[0_4px_14px_rgba(227,52,107,0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "กำลังส่งข้อความ..." : "คุยกับเราเพื่อเกิดใหม่"}
                    </button>
                  </fetcher.Form>
                </div>
              )}

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-brand-black border-t border-brand-border/10 py-16 px-6 relative z-10 text-xs sm:text-sm text-brand-gray">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <img 
              src="/logo.jpg" 
              alt="บ้านชุ่มฉ่ำ Choomcham House" 
              className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md object-contain" 
            />
            <div>
              <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-brand-pink via-brand-yellow to-brand-green bg-clip-text text-transparent block mb-1">
                บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE
              </span>
              <p className="text-brand-gray text-xs leading-relaxed max-w-sm">
                Helping People & Organizations Reborn From Within. <br />
                เกิดใหม่จากข้างใน เพื่อกลับไปสร้างสิ่งใหม่ข้างนอก
              </p>
            </div>
          </div>

          <div className="flex gap-8 text-xs text-brand-gray font-display">
            <a href="#zombie-check" className="hover:text-brand-pink transition-colors">Zombie Check</a>
            <a href="#programs" className="hover:text-brand-pink transition-colors">Programs</a>
            <a href="#belief" className="hover:text-brand-pink transition-colors font-medium">เราเชื่อว่า</a>
            <a href="#contact" className="hover:text-brand-pink transition-colors font-medium">นัดคุย</a>
          </div>

          <div className="text-center md:text-right text-xs">
            <p>© 2026 Choomcham. All rights reserved.</p>
            <p className="mt-1 opacity-65 font-display">Helping People & Organizations Reborn From Within.</p>
          </div>

        </div>
      </footer>

      {/* Fixed bottom Demo Bar as per KruDen WebDev step 3 instructions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#080604]/95 backdrop-blur-md border-t border-brand-purple/10 py-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Choomcham" className="w-5 h-5 rounded-full object-cover bg-white" />
          <span className="text-[10px] text-brand-surface font-display">
            🔮 <strong className="text-brand-pink">บ้านชุ่มฉ่ำ Choomcham House</strong> &nbsp;·&nbsp; Helping People & Organizations Reborn From Within
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-display">
          <a href="#zombie-check" className="px-2.5 py-1 rounded-md bg-brand-black/30 border border-brand-purple/20 text-brand-surface hover:text-white transition-colors">ทำแบบประเมิน</a>
          <a href="#programs" className="px-2.5 py-1 rounded-md bg-brand-black/30 border border-brand-purple/20 text-brand-surface hover:text-white transition-colors">Programs</a>
          <a href="#contact" className="px-2.5 py-1 rounded-md bg-brand-pink text-brand-white font-bold hover:scale-105 transition-all">นัดคุยกับเรา</a>
        </div>
      </div>

    </div>
  );
}
