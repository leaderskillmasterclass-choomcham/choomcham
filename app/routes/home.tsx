import { Link, useFetcher } from "react-router";
import { programUrl, requestUrl } from "~/lib/programs";
import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { SiteHeader } from "~/components/layout/SiteHeader";
import { HomeHero } from "~/components/sections/HomeHero";
import { CustomerLogos } from "~/components/sections/CustomerLogos";
import { getResultLevelInfo } from "~/lib/diagnostic";
import { 
  Users, Award, Sparkles, Send, 
  CheckCircle, ArrowRight, Zap, Target, BookOpen, AlertCircle,
  HelpCircle, MessageSquare, Check, Phone, ArrowUpRight, ChevronRight, ChevronLeft,
  RefreshCw, Smile, Heart, RefreshCcw, Compass, Lightbulb,
  Menu, X, FileText, Layers, ShieldCheck, Image as ImageIcon, Maximize2,
  TrendingUp, MessageCircle, Eye, Star, UserCheck, Shield, ChevronDown
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { tagName: "link", rel: "canonical", href: "https://choomcham.pages.dev/" },
    { title: "องค์กรตัวจริง™ THE AUTHENTIC ORGANIZATION | Choomcham Branding" },
    { name: "description", content: "หลักสูตรพัฒนาคน ทีม ผู้นำ และวัฒนธรรมองค์กร เพื่อพัฒนาคนจาก 'ข้างใน' ไปสู่การเปลี่ยนแปลงระดับ 'องค์กร' ภายใต้แนวคิด 'ตัวจริงต้องมีที่ยืน' โดย Choomcham Branding" },
    { name: "keywords", content: "องค์กรตัวจริง, The Authentic Organization, ตัวจริงต้องมีที่ยืน, Choomcham Branding, พัฒนาองค์กร, จัดอบรมองค์กร, Teamwork, Leadership, Corporate Culture, In-house Training, ครูอีฟ, พัฒนาคน" },
    { property: "og:title", content: "องค์กรตัวจริง™ THE AUTHENTIC ORGANIZATION | Choomcham Branding" },
    { property: "og:description", content: "หลักสูตรพัฒนาคน ทีม ผู้นำ และวัฒนธรรมองค์กร ผ่าน 5 ระดับการเติบโต ภายใต้แนวคิด 'ตัวจริงต้องมีที่ยืน'" },
    { property: "og:image", content: "/chumcham.png" },
  ];
}

// 5 Levels Data with exact refined copy
const AUTHENTIC_LEVELS = [
  {
    levelNumber: "LEVEL 1",
    code: "REBORN",
    title: "ตัวจริงของตัวเอง",
    hook: "ก่อนจะพัฒนางาน ต้องกลับมาเข้าใจ “คน” ที่กำลังทำงานนั้นก่อน",
    summary: "ค้นหาจุดแข็ง คุณค่า ตัวตน Mindset และบทบาทของตัวเองในองค์กร",
    quote: "เพื่อให้แต่ละคนตอบตัวเองได้ว่า “ฉันคือใคร ฉันมีคุณค่าอะไร และฉันมีที่ยืนตรงไหนในองค์กรนี้”",
    benefit: "คนที่ค้นพบคุณค่าและตัวตนของตัวเอง จะสามารถนำศักยภาพออกมาใช้ได้อย่างมั่นใจและเต็มกำลัง",
    icon: Compass,
    color: "from-brand-purple to-indigo-600",
    badge: "bg-purple-100 text-brand-purple border-purple-200"
  },
  {
    levelNumber: "LEVEL 2",
    code: "COMMUNICATION",
    title: "ตัวจริงที่สื่อสารเป็น",
    hook: "เก่งอย่างเดียวไม่พอ ถ้าสิ่งที่คิด ไม่สามารถส่งไปถึงคนอื่นได้",
    summary: "พัฒนาการฟัง การพูด การ Feedback การเข้าใจความแตกต่างของคน และการสื่อสารเพื่อทำงานร่วมกัน",
    quote: "เปลี่ยนจาก “ฉันเข้าใจของฉัน” เป็น “เรากำลังเข้าใจเรื่องเดียวกัน”",
    benefit: "สลายกำแพงความเงียบ ลดความขัดแย้ง และสร้างการสื่อสารที่มีประสิทธิภาพตรงเป้าหมาย",
    icon: MessageSquare,
    color: "from-brand-pink to-rose-600",
    badge: "bg-pink-100 text-brand-pink border-pink-200"
  },
  {
    levelNumber: "LEVEL 3",
    code: "TEAM",
    title: "ตัวจริงที่สร้างทีมเป็น",
    hook: "องค์กรไม่ได้โตจาก Hero เพียงคนเดียว แต่โตจากคนเก่ง ที่สามารถทำให้ “คนอื่นเก่งไปด้วยกัน”",
    summary: "สร้าง Trust, Ownership, ความเข้าใจในบทบาท และเป้าหมายร่วมกัน",
    quote: "เปลี่ยนจาก “ฉันทำงานของฉัน” เป็น “นี่คือเป้าหมายของเรา”",
    benefit: "ทลาย Silo ข้ามแผนก เชื่อมพลังให้ทุกคนมุ่งสู่ Shared Goal ใหญ่ขององค์กรอย่างพร้อมเพรียง",
    icon: Users,
    color: "from-brand-yellow to-amber-600",
    badge: "bg-amber-100 text-amber-800 border-amber-200"
  },
  {
    levelNumber: "LEVEL 4",
    code: "LEADER",
    title: "ตัวจริงที่นำคนเป็น",
    hook: "Leadership ไม่ได้เริ่มต้นในวันที่มีตำแหน่ง แต่เริ่มต้นในวันที่เราสามารถรับผิดชอบตัวเอง สร้างอิทธิพลเชิงบวก และทำให้คนรอบตัวเติบโตขึ้นได้",
    summary: "สร้างผู้นำ ที่ไม่ได้เพียง “สั่งให้คนทำ” แต่สามารถ “ทำให้คนอยากเดินไปด้วยกัน”",
    quote: "จากคนที่ “ทำงานเก่ง” สู่ผู้นำที่ “สร้างแรงบันดาลใจและดึงศักยภาพทีมออกมาได้จริง”",
    benefit: "พัฒนาหัวหน้าทีมและ Future Leader ให้เชี่ยวชาญทั้งมิติ 'งาน' และ 'การนำคน'",
    icon: Target,
    color: "from-brand-green to-teal-700",
    badge: "bg-emerald-100 text-brand-green border-emerald-200"
  },
  {
    levelNumber: "LEVEL 5",
    code: "CULTURE",
    title: "องค์กรที่ตัวจริงมีที่ยืน",
    hook: "เมื่อคนรู้จักตัวเอง สื่อสารเป็น ทำงานเป็นทีม และมีผู้นำที่แข็งแรง สิ่งที่เกิดขึ้นต่อไปคือ “วัฒนธรรมองค์กร”",
    summary: "วัฒนธรรมที่ไม่ได้อยู่แค่บนกำแพง หรืออยู่ใน Company Values แต่อยู่ในวิธีคิด วิธีพูด วิธีตัดสินใจ และวิธีทำงานของคนทุกวัน",
    quote: "เปลี่ยน Core Values จาก “คำประกาศบนกำแพง” เป็น “สิ่งที่คนจริง ๆ ทำในทุกวัน”",
    benefit: "สร้างวัฒนธรรมองค์กรที่แข็งแรงและยั่งยืน ที่คนตัวจริงทุกคนรู้สึกมีที่ยืนและพร้อมเติบโตไปด้วยกัน",
    icon: ShieldCheck,
    color: "from-brand-blue to-cyan-700",
    badge: "bg-blue-100 text-brand-blue border-blue-200"
  }
];

// FAQ Items Data
const FAQ_ITEMS = [
  {
    id: 1,
    category: "หลักสูตร & เหมาะกับใคร",
    question: "หลักสูตรนี้เหมาะกับองค์กรแบบไหน?",
    answer: `เหมาะกับองค์กรที่อยากพัฒนา “คน” ให้ทำงานได้ดีขึ้น และโตไปพร้อมกับองค์กรค่ะ

ไม่ว่าจะกำลังเจอเรื่อง:
• คนเก่ง แต่ทำงานร่วมกันยาก
• การสื่อสารในทีมไม่ชัด
• พนักงานขาด Ownership
• หัวหน้าเก่งงาน แต่ยังนำคนไม่เป็น
• แต่ละทีมต่างคนต่างทำ
• มี Core Values แต่ยังไม่เกิดขึ้นในการทำงานจริง

เล่าโจทย์ให้เราฟังก่อนได้เลย ทีมชุ่มฉ่ำจะช่วยดูว่าควรเริ่มพัฒนาจากตรงไหนค่ะ`
  },
  {
    id: 2,
    category: "เนื้อหาหลักสูตร",
    question: "หลักสูตรมีเรื่องอะไรบ้าง?",
    answer: `เราแบ่งการพัฒนาออกเป็น 5 ด้านค่ะ:

01 REBORN — รู้จักตัวเอง จุดแข็ง คุณค่า และบทบาทของตัวเองในองค์กร
02 COMMUNICATION — ฟังเป็น พูดเป็น Feedback เป็น และสื่อสารกับคนที่แตกต่างได้
03 TEAM — สร้าง Trust, Ownership และเป้าหมายร่วมกันของทีม
04 LEADER — พัฒนาจาก “คนเก่งงาน” สู่ “คนที่นำและพัฒนาคนอื่นได้”
05 CULTURE — ทำให้ Vision และ Core Values ไม่ใช่แค่คำบนกำแพง แต่เกิดขึ้นในการทำงานจริง`
  },
  {
    id: 3,
    category: "เนื้อหาหลักสูตร",
    question: "ต้องเรียนครบทั้ง 5 เรื่องไหม?",
    answer: `ไม่จำเป็นเลยค่ะ :)

เลือกเฉพาะเรื่องที่องค์กรต้องการได้ เช่น:
• ทีมมีปัญหาเรื่องการสื่อสาร → เน้น COMMUNICATION
• กำลังสร้างหัวหน้ารุ่นใหม่ → เน้น LEADER
• อยากให้แต่ละแผนกทำงานร่วมกันมากขึ้น → เน้น TEAM

หรือถ้าอยากพัฒนาต่อเนื่อง เราสามารถออกแบบเป็น Learning Journey ตั้งแต่ “คน → ทีม → ผู้นำ → Culture” ได้ค่ะ`
  },
  {
    id: 4,
    category: "การปรับหลักสูตร",
    question: "สามารถออกแบบหลักสูตรเฉพาะองค์กรได้ไหม?",
    answer: `ได้ค่ะ และเราแนะนำแบบนี้เลย!

เพราะแต่ละองค์กรมี “คน” และ “ปัญหา” ไม่เหมือนกัน ก่อนออกแบบหลักสูตร ทีมชุ่มฉ่ำจะคุยกับ HR / ผู้บริหารก่อนว่า:
• ตอนนี้เกิดอะไรขึ้น?
• อยากแก้ปัญหาอะไร?
• และหลังอบรมอยากเห็นอะไรเปลี่ยนไป?

จากนั้นเราค่อยออกแบบเนื้อหา Workshop และรูปแบบการเรียนให้เหมาะกับองค์กรค่ะ`
  },
  {
    id: 5,
    category: "วิทยากร",
    question: "ใครเป็นคนสอน?",
    answer: `หลักสูตรออกแบบโดย Choomcham Branding ภายใต้แนวคิด “ตัวจริงต้องมีที่ยืน”

โดยมี “ครูอีฟ — Eve Pattars” Founder of Choomcham Branding เป็นวิทยากรหลักในด้าน:
• Branding & Brand DNA
• Storytelling & Communication
• Personal Branding

และในหัวข้อเฉพาะทาง จะมีวิทยากรจากทีมชุ่มฉ่ำที่เชี่ยวชาญในด้านนั้น ๆ มาร่วมดูแล เราไม่ได้เลือกวิทยากรแค่ว่า “ใครพูดเก่ง” แต่ดูว่า “ใครเหมาะที่สุดกับโจทย์ขององค์กรนี้?”`
  },
  {
    id: 6,
    category: "รูปแบบการสอน",
    question: "เป็นการนั่งฟังบรรยายทั้งวันไหม?",
    answer: `ไม่ใช่ค่ะ :)

เราไม่อยากให้ทุกคนนั่งฟังทั้งวัน แล้ววันรุ่งขึ้นกลับไปทำงานเหมือนเดิม แต่ละคลาสจึงมีทั้ง:
• เนื้อหาที่เข้าใจง่าย
• Case Study
• กิจกรรม & Workshop
• การแลกเปลี่ยนในทีม
• การนำโจทย์จริงขององค์กรมาใช้

หลักคิดของเราคือ “เข้าใจ → ได้ลอง → กลับไปใช้ได้จริง”`
  },
  {
    id: 7,
    category: "ผู้เรียน",
    question: "ถ้าพนักงานเงียบ ไม่ค่อยกล้าพูด เรียนได้ไหม?",
    answer: `ได้เลยค่ะ

เราไม่ได้คาดหวังว่าทุกคนต้องเป็นคนพูดเก่ง หรือกล้าแสดงออกตั้งแต่แรก กิจกรรมจะค่อย ๆ เปิดพื้นที่ให้แต่ละคนมีส่วนร่วมในแบบของตัวเอง

เพราะคำว่า “ตัวจริงต้องมีที่ยืน” ไม่ได้หมายถึงเฉพาะคนที่เสียงดังที่สุดในห้องค่ะ :)`
  },
  {
    id: 8,
    category: "ผู้เรียน",
    question: "อบรมได้ตั้งแต่พนักงานจนถึงผู้บริหารไหม?",
    answer: `ได้ค่ะ แต่เนื้อหาจะไม่เหมือนกันทุกระดับ:

• พนักงาน → เน้นตัวเอง การสื่อสาร และการทำงานเป็นทีม
• หัวหน้า / Manager → เพิ่ม Feedback, Leadership และการนำคน
• ผู้บริหาร → เน้น Leadership, Culture และการส่งต่อ Vision ขององค์กร

เราจะปรับภาษา กิจกรรม และ Case ให้เหมาะกับผู้เรียนค่ะ`
  },
  {
    id: 9,
    category: "Team Building",
    question: "ถ้าอยากทำ Team Building อย่างเดียวได้ไหม?",
    answer: `ได้ค่ะ และ Team Building ของเราไม่จำเป็นต้องจบแค่ “เล่นเกมแล้วสนุก” :)

เราสามารถออกแบบให้ทีมรู้จักกันมากขึ้น เข้าใจความแตกต่าง สร้าง Trust เห็นคุณค่าของกันและกัน และกลับมาเห็นว่า “เรากำลังทำสิ่งนี้ไปด้วยกันเพื่ออะไร?”

สนุกได้ แต่ต้องได้อะไรกลับไปด้วยค่ะ`
  },
  {
    id: 10,
    category: "ขนาดกลุ่ม & สถานที่",
    question: "อบรมกี่คนได้บ้าง?",
    answer: `ได้ทั้งกลุ่มเล็กและกลุ่มใหญ่ค่ะ จำนวนคนจะมีผลต่อรูปแบบกิจกรรมและ Workshop:

• กลุ่มเล็ก: สามารถพูดคุยและลงรายละเอียดได้ลึก
• กลุ่มใหญ่: เราจะออกแบบกิจกรรมให้ทุกคนยังมีส่วนร่วมได้

แจ้งจำนวนคนคร่าว ๆ มาได้เลย ทีมชุ่มฉ่ำช่วยแนะนำ Format ให้ค่ะ`
  },
  {
    id: 11,
    category: "ขนาดกลุ่ม & สถานที่",
    question: "จัดอบรมที่บริษัทได้ไหม?",
    answer: `ได้เลยค่ะ สามารถจัดแบบ In-house ที่บริษัทหรือสถานที่ที่องค์กรเตรียมไว้ได้ จะเป็นครึ่งวัน 1 วัน หรือหลาย Session ต่อเนื่อง ก็สามารถออกแบบได้ค่ะ`
  },
  {
    id: 12,
    category: "ขนาดกลุ่ม & สถานที่",
    question: "มีอบรมออนไลน์ไหม?",
    answer: `มีค่ะ บางหัวข้อสามารถออกแบบเป็น Online Workshop ได้ แต่ถ้าเป็นเรื่อง Team หรือ Culture ที่ต้องใช้ Interaction ค่อนข้างเยอะ ทีมจะแนะนำรูปแบบที่เหมาะกับผลลัพธ์ที่องค์กรต้องการค่ะ`
  },
  {
    id: 13,
    category: "ผลลัพธ์",
    question: "หลังอบรมควรเห็นอะไรเปลี่ยนไป?",
    answer: `เราไม่ได้อยากให้ผลลัพธ์จบแค่ “วันนี้อบรมสนุกมาก” แต่อยากเห็นคนกลับไปทำงานแล้ว:
• เข้าใจตัวเองมากขึ้น
• สื่อสารกันดีขึ้น
• Feedback กันเป็นขึ้น
• เข้าใจความแตกต่างของคน
• มี Ownership กับงานมากขึ้น
• ทำงานร่วมกันดีขึ้น
• หัวหน้านำคนได้ดีขึ้น
• ทีมเห็นเป้าหมายเดียวกันชัดขึ้น

ผลลัพธ์จริงจะขึ้นอยู่กับโจทย์และรูปแบบของแต่ละโปรแกรมค่ะ`
  },
  {
    id: 14,
    category: "ราคา & เสนอราคา",
    question: "ราคาหลักสูตรเท่าไร?",
    answer: `ราคาจะขึ้นอยู่กับโจทย์ขององค์กรค่ะ เพราะเราไม่ได้มีหลักสูตรเดียวแล้วนำไปใช้เหมือนกันทุกบริษัท

ราคาจะพิจารณาจาก:
• หัวข้อ
• จำนวนผู้เข้าอบรม
• ระยะเวลา
• รูปแบบ Workshop
• ระดับการ Customize

ส่งโจทย์มาให้ทีมก่อนได้เลยค่ะ เราจะช่วยแนะนำรูปแบบพร้อมจัดทำ Proposal และใบเสนอราคาให้`
  },
  {
    id: 15,
    category: "การปรึกษา",
    question: "ยังไม่รู้เลยว่าควรเลือกหลักสูตรไหน ทำยังไงดี?",
    answer: `ไม่ต้องเลือกมาก่อนก็ได้ค่ะ 🤍

จริง ๆ สิ่งที่เราอยากรู้มากกว่าคือ:
1. “ตอนนี้ทีมกำลังเจอปัญหาอะไร?”
2. “หลังจากพัฒนาทีมแล้ว อยากเห็นอะไรเปลี่ยนไป?”

เล่า 2 เรื่องนี้ให้เราฟัง ทีมชุ่มฉ่ำจะช่วยวิเคราะห์และแนะนำว่าองค์กรควรเริ่มพัฒนาจากตรงไหนค่ะ`
  },
  {
    id: 16,
    category: "การเริ่มต้น",
    question: "ถ้าสนใจ เริ่มต้นยังไง?",
    answer: `ทักมาคุยกับ “น้องฉ่ำ” ได้เลยค่ะ :)

แจ้งคร่าว ๆ ว่า:
• องค์กรทำธุรกิจอะไร
• ตอนนี้ทีมกำลังเจอโจทย์อะไร
• อยากเห็นอะไรเปลี่ยนหลังอบรม
• จำนวนผู้เข้าอบรมประมาณกี่คน
• ช่วงเวลาที่ต้องการจัด

จากนั้นทีมชุ่มฉ่ำจะช่วยแนะนำรูปแบบหลักสูตรที่เหมาะกับองค์กรให้ค่ะ

เพราะเราไม่ได้อยาก “จัดอบรมให้จบไปอีกหนึ่งวัน” แต่อยากให้สิ่งที่เกิดขึ้นในห้องเรียน กลับไปเปลี่ยน “สิ่งที่เกิดขึ้นในวันทำงานจริง”`
  }
];

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

const PROGRAM_FORMATS = [
  {
    id: "inhouse",
    title: "In-house Training & Workshop",
    desc: "จัดอบรมภายในองค์กรเฉพาะทีม ออกแบบเนื้อหาและกิจกรรมตามโจทย์จริงของธุรกิจ",
    icon: BookOpen,
    tag: "Custom Workshop"
  },
  {
    id: "comm",
    title: "Communication Workshop",
    desc: "เวิร์กช็อปยกระดับทักษะการฟัง การสื่อสารเชิงบวก การ Feedback และการคุยแบบเข้าใจกัน",
    icon: MessageSquare,
    tag: "Communication Mastery"
  },
  {
    id: "team",
    title: "Team Development",
    desc: "สร้าง Trust, Collaboration และความรู้สึกเป็นเจ้าของ (Ownership) เพื่อ Shared Goal เดียวกัน",
    icon: Users,
    tag: "Team Connection"
  },
  {
    id: "leader",
    title: "Leadership Development",
    desc: "พัฒนาหัวหน้าทีมและผู้บริหารให้เข้าใจทั้งมิติ 'งาน' และ 'คน' เพื่อนำทีมอย่างมีประสิทธิผล",
    icon: Target,
    tag: "Leader Shift"
  },
  {
    id: "future",
    title: "Future Leader Program",
    desc: "บ่มเพาะผู้นำรุ่นใหม่ (Talents & Middle Management) ให้พร้อมก้าวขึ้นมาขับเคลื่อนองค์กร",
    icon: Sparkles,
    tag: "Next-Gen Talent"
  },
  {
    id: "culture",
    title: "Culture Workshop",
    desc: "เปลี่ยน Core Values บนกระดาษให้กลายเป็นพฤติกรรม วิธีคิด และการปฏิบัติจริงในทุกวัน",
    icon: ShieldCheck,
    tag: "Culture in Action"
  },
  {
    id: "custom",
    title: "Customized Organization Program",
    desc: "ออกแบบ Development Journey ต่อเนื่องระยะยาว ผสานหลายโมดูลตามเป้าหมายขององค์กร",
    icon: Layers,
    tag: "Full Transformation"
  }
];

const TARGET_CRITERIA = [
  "มีคนเก่ง แต่ Collaboration ยังไม่แข็งแรง",
  "ทีมต่างคนต่างทำ และต้องการสร้าง Shared Goal",
  "ต้องการเพิ่ม Ownership ให้พนักงาน",
  "กำลังพัฒนา Middle Management / Future Leader",
  "หัวหน้าเก่งงาน แต่ต้องการพัฒนาทักษะการนำคน",
  "ต้องการยกระดับ Communication ภายในองค์กร",
  "มี Vision / Mission / Core Values แต่ต้องการทำให้เกิดขึ้นในการทำงานจริง",
  "องค์กรกำลังโต และต้องการให้ “คน” โตทันธุรกิจ"
];

const EXPECTED_OUTCOMES = [
  { text: "เข้าใจตัวเองมากขึ้น", desc: "รู้จุดแข็ง คุณค่า และบทบาทของตัวเองชัดเจน" },
  { text: "สื่อสารกันดีขึ้น", desc: "คุยกันรู้เรื่อง ลดกำแพงและสลายความเข้าใจผิด" },
  { text: "Feedback กันเป็นขึ้น", desc: "กล้าให้และรับคำติชมอย่างสร้างสรรค์เพื่อพัฒนางาน" },
  { text: "เข้าใจความแตกต่างของคนมากขึ้น", desc: "ยอมรับและดึงจุดเด่นของเพื่อนร่วมงานมาเสริมกัน" },
  { text: "มี Ownership กับงานมากขึ้น", desc: "รู้สึกเป็นเจ้าของ ไม่รอคำสั่ง พร้อมแก้ปัญหาเชิงรุก" },
  { text: "ทำงานร่วมกันได้ดีขึ้น", desc: "ทลาย Silo และร่วมมือกันข้ามแผนกอย่างลื่นไหล" },
  { text: "หัวหน้านำคนได้ดีขึ้น", desc: "รู้วิธีสร้างแรงบันดาลใจและดึงศักยภาพลูกทีมออกมา" },
  { text: "ทั้งทีมเห็นเป้าหมายเดียวกันชัดขึ้น", desc: "ทุกคนมุ่งสู่ Shared Goal เดียวกันขององค์กร" }
];

const CASE_STUDIES = [
  {
    client: "มาดามฟิน (Madame Fin)",
    tag: "Content Direction & Team Alignment",
    before: "จากการทำ Content ที่ยังขาด Direction และทีมมองภาพไม่ตรงกัน",
    after: "สู่การทำให้ทีมเห็นเป้าหมาย ทิศทางของการสื่อสารชัดเจน และทำงานร่วมกันอย่างมีพลัง",
    quote: "“ทำให้คนในทีมเข้าใจสิ่งที่แบรนด์ต้องการสื่อสาร และร่วมมือกันสร้างผลงานได้อย่างตรงเป้าหมาย”"
  },
  {
    client: "กังนัมคลินิก (Gangnam Clinic)",
    tag: "Brand Value & Culture Alignment",
    before: "จาก Brand Value ที่ต้องการส่งต่อให้คนในองค์กรทุกระดับเข้าใจ",
    after: "สู่การทำให้ทีมเข้าใจและสื่อสารคุณค่าของแบรนด์ได้อย่างชัดเจน ทั้งต่อเพื่อนร่วมงานและลูกค้า",
    quote: "“ช่วยเชื่อมต่อคุณค่าของแบรนด์ให้กลายเป็นวิธีทำงานและจิตวิญญาณของทีมงานในชีวิตจริง”"
  }
];

const WORKSHOP_GALLERY_IMAGES = [
  // --- Solutions & Leadership Programs ---
  {
    id: "wsg-leader-1",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Workshop_Gallery/TEAM_Leader.jpg",
    title: "Team Leadership & People Management — พัฒนาทักษะผู้นำและการนำทีมสู่เป้าหมาย",
    category: "Level 4: Leader"
  },
  {
    id: "wsg-team-1",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Workshop_Gallery/TEAM_Leader1.jpg",
    title: "Team Building & Cross-Functional Synergy — หลอมรวมพลังทีมและทลาย Silo ข้ามแผนก",
    category: "Level 3: Team"
  },
  {
    id: "wsg-leader-2",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Workshop_Gallery/TEAM_Leader2.jpg",
    title: "Facilitative Leadership in Action — ผู้นำกระบวนการและการโค้ชดึงศักยภาพทีม",
    category: "Level 4: Leader"
  },
  {
    id: "wsg-team-2",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Workshop_Gallery/TEAM_Leader3.jpg",
    title: "High-Performance Teamwork & Ownership — สร้างความรับผิดชอบร่วมและวัฒนธรรมทีมแกร่ง",
    category: "Level 3: Team"
  },
  {
    id: "wsg-culture",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Workshop_Gallery/Organization%20Culture.jpg",
    title: "Organization Culture & Values Alignment — ขับเคลื่อนวัฒนธรรมองค์กรสู่การปฏิบัติจริง",
    category: "Level 5: Culture"
  },
  {
    id: "wsg-inhouse",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Workshop_Gallery/Customized%20In-house%20Solutions.jpg",
    title: "Customized In-house Solutions — ออกแบบหลักสูตรเฉพาะตรงโจทย์และบริบทองค์กร",
    category: "In-house Solutions"
  },
  {
    id: "wsg-od",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Workshop_Gallery/Comprehensive%20OD%20%26%20Training%20Solutions.jpg",
    title: "Comprehensive OD & Training Solutions — พัฒนาองค์กรแบบองค์รวมครบวงจร",
    category: "OD Solutions"
  },

  // --- Real Atmosphere & Activities (Reimagine & Recreate) ---
  {
    id: "g-1",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine1.jpg",
    title: "Facilitative Leadership & Strategic Ideation — ปลุกพลังความคิดสร้างสรรค์และผู้นำยุคใหม่",
    category: "Level 4: Leader"
  },
  {
    id: "g-2",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine2.jpg",
    title: "Empathic Listening & Deep Dialogue — สื่อสารจากใจและเปิดรับความแตกต่าง",
    category: "Level 2: Communication"
  },
  {
    id: "g-3",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine3.jpg",
    title: "Self-Reflection & Awareness — ค้นหาคุณค่าและปลดล็อกศักยภาพตัวจริงในตัวเอง",
    category: "Level 1: Reborn"
  },
  {
    id: "g-4",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine4.jpg",
    title: "Interactive Engagement — การเรียนรู้ผ่านกระบวนการมีส่วนร่วมเต็มร้อย",
    category: "Level 3: Team"
  },
  {
    id: "g-5",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine5.jpg",
    title: "Growth Mindset & Inner Transformation — พัฒนากรอบคิดเพื่อการเติบโตอย่างมั่นคง",
    category: "Level 1: Reborn"
  },
  {
    id: "g-6",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine6.jpg",
    title: "Culture in Action — เปลี่ยนค่านิยมบนกำแพงสู่วิถีการทำงานจริงทุกวัน",
    category: "Level 5: Culture"
  },
  {
    id: "g-7",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine7.jpg",
    title: "Trust Building & Psychological Safety — สร้างพื้นที่ปลอดภัยและความไว้ใจในทีม",
    category: "Level 3: Team"
  },
  {
    id: "g-8",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine8.jpg",
    title: "Collaborative Problem Solving — ร่วมคิด ร่วมแก้ปัญหา สู่ผลลัพธ์ที่เป็นเลิศ",
    category: "Level 3: Team"
  },
  {
    id: "g-9",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine9.jpg",
    title: "Inspiring Moments & Positive Energy — เติมพลังบวกและแรงบันดาลใจในการทำงาน",
    category: "Level 1: Reborn"
  },
  {
    id: "g-10",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine10.jpg",
    title: "Active Participation & Diversity — เคารพความหลากหลายและเปิดรับทุกมุมมอง",
    category: "Level 2: Communication"
  },
  {
    id: "g-11",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine11.jpg",
    title: "Collective Debrief & Takeaways — ถอดบทเรียนและแปลงสู่แนวทางปฏิบัติงานจริง",
    category: "Level 4: Leader"
  },
  {
    id: "g-12",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/reimagine/REimagine.jpg",
    title: "Reimagine The Future Organization — ร่วมออกแบบวิสัยทัศน์และการทำงานสู่อนาคต",
    category: "Level 5: Culture"
  },
  {
    id: "g-13",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/REcreate/Recreate2.jpg",
    title: "Action Plan & Team Commitment — พันธสัญญาการเปลี่ยนแปลงและแผนการปฏิบัติการ",
    category: "Level 5: Culture"
  },
  {
    id: "g-14",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/REcreate/Recreate3.jpg",
    title: "Living Organization Building — บูรณาการคน ทีม และผู้นำสู่องค์กรที่มีชีวิต",
    category: "Level 5: Culture"
  },
  {
    id: "g-15",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/REcreate/Recreate4.jpg",
    title: "Experiential Learning Dynamic — การเรียนรู้จากประสบการณ์ตรงเพื่อการเปลี่ยนแปลงถาวร",
    category: "Level 3: Team"
  },
  {
    id: "g-16",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/REcreate/Recreate5.jpg",
    title: "Team Breakthrough & Celebration — ฉลองก้าวสำคัญแห่งการเติบโตร่วมกัน",
    category: "Level 3: Team"
  },
  {
    id: "g-17",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/Alive_Model/REcreate/Recreate6.jpg",
    title: "Sustainable Culture & Legacy — วัฒนธรรมที่ตัวจริงมีที่ยืนอย่างยั่งยืน",
    category: "Level 5: Culture"
  }
];

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const formData = await request.formData();
    const formType = (formData.get("form_type") as string) || "contact";
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const position = formData.get("position") as string;
    const email_or_line = formData.get("email_or_line") as string;
    const team_size = (formData.get("team_size") as string) || "";
    const score = parseInt((formData.get("score") as string) || "0", 10);
    const result_level = (formData.get("result_level") as string) || "CONSULTATION";
    const answersStr = formData.get("answers") as string;
    const answers = answersStr ? JSON.parse(answersStr) : [];
    
    const program_interest = (formData.get("program_interest") as string) || "";
    const timeline = (formData.get("timeline") as string) || "";
    const details = (formData.get("details") as string) || "";

    const leadPayload = {
      name,
      company,
      position,
      email_or_line,
      team_size: team_size || (program_interest ? `สนใจ: ${program_interest}` : "ไม่ได้ระบุ"),
      score,
      result_level,
      answers,
      dimensions_scores: {
        form_type: formType,
        program_interest,
        timeline,
        details
      }
    };

    // Notifications and persistence run only on the server.
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadPayload),
    });
    const data = await response.json();
    if (!response.ok || !data.success || !data.lead?.id || String(data.lead.id).startsWith("edge-")) {
      return { success: false, formType, error: "ยังบันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" };
    }
    return { success: true, formType, dbResult: data.lead };
  } catch (error: any) {
    console.error("Action error:", error);
    return { success: false, error: error.message || "Failed to process lead submission" };
  }
}

const PROGRAM_OPTIONS = [
  "Module 01: ปลุกคนหมดไฟ & ซอมบี้ในที่ทำงาน (Reborn People)",
  "Module 02: ทลายกำแพง Silo สู่ทีมที่มีชีวิต (Alive Team)",
  "Module 03: ผู้นำตัวจริงที่ไม่ต้องแบกงานคนเดียว (Reborn Leader)",
  "Module 04: วัฒนธรรมองค์กรตัวจริงที่ยั่งยืน (Living Culture)",
  "Flagship Program: From Zombie to Living Organization (ครบวงจร)",
  "Level 1: ตัวจริงของตัวเอง (Self-Discovery & Mindset)",
  "Level 2: ตัวจริงที่สื่อสารเป็น (Authentic Communication & Feedback)",
  "Level 3: ตัวจริงที่สร้างทีมเป็น (Team Synergy & Psychological Safety)",
  "Level 4: ตัวจริงที่นำคนเป็น (Empowering Leadership & Coaching)",
  "Level 5: วัฒนธรรมที่ตัวจริงมีที่ยืน (Living Organization Culture)",
  "In-house Training & Workshop (อบรมภายในองค์กร)",
  "Customized Organization Transformation (ออกแบบเฉพาะโจทย์องค์กร)"
];

export default function Home() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  
  const [quizSubmittedOverride, setQuizSubmittedOverride] = useState(false);
  const hasSubmittedQuiz = !quizSubmittedOverride && Boolean(fetcher.data && (fetcher.data as any).success && (fetcher.data as any).formType === "quiz");
  const hasSubmittedContact = Boolean(fetcher.data && (fetcher.data as any).success && (fetcher.data as any).formType === "contact");
  useEffect(() => {
    if (fetcher.data && (fetcher.data as any).success && (fetcher.data as any).formType === "quiz") {
      setQuizSubmittedOverride(false);
    }
  }, [fetcher.data]);

  // Contact Form Tab State & Program Selection
  const [inquiryType, setInquiryType] = useState<"consultation" | "proposal" | "program">("consultation");
  const [selectedProgram, setSelectedProgram] = useState<string>("Module 01: ปลุกคนหมดไฟ & ซอมบี้ในที่ทำงาน (Reborn People)");

  const handleRequestProposal = (programTitle: string) => {
    setInquiryType("proposal");
    setSelectedProgram(programTitle);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // FAQ open/close state (open multiple or single)
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  // Quiz States
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [lastCalculatedScore, setLastCalculatedScore] = useState(0);

  // Result Mapping
  const getResultLevel = (score: number) => {
    if (score >= 31) {
      return { 
        level: "ALIVE", 
        title: "ALIVE - องค์กรมีพลังชีวิตและวัฒนธรรมเข้มแข็ง", 
        color: "text-brand-green border-brand-green bg-brand-green/10", 
        glow: "glow-green", 
        desc: "องค์กรของคุณมีพลังชีวิตที่ดีเยี่ยม คนมี Ownership กล้าแสดงความเห็น และทีมร่วมมือร่วมใจกันสร้างสรรค์สิ่งใหม่ จุดท้าทายคือจะรักษามาตรฐานและช่วยให้องค์กรขยายสเกลโดยไม่สูญเสียจิตวิญญาณแห่งความเป็นมนุษย์ไปอย่างไร" 
      };
    }
    if (score >= 23) {
      return { 
        level: "TIRED", 
        title: "TIRED - เริ่มมีสัญญาณความเหนื่อยสะสมและ Silo แอบแฝง", 
        color: "text-brand-yellow border-brand-yellow bg-brand-yellow/10", 
        glow: "glow-amber", 
        desc: "องค์กรเริ่มมีสัญญาณความเฉื่อยและการสะสมความเหนื่อยล้า พนักงานยังคงทำงานได้ดีตาม KPI แต่เริ่มสูญเสียพลังสร้างสรรค์และความคิดริเริ่ม หากปล่อยทิ้งไว้โดยไม่เติมนวัตกรรมหรือการดูแลคน มีความเสี่ยงที่จะไหลลึกไปสู่ระดับ Faded" 
      };
    }
    if (score >= 15) {
      return { 
        level: "FADED", 
        title: "FADED - พลังของคนเริ่มจางหาย ต่างคนต่างทำ", 
        color: "text-brand-blue border-brand-blue bg-brand-blue/10", 
        glow: "glow-blue", 
        desc: "คนทำงานเริ่มแยกตัว ต่างคนต่างทำเพื่อเอาตัวรอด ประชุมค่อนข้างเงียบและมีการสื่อสารแนวราบที่ลดลง ความเฉื่อยชากำลังกลายเป็นนิสัยปกติใหม่ในบริษัท ความคิดสร้างสรรค์และนวัตกรรมเริ่มหดหายไป ต้องการการรื้อฟื้นแนวคิดและเติมพลังความเชื่อมโยงในทีมด่วน" 
      };
    }
    return { 
      level: "ZOMBIE", 
      title: "ZOMBIE - ร่างยังทำแต่งาน แต่ใจขาดพื้นที่แสดงศักยภาพ", 
      color: "text-brand-pink border-brand-pink bg-brand-pink/10", 
      glow: "glow-pink", 
      desc: "องค์กรของคุณอยู่ในขีดอันตรายสูงสุด พนักงานทำงานแบบไร้วิญญาณเหมือนหุ่นยนต์ ทำตามคำสั่งไปวันๆ เพื่อรอเวลาเลิกงาน ไม่กล้าพูด ไม่มีความสุข และ Silo แยกส่วนขัดแย้งรุนแรง ปล่อยไว้อนาคตองค์กรจะโตยากเพราะคนข้างในหมดไฟสะสม ต้องการการฟื้นฟู Transformation จากข้างในด่วนที่สุด!" 
    };
  };

  const currentScore = quizAnswers.length > 0 
    ? quizAnswers.reduce((sum, val) => sum + val, 0)
    : lastCalculatedScore;
  const resultInfo = getResultLevel(currentScore);

  // Gallery Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : WORKSHOP_GALLERY_IMAGES.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < WORKSHOP_GALLERY_IMAGES.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const handleAnswerSelect = (score: number) => {
    const newAnswers = [...quizAnswers, score];
    setQuizAnswers(newAnswers);

    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      const finalScore = newAnswers.reduce((sum, val) => sum + val, 0);
      setLastCalculatedScore(finalScore);
      setShowLeadForm(true);
      requestAnimationFrame(() => document.getElementById("quiz-result-title")?.focus());
    }
  };

  const restartQuiz = () => {
    setQuizSubmittedOverride(true);
    setQuizStarted(false);
    setCurrentQIndex(0);
    setQuizAnswers([]);
    setShowLeadForm(false);
    setLastCalculatedScore(0);
    
    if (typeof document !== "undefined") {
      const elem = document.getElementById("zombie-check");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="home-page min-h-screen bg-brand-white text-brand-black font-sans selection:bg-brand-pink selection:text-brand-white relative">
      
      <a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
      <SiteHeader />

      {/* Main Container */}
      <main id="main-content" className="relative z-10">

        {/* ========================================================
            SECTION 1: HERO / องค์กรตัวจริง™
        ======================================================== */}
        <HomeHero />

        {/* ========================================================
            SECTION 2: TRUSTED CLIENTS & ORGANIZATIONS
        ======================================================== */}
        <CustomerLogos />

        {/* ========================================================
            SECTION 9: INTERACTIVE EVALUATION (ZOMBIE CHECK™)
        ======================================================== */}
        <section id="zombie-check" className="py-20 lg:py-28 px-6 bg-slate-900 text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto relative z-10">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-brand-pink/20 border border-brand-pink/30 text-brand-pink text-xs font-bold uppercase tracking-widest mb-4 font-display">
                <span>🧟</span>
                <span>ZOMBIE ORGANIZATION CHECK™ · THE AUTHENTIC DIAGNOSTIC</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 font-sans">
                องค์กรของคุณกำลังเป็นซอมบี้แค่ไหน? 🧟
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                ตอบ 10 คำถามเพื่อวัดสภาวะจริง ค้นพบสัญญาณความเฉื่อยชาที่ซ่อนอยู่ และรับแนวทางฟื้นฟูทีมจากข้างในสู่ <strong>Living Organization</strong>
              </p>
            </div>

            {/* Quiz Flow Component */}
            {!quizStarted && !showLeadForm && !hasSubmittedQuiz && (
              <div className="p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center shadow-2xl">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-pink/30 to-brand-purple/30 text-brand-pink flex items-center justify-center mx-auto mb-6 border border-white/15 shadow-inner text-3xl">
                  🧟
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-display">
                  พร้อมสำรวจดัชนีสุขภาพของทีมคุณแล้วหรือยัง?
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
                  ใช้เวลาประมาณ 3 นาที เพื่อค้นพบว่าองค์กรของคุณอยู่ในสภาวะใด จาก 4 ระดับ:
                </p>

                {/* 4 Levels Preview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 text-left">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/30">
                    <span className="text-[10px] font-bold text-pink-400 block font-display">10–14 คะแนน</span>
                    <span className="text-xs font-bold text-white block mt-0.5">🧟 ZOMBIE</span>
                    <span className="text-[11px] text-slate-400 block mt-1">หมดไฟ ไร้วิญญาณ</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-blue-500/30">
                    <span className="text-[10px] font-bold text-blue-400 block font-display">15–22 คะแนน</span>
                    <span className="text-xs font-bold text-white block mt-0.5">💨 FADED</span>
                    <span className="text-[11px] text-slate-400 block mt-1">เริ่มเงียบ ต่างคนต่างทำ</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-amber-500/30">
                    <span className="text-[10px] font-bold text-amber-400 block font-display">23–30 คะแนน</span>
                    <span className="text-xs font-bold text-white block mt-0.5">⚠️ TIRED</span>
                    <span className="text-[11px] text-slate-400 block mt-1">เหนื่อยสะสม ขาดไฟใหม่</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/30">
                    <span className="text-[10px] font-bold text-emerald-400 block font-display">31–40 คะแนน</span>
                    <span className="text-xs font-bold text-white block mt-0.5">✨ ALIVE</span>
                    <span className="text-[11px] text-slate-400 block mt-1">องค์กรตัวจริงมีพลัง</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setQuizStarted(true)}
                  className="px-10 py-4 rounded-pill bg-gradient-to-r from-brand-pink to-rose-600 text-white font-display font-bold text-base hover:shadow-xl hover:shadow-brand-pink/40 hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>🧟 เริ่มทำแบบประเมิน Zombie Check™</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* In-Progress Quiz Questions */}
            {quizStarted && !showLeadForm && !hasSubmittedQuiz && (
              <div className="p-6 sm:p-10 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 text-xs font-display">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-brand-pink/20 text-brand-pink font-bold border border-brand-pink/30">
                      คำถาม {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-slate-400 hidden sm:inline">Zombie Organization Index</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300 font-medium">ความคืบหน้า {Math.round(((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                    <div className="w-24 sm:w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-pink transition-all duration-300"
                        style={{ width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <h3 aria-live="polite" className="text-lg sm:text-2xl font-extrabold text-white mb-6 leading-relaxed">
                  {QUIZ_QUESTIONS[currentQIndex].question}
                </h3>

                <div className="space-y-3">
                  {QUIZ_QUESTIONS[currentQIndex].answers.map((ans, aIdx) => (
                    <button
                      key={aIdx}
                      type="button"
                      onClick={() => handleAnswerSelect(ans.score)}
                      className="w-full p-4.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-brand-pink/50 text-left text-xs sm:text-sm text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-brand-pink group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 mt-0.5 transition-colors font-display">
                          {String.fromCharCode(65 + aIdx)}
                        </span>
                        <span className="leading-relaxed">{ans.text}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-brand-pink shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>

                {currentQIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentQIndex(currentQIndex - 1);
                      setQuizAnswers(quizAnswers.slice(0, -1));
                    }}
                    className="mt-6 text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-display"
                  >
                    <ChevronLeft className="w-4 h-4" /> ย้อนกลับไปข้อก่อนหน้า
                  </button>
                )}
              </div>
            )}

            {/* Completed Assessment Result Display */}
            {showLeadForm && (
              <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 shadow-xs text-center animate-in zoom-in-95 duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-3 font-display">
                  <span>📊</span>
                  <span>คะแนนรวม: {currentScore} / 40 คะแนน</span>
                </div>

                <h3 tabIndex={-1} id="quiz-result-title" className="text-2xl sm:text-3xl font-extrabold mb-4 font-display text-slate-900">
                  {resultInfo.title}
                </h3>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-2xl mx-auto mb-8">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                    {getResultLevelInfo(currentScore).description}
                  </p>
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs sm:text-sm text-brand-purple font-medium">
                    💡 <strong>หลักสูตรแนะนำสำหรับสภาวะนี้:</strong> หลักสูตร <em>From Zombie to Living Organization</em> (เน้นโมดูล {resultInfo.level === "ZOMBIE" ? "REBORN PEOPLE & ALIVE TEAM" : resultInfo.level === "FADED" ? "ALIVE TEAM & REBORN LEADER" : resultInfo.level === "TIRED" ? "REBORN LEADER & LIVING CULTURE" : "LIVING CULTURE & BRAND DNA"})
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-6">ผลนี้สะท้อนมุมมองของผู้ตอบ ณ เวลานี้ ใช้เป็นจุดเริ่มต้นในการพูดคุยกับทีม</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="#contact"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-pill bg-brand-pink text-white font-display font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    ปรึกษาทีมชุ่มฉ่ำเพื่อวางแผนปลดล็อกทีม
                  </a>
                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-pill bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-semibold text-sm transition-colors cursor-pointer"
                  >
                    ทำแบบประเมินอีกครั้ง
                  </button>
                </div>
              </div>
            )}


            {hasSubmittedQuiz && <p className="mt-6 p-4 rounded-xl bg-white/10 text-white" role="status">ได้รับคำขอติดต่อแล้ว ทีมชุ่มฉ่ำจะพูดคุยกับคุณผ่านช่องทางที่แจ้งไว้</p>}

            {/* Assessment Lead Submission Form */}
            {showLeadForm && !hasSubmittedQuiz && (
              <div className="p-6 sm:p-10 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="text-center mb-8">
                  <div className="inline-block px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2 font-display border border-amber-400/30">
                    ✓ ประเมินครบทั้ง 10 ข้อเรียบร้อยแล้ว
                  </div>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-white font-sans">
                    อยากเปลี่ยน Insight เป็นแผนพัฒนาทีม?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2">
                    ฝากช่องทางติดต่อไว้ให้ทีมชุ่มฉ่ำพูดคุยถึงโจทย์และแนวทางที่เหมาะกับองค์กรของคุณ
                  </p>
                </div>

                <fetcher.Form method="post" className="space-y-4 max-w-lg mx-auto">
                  {fetcher.data && !(fetcher.data as any).success && <p role="alert" className="text-rose-200">{(fetcher.data as any).error || "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่"}</p>}
                  <input type="hidden" name="form_type" value="quiz" />
                  <input type="hidden" name="score" value={currentScore} />
                  <input type="hidden" name="result_level" value={resultInfo.level} />
                  <input type="hidden" name="answers" value={JSON.stringify(quizAnswers)} />

                  <div>
                    <label htmlFor="lead-field-1" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                      ชื่อ-นามสกุลผู้ทำแบบประเมิน *
                    </label>
                    <input id="lead-field-1"
                      type="text"
                      name="name"
                      required
                      placeholder="เช่น คุณกฤษฎา / ผู้บริหาร / HR Manager"
                      className="w-full bg-white/10 border border-white/20 focus:border-brand-pink rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="lead-field-2" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                        ชื่อองค์กร / บริษัท *
                      </label>
                      <input id="lead-field-2"
                        type="text"
                        name="company"
                        required
                        placeholder="ชื่อบริษัทหรือหน่วยงาน"
                        className="w-full bg-white/10 border border-white/20 focus:border-brand-pink rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-field-3" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                        ตำแหน่งของคุณ
                      </label>
                      <input id="lead-field-3"
                        type="text"
                        name="position"
                        placeholder="เช่น CEO, HRD, Team Lead"
                        className="w-full bg-white/10 border border-white/20 focus:border-brand-pink rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lead-field-4" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                      อีเมล หรือ LINE ID สำหรับติดต่อกลับ *
                    </label>
                    <input id="lead-field-4"
                      type="text"
                      name="email_or_line"
                      required
                      placeholder="email@company.com หรือ Line ID"
                      className="w-full bg-white/10 border border-white/20 focus:border-brand-pink rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-2 rounded-pill bg-brand-pink text-white font-display font-bold text-base hover:shadow-lg hover:shadow-brand-pink/40 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {isSubmitting ? (
                      <span>กำลังส่งข้อมูล...</span>
                    ) : (
                      <span>ให้ทีมชุ่มฉ่ำติดต่อกลับ</span>
                    )}
                  </button>
                </fetcher.Form>
              </div>
            )}


          </div>
        </section>



        {/* ========================================================
            SECTION 2: 5 LEVELS TO AUTHENTIC ORGANIZATION (DEEP DIVE)
        ======================================================== */}
        <section id="levels" className="py-20 lg:py-28 px-6 bg-brand-white relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-purple mb-2 block font-display">
                5 LEVELS OF GROWTH
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-black tracking-tight mb-4 font-sans">
                5 ระดับ สู่ “องค์กรตัวจริง”
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                จากเข้าใจตัวเอง สื่อสารเป็น สร้างทีมเป็น นำคนเป็น จนกลายเป็นวัฒนธรรมองค์กรที่มั่นคง
              </p>
            </div>

            {/* 5 Levels Cards */}
            <div className="level-grid">
              {AUTHENTIC_LEVELS.map((lvl) => {
                const IconComponent = lvl.icon;
                return (
                  <div 
                    key={lvl.code}
                    className="level-card p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 transition-all duration-300 flex flex-col gap-6 items-start relative overflow-hidden group"
                  >
                    {/* Left Step Indicator */}
                    <div className="shrink-0 flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-display group-hover:text-brand-purple transition-colors">
                        {lvl.levelNumber}
                      </span>
                      <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${lvl.color} text-white shadow-md`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border font-display ${lvl.badge}`}>
                          {lvl.code}
                        </span>
                        <span className="text-xs text-slate-500 font-medium font-display">
                          {lvl.title}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-display">
                        {lvl.title}
                      </h3>

                      <p className="text-sm text-slate-700 leading-relaxed mb-4">
                        {lvl.summary}
                      </p>
                      <details className="level-details"><summary>แนวคิดและผลลัพธ์ที่มุ่งหวัง</summary>
                      <p className="text-sm sm:text-base font-semibold text-brand-purple mb-2">
                        {lvl.hook}
                      </p>


                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 mb-3">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 italic">
                          {lvl.quote}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{lvl.benefit}</span>
                      </p>
                      </details>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between w-full">
                        <Link
                          to={programUrl(lvl.code.toLowerCase())}
                          className="text-xs font-bold text-brand-purple hover:text-brand-pink flex items-center gap-1 font-display cursor-pointer transition-colors"
                        >
                          <span>ดูรายละเอียดหลักสูตร</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link to={requestUrl(lvl.code.toLowerCase())} className="text-xs font-bold text-brand-pink hover:underline">ขอ Proposal →</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 3: THE FLOW & PHILOSOPHY (CULTURE FROM REAL PEOPLE)
        ======================================================== */}
        <section className="py-20 px-6 bg-gradient-to-b from-brand-surface to-white border-y border-brand-border/60 relative">
          <div className="max-w-4xl mx-auto text-center">
            
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-2 block font-display">
              ORGANIZATIONAL TRANSFORMATION FLOW
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-black mb-6 font-sans">
              การเดินทางจาก “คน” สู่ “วัฒนธรรม”
            </h2>

            {/* Step Ladder */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-purple/15 shadow-md mb-8">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold font-display text-slate-800">
                <span className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-brand-purple border border-purple-100">PERSON</span>
                <span className="text-slate-400">↓</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-pink-50 text-brand-pink border border-pink-100">COMMUNICATION</span>
                <span className="text-slate-400">↓</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">TEAM</span>
                <span className="text-slate-400">↓</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">LEADER</span>
                <span className="text-slate-400">↓</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-brand-blue border border-blue-100">CULTURE</span>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 text-base sm:text-xl font-bold text-slate-900 leading-relaxed font-sans">
                “เพราะ Culture ที่แข็งแรง ไม่ได้ถูกสร้างจากคำประกาศขององค์กร <br className="hidden sm:inline" />
                แต่ถูกสร้างจาก <span className="text-brand-pink">“คนจริง ๆ”</span> ที่อยู่ในองค์กรทุกวัน”
              </div>
            </div>

            {/* Authentic Meaning Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow font-display block mb-2">
                OUR PROMISE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 font-display">
                องค์กรตัวจริง™
              </h3>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6">
                เราไม่ได้เข้าไปเปลี่ยนคนให้กลายเป็นคนอีกแบบหนึ่ง <br className="hidden sm:inline" />
                แต่ช่วยให้แต่ละคน <strong>ค้นพบตัวจริงที่ดีที่สุดของตัวเอง</strong> <br className="hidden sm:inline" />
                และสร้างองค์กรที่ตัวจริงเหล่านั้นสามารถ <strong>เติบโตไปด้วยกันได้</strong>
              </p>
              
              <div className="inline-block px-6 py-2 rounded-full bg-white/10 border border-white/20 text-brand-pink font-display font-bold text-sm tracking-wider uppercase">
                CHOOMCHAM BRANDING · “ตัวจริงต้องมีที่ยืน”
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 4: TRUSTED EXPERIENCE & CASE STUDIES
        ======================================================== */}
        <section id="experience" className="py-20 px-6 bg-white border-b border-brand-border/60 relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-2 block font-display">
                TRUSTED EXPERIENCE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-black mb-4 font-sans">
                ประสบการณ์ที่ได้รับความไว้วางใจ
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                ประสบการณ์ด้านการอบรม การพัฒนาคน การสื่อสาร และการสร้างแบรนด์ ให้กับองค์กรและแบรนด์ชั้นนำ
              </p>
            </div>

            {/* Selected Case Cards (Madame Fin & Gangnam Clinic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {CASE_STUDIES.map((c, i) => (
                <div 
                  key={i} 
                  className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-purple-50/40 border border-purple-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-purple bg-purple-100/80 px-3 py-1 rounded-full font-display">
                        {c.tag}
                      </span>
                      <Award className="w-5 h-5 text-amber-500 shrink-0" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">
                      {c.client}
                    </h3>

                    <div className="space-y-2 mb-6 text-xs sm:text-sm">
                      <div className="flex items-start gap-2 text-slate-500">
                        <span className="font-bold text-slate-400 shrink-0">ก่อน:</span>
                        <span>{c.before}</span>
                      </div>
                      <div className="flex items-start gap-2 text-emerald-800 font-medium bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="font-bold text-emerald-600 shrink-0">ผลลัพธ์:</span>
                        <span>{c.after}</span>
                      </div>
                    </div>
                  </div>


                </div>
              ))}
            </div>

            {/* Workshop Gallery */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-brand-purple" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
                    ภาพบรรยากาศการอบรมและการเรียนรู้จริง (Workshop Gallery)
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">คลิกเพื่อดูภาพขยาย</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {WORKSHOP_GALLERY_IMAGES.map((img, idx) => (
                  <button
                    type="button"
                    aria-label={`ดูภาพ ${img.title}`}
                    key={img.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-xs hover:shadow-md border border-slate-200 transition-all duration-300"
                  >
                    <img 
                      src={img.url} 
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-bold text-amber-300 font-display">{img.category}</span>
                      <p className="text-[10px] line-clamp-1 leading-tight">{img.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* The Core Belief Quote Box */}
            <div className="p-8 sm:p-10 rounded-3xl bg-brand-purple text-white text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none"></div>

              <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow mb-3 block font-display">
                OUR CORE BELIEF
              </span>

              <blockquote className="text-lg sm:text-2xl font-bold leading-relaxed max-w-3xl mx-auto font-sans">
                “เพราะเราเชื่อว่า องค์กรจะสื่อสารออกไปข้างนอกได้ดี <br className="hidden sm:inline" />
                เมื่อ <span className="text-brand-yellow">“คนข้างใน”</span> เข้าใจตัวเอง เข้าใจกัน <br className="hidden sm:inline" />
                และเข้าใจสิ่งที่องค์กรกำลังสร้าง”
              </blockquote>
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 5: NOT ONE-SIZE-FITS-ALL (ไม่ใช่หลักสูตรสำเร็จรูป)
        ======================================================== */}
        <section id="programs" className="py-20 lg:py-28 px-6 bg-brand-surface relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-purple mb-2 block font-display">
                TAILORED FOR YOUR ORGANIZATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-black tracking-tight mb-4 font-sans">
                ไม่ใช่หลักสูตรสำเร็จรูป
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                เพราะแต่ละองค์กรมี “คน” และ “โจทย์” ไม่เหมือนกัน ทีมชุ่มฉ่ำจะร่วมทำความเข้าใจบริบทจริงก่อนออกแบบ Learning Journey
              </p>
            </div>

            {/* Assessment Steps Before Program Design */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white mb-14 shadow-xl">
              <h3 className="text-base sm:text-lg font-bold text-amber-300 mb-4 font-display flex items-center gap-2">
                <Target className="w-5 h-5" />
                ก่อนเริ่มโปรแกรม ทีมชุ่มฉ่ำจะร่วมทำความเข้าใจ 5 มิติหลัก:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs sm:text-sm">
                {[
                  { title: "ปัญหาที่กำลังเจอ", desc: "Pain Points แท้จริงที่ซ่อนอยู่" },
                  { title: "เป้าหมายผู้บริหาร", desc: "ทิศทางและสิ่งที่คาดหวังจากธุรกิจ" },
                  { title: "กลุ่มผู้เข้าอบรม", desc: "ระดับ ความพร้อม และ Mindset" },
                  { title: "วัฒนธรรมองค์กร", desc: "บริบทและวิถีการทำงานเดิม" },
                  { title: "ผลลัพธ์ที่ต้องการ", desc: "พฤติกรรมใหม่ที่อยากเห็นจริง" }
                ].map((step, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/10">
                    <span className="text-brand-pink font-bold block mb-1 font-display">0{i+1}</span>
                    <h4 className="font-bold text-white mb-1">{step.title}</h4>
                    <p className="text-slate-400 text-xs">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FLAGSHIP COURSE: FROM ZOMBIE TO LIVING ORGANIZATION */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-brand-pink text-xs font-bold uppercase tracking-wider mb-2 font-display">
                  <span>🧟 ➔ ✨</span>
                  <span>FLAGSHIP TRANSFORMATION PROGRAM</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                  From Zombie to Living Organization
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
                  หลักสูตรเรือธงในการชุบชีวิตคน ทีม และองค์กร เปลี่ยนภาวะหมดไฟเฉื่อยชา สู่องค์กรตัวจริงที่มีพลังสร้างสรรค์
                </p>
                <div className="program-actions justify-center mt-5"><Link className="program-button" to="/programs/from-zombie-to-living-organization">ดูหลักสูตรเรือธง</Link><Link className="program-button secondary" to={requestUrl("from-zombie-to-living-organization")}>ขอ Proposal โปรแกรมเต็ม</Link></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    moduleNumber: "MODULE 01",
                    title: "REBORN PEOPLE",
                    thaiTitle: "ปลุกคนหมดไฟ & ซอมบี้ในที่ทำงาน",
                    target: "เหมาะสำหรับพนักงานและทีมงานทุกระดับที่เริ่มหมดพลัง",
                    desc: "ค้นหาคุณค่า จุดแข็ง และเป้าหมายการทำงานใหม่ เปลี่ยนจากทำงานตามสั่งแบบหุ่นยนต์ สู่ความรู้สึกเป็นเจ้าของงาน (Ownership) และมีไฟในการสร้างผลงาน",
                    outcomes: ["ฟื้นฟู Passion และความสุขในการทำงาน", "เข้าใจ Brand DNA & Core Values ของตนเอง", "เปลี่ยน Mindset จากเหยื่อสู่ผู้ขับเคลื่อนเชิงรุก"],
                    badge: "bg-pink-50 text-pink-700 border-pink-200",
                    accent: "from-pink-500 to-rose-600"
                  },
                  {
                    moduleNumber: "MODULE 02",
                    title: "ALIVE TEAM",
                    thaiTitle: "ทลายกำแพง Silo สู่ทีมที่มีชีวิต",
                    target: "เหมาะสำหรับทีมที่เริ่มเงียบ สื่อสารยาก หรือต่างคนต่างทำ",
                    desc: "สร้าง Psychological Safety คืนความไว้ใจ (Trust) และปลดล็อกการสื่อสาร ให้ห้องประชุมกลับมามีชีวิต กล้าแลกเปลี่ยนไอเดียใหม่ และผนึกกำลังสู่เป้าหมายร่วม",
                    outcomes: ["ทลายกำแพงแผนก (Cross-Functional Trust)", "การสื่อสารและ Feedback เชิงสร้างสรรค์", "ความร่วมมือที่มุ่งเน้นผลลัพธ์ขององค์กร"],
                    badge: "bg-purple-50 text-purple-700 border-purple-200",
                    accent: "from-brand-purple to-indigo-600"
                  },
                  {
                    moduleNumber: "MODULE 03",
                    title: "REBORN LEADER",
                    thaiTitle: "ผู้นำตัวจริงที่ไม่ต้องแบกงานคนเดียว",
                    target: "เหมาะสำหรับหัวหน้างาน, Team Lead, Manager และผู้บริหารรุ่นใหม่",
                    desc: "เปลี่ยนจากหัวหน้าแบบไมโครแมนเนจ หรือนักดับเพลิงที่เหนื่อยล้า สู่ผู้นำแบบ Coach ที่สร้างแรงบันดาลใจ ฟังเป็น มอบหมายงานเป็น และดึงศักยภาพทีมออกมาเต็มร้อย",
                    outcomes: ["ทักษะ Active Listening & Powerful Questioning", "การโค้ชและบริหารพลังงานคนในทีม", "การนำคนโดยไม่ต้องใช้แค่อำนาจตำแหน่ง"],
                    badge: "bg-amber-50 text-amber-800 border-amber-200",
                    accent: "from-brand-yellow to-amber-600"
                  },
                  {
                    moduleNumber: "MODULE 04",
                    title: "LIVING CULTURE",
                    thaiTitle: "วัฒนธรรมองค์กรตัวจริงที่ยั่งยืน",
                    target: "เหมาะสำหรับองค์กรที่ต้องการให้ Core Values เกิดขึ้นจริงในทุกวัน",
                    desc: "เปลี่ยนค่านิยมบนผนังให้กลายเป็นวิธีคิดและพฤติกรรมจริงของพนักงาน สร้างพื้นที่ที่ 'ตัวจริงทุกคนมีที่ยืน' และหล่อเลี้ยงนวัตกรรมการเติบโตระยะยาว",
                    outcomes: ["ฝัง Core Values สู่การทำงานประจำวัน", "วัฒนธรรมการชื่นชมและการเติบโตร่วมกัน", "องค์กรมีพลังดึงดูดและรักษาคนเก่งตัวจริง"],
                    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
                    accent: "from-brand-green to-teal-700"
                  }
                ].map((course, cIdx) => (
                  <div 
                    key={cIdx} 
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${course.badge} font-display`}>
                          {course.moduleNumber} · {course.title}
                        </span>
                        <span className="text-xl">✨</span>
                      </div>

                      <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1 font-sans">
                        {course.thaiTitle}
                      </h4>
                      <p className="text-xs font-semibold text-brand-purple mb-4">
                        🎯 {course.target}
                      </p>
                      
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        {course.desc}
                      </p>

                      <div className="space-y-2 mb-6">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-display">
                          สิ่งที่จะได้รับจากหลักสูตร:
                        </span>
                        {course.outcomes.map((out, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-brand-green shrink-0" />
                            <span>{out}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a 
                        href="#zombie-check" 
                        className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1 font-display"
                      >
                        <span>ทำแบบประเมิน Zombie Check</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        to={requestUrl(["reborn", "team", "leader", "culture"][cIdx])}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-purple text-white text-xs font-bold transition-colors font-display cursor-pointer"
                      >
                        ขอ Proposal หลักสูตรนี้
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formats Grid */}
            <div className="mb-10">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 font-display text-center">
                รูปแบบที่สามารถออกแบบและจัดอบรมได้
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROGRAM_FORMATS.map((fmt) => {
                  const IconComp = fmt.icon;
                  return (
                    <div 
                      key={fmt.id} 
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-brand-purple/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-purple-100 px-2 py-0.5 rounded-md font-display">
                            {fmt.tag}
                          </span>
                          <IconComp className="w-5 h-5 text-brand-pink" />
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-display">
                          {fmt.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {fmt.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center p-4 rounded-2xl bg-purple-50 border border-purple-100 text-xs sm:text-sm text-brand-purple font-medium max-w-xl mx-auto">
              💡 สามารถเลือกอบรมเฉพาะหัวข้อที่ตรงโจทย์ หรือออกแบบเป็น Development Journey ต่อเนื่องได้
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 6: WHO IS IT FOR & EXPECTED OUTCOMES
        ======================================================== */}
        <section className="py-20 px-6 bg-white border-y border-brand-border/60 relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-2 block font-display">
                TARGET & IMPACT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight mb-4 font-sans">
                เหมาะกับองค์กรที่...
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                หากองค์กรของคุณกำลังเผชิญโจทย์เหล่านี้ เราพร้อมช่วยออกแบบทางออกที่ตอบโจทย์
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-4xl mx-auto mb-16">
              {TARGET_CRITERIA.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs flex items-start gap-3 hover:border-brand-purple/40 hover:bg-white transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Expected Outcomes */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-black mb-3 font-sans">
                ผลลัพธ์ที่เราอยากเห็น
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                เป้าหมายไม่ใช่แค่การอบรมที่สนุก แต่คือผลลัพธ์ที่เกิดขึ้นจริงเมื่อทุกคนกลับไปทำงาน
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {EXPECTED_OUTCOMES.map((item, i) => (
                <div 
                  key={i} 
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-brand-pink/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-brand-pink flex items-center justify-center font-bold text-xs mb-3 font-display">
                    0{i+1}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 font-display">
                    {item.text}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Signature Quote */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-purple to-indigo-800 text-white text-center shadow-xl max-w-3xl mx-auto">
              <p className="text-base sm:text-xl font-bold leading-relaxed font-sans">
                “เพราะการอบรมที่ดี ไม่ควรจบเมื่อเดินออกจากห้องอบรม <br className="hidden sm:inline" />
                แต่ควรเริ่มเห็นผลเมื่อทุกคนกลับไปทำงานจริง”
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 7: FAQ (คำถามที่พบบ่อย)
        ======================================================== */}
        <section id="faq" className="py-20 lg:py-28 px-6 bg-slate-50 border-b border-brand-border/60 relative">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-purple-100 text-brand-purple text-xs font-bold uppercase tracking-widest mb-3 font-display">
                <HelpCircle className="w-4 h-4 text-brand-pink" />
                FREQUENTLY ASKED QUESTIONS
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-black tracking-tight mb-3 font-sans">
                คำถามที่พบบ่อย (FAQ)
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                รวมข้อสงสัยที่ HR และผู้บริหารสอบถามเข้ามาบ่อยที่สุดเกี่ยวกับหลักสูตร “องค์กรตัวจริง™”
              </p>
            </div>

            {/* Accordion FAQ List */}
            <div className="space-y-3.5">
              {FAQ_ITEMS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "bg-white border-brand-purple/40 shadow-md" : "bg-white/80 border-slate-200 hover:border-slate-300"}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${faq.id}`}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-brand-pink px-2 py-0.5 rounded-md bg-pink-50 border border-pink-100 shrink-0 font-display mt-0.5">
                          Q{faq.id < 10 ? `0${faq.id}` : faq.id}
                        </span>
                        <div>
                          <span className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-display block">
                            {faq.question}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium font-display">
                            หมวดหมู่: {faq.category}
                          </span>
                        </div>
                      </div>

                      <div className={`p-1.5 rounded-xl transition-transform duration-200 shrink-0 ${isOpen ? "bg-purple-100 text-brand-purple rotate-180" : "bg-slate-100 text-slate-500"}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div id={`faq-panel-${faq.id}`} className="px-5 sm:px-6 pb-6 pt-1 text-sm text-slate-700 border-t border-slate-100 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50/50 animate-in fade-in duration-200">
                        <div className="font-sans text-slate-700">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom FAQ Consultation Banner */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-purple to-indigo-900 text-white text-center shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-2 font-display">
                ยังมีคำถามอื่น ๆ หรืออยากให้ทีมช่วยวิเคราะห์โจทย์เฉพาะขององค์กร?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto mb-6">
                ทักมาคุยกับ “น้องฉ่ำ” และทีม Choomcham Branding ได้เลยค่ะ เราพร้อมให้คำปรึกษาอย่างเป็นกันเองและตรงจุด
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-brand-pink text-white font-display font-bold text-sm hover:shadow-lg hover:shadow-brand-pink/40 hover:scale-102 transition-all"
              >
                <span>พูดคุยกับทีมชุ่มฉ่ำ</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 8: ABOUT CHOOMCHAM BRANDING
        ======================================================== */}
        <section id="about" className="py-20 px-6 bg-brand-surface border-b border-brand-border/60 relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              
              <div className="md:col-span-5 text-center md:text-left flex flex-col items-center md:items-start">
                <img 
                  src="/chumcham.png" 
                  alt="Choomcham Branding" 
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-contain bg-white p-3 shadow-xl border border-brand-purple/20 mb-6 group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="text-xs font-bold uppercase tracking-widest text-brand-pink font-display">
                  ABOUT US
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-black mt-1 mb-2 font-display">
                  Choomcham Branding
                </h2>
                <p className="text-sm font-semibold text-brand-purple font-display">
                  Branding · Storytelling · Communication · Brand DNA
                </p>
              </div>

              <div className="md:col-span-7 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  <strong>Choomcham Branding</strong> คือผู้เชี่ยวชาญด้าน Branding, Storytelling, Communication และการค้นหา Brand DNA จากประสบการณ์กว่า 10 ปี ในการทำงานร่วมกับคน แบรนด์ และการสื่อสารระดับประเทศ
                </p>
                
                <div className="p-5 rounded-2xl bg-white border border-brand-purple/15 shadow-xs">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-display">
                    ภายใต้ความเชื่อเดียวกันว่า:
                  </p>
                  <blockquote className="text-base sm:text-lg font-bold text-brand-purple italic">
                    “ของดีที่ไม่มีใครมองเห็น อาจไม่ได้แปลว่ามันไม่ดี <br />
                    แต่อาจยังไม่มีพื้นที่ ให้คุณค่าของมันถูกมองเห็น”
                  </blockquote>
                </div>

                <p className="font-semibold text-slate-900">
                  จึงเป็นที่มาของแนวคิด <span className="text-brand-pink font-bold">“ตัวจริงต้องมีที่ยืน”</span> ที่นำมาสู่การออกแบบหลักสูตรพัฒนาคนและองค์กรอย่างแท้จริง
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 10: FINAL CLOSING CALL TO ACTION & FORM
        ======================================================== */}
        <section id="contact" className="py-20 lg:py-28 px-6 bg-gradient-to-b from-brand-surface via-white to-purple-50/50 relative">
          <div className="max-w-5xl mx-auto">
            
            {/* The Final Provocative Question */}
            <div className="p-8 sm:p-12 rounded-3xl bg-brand-purple text-white text-center shadow-2xl mb-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 font-sans leading-snug">
                องค์กรของคุณ อาจไม่จำเป็นต้องหาคนเก่งเพิ่ม
              </h2>

              <p className="text-lg sm:text-2xl font-semibold text-amber-300 max-w-3xl mx-auto leading-relaxed mb-6 font-sans">
                แต่อาจต้องเริ่มจากคำถามว่า... <br />
                “เราได้สร้างพื้นที่ ให้คนเก่งที่มีอยู่แล้ว แสดงศักยภาพเต็มที่หรือยัง?”
              </p>

              <div className="pt-4 border-t border-white/15 max-w-xl mx-auto text-xs sm:text-sm text-white/80 font-display">
                <strong>องค์กรตัวจริง™ THE AUTHENTIC ORGANIZATION</strong> <br />
                หลักสูตรพัฒนาคน ทีม ผู้นำ และวัฒนธรรมองค์กร โดย Choomcham Branding
              </div>
            </div>

            {/* Lead Form Container */}
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
              
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-pink font-display block mb-1">
                  GET IN TOUCH
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  ปรึกษาโจทย์และรับข้อเสนอสำหรับองค์กร
                </h3>
              </div>

              {/* Inquiry Type Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 mb-8 text-xs font-bold font-display">
                <button
                  type="button"
                  onClick={() => setInquiryType("consultation")}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer ${inquiryType === "consultation" ? "bg-white text-brand-purple shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  ปรึกษาโจทย์องค์กร
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType("program")}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer ${inquiryType === "program" ? "bg-white text-brand-purple shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  ขอรายละเอียดหลักสูตร
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType("proposal")}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer ${inquiryType === "proposal" ? "bg-white text-brand-purple shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  ขอใบเสนอราคา
                </button>
              </div>

              {hasSubmittedContact ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95 duration-300">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-emerald-900 mb-2 font-display">
                    ส่งข้อมูลเรียบร้อยแล้ว
                  </h4>
                  <p className="text-sm text-emerald-700 max-w-md mx-auto">
                    ทีมชุ่มฉ่ำได้รับโจทย์ของคุณแล้ว และจะติดต่อกลับผ่านช่องทางที่แจ้งไว้
                  </p>
                </div>
              ) : (
                <fetcher.Form method="post" className="space-y-4">
                  {fetcher.data && !(fetcher.data as any).success && (fetcher.data as any).formType === "contact" && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{(fetcher.data as any).error || "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่"}</p>}
                  <input type="hidden" name="form_type" value="contact" />
                  <input 
                    type="hidden" 
                    name="result_level" 
                    value={inquiryType === "proposal" ? "PROPOSAL_REQUEST" : inquiryType === "program" ? "PROGRAM_INQUIRY" : "CONSULTATION"} 
                  />

                  {selectedProgram && (
                    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider font-display">
                          {inquiryType === "proposal" ? "ขอ Proposal" : "หลักสูตรที่สนใจ"}
                        </span>
                        <span className="text-slate-600 font-medium">หัวข้อ:</span>
                        <span className="font-bold text-purple-950 line-clamp-1">{selectedProgram}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedProgram("")}
                        className="text-[11px] text-brand-purple hover:text-brand-pink font-bold shrink-0 cursor-pointer underline"
                      >
                        ล้าง / เลือกใหม่
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lead-field-5" className="block text-xs font-bold text-slate-700 mb-1 font-display">
                        ชื่อผู้ติดต่อ *
                      </label>
                      <input id="lead-field-5"
                        type="text" 
                        name="name" 
                        required 
                        placeholder="ชื่อ-นามสกุล"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-xl px-4 py-3 text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-field-6" className="block text-xs font-bold text-slate-700 mb-1 font-display">
                        ชื่อองค์กร / บริษัท *
                      </label>
                      <input id="lead-field-6"
                        type="text" 
                        name="company" 
                        required 
                        placeholder="ชื่อบริษัทของคุณ"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-xl px-4 py-3 text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lead-field-7" className="block text-xs font-bold text-slate-700 mb-1 font-display">
                        ตำแหน่งในองค์กร
                      </label>
                      <input id="lead-field-7"
                        type="text" 
                        name="position" 
                        placeholder="เช่น ผู้บริหาร, HR Manager, Team Lead"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-xl px-4 py-3 text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-field-8" className="block text-xs font-bold text-slate-700 mb-1 font-display">
                        เบอร์โทรศัพท์ / LINE ID / Email *
                      </label>
                      <input id="lead-field-8"
                        type="text" 
                        name="email_or_line" 
                        required 
                        placeholder="ช่องทางติดต่อกลับที่สะดวก"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-xl px-4 py-3 text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lead-field-9" className="block text-xs font-bold text-slate-700 mb-1 font-display">
                        หลักสูตร / รูปแบบที่สนใจ {inquiryType === "proposal" && <span className="text-brand-pink">*</span>}
                      </label>
                      <select 
                        id="lead-field-9"
                        name="program_interest"
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-xl px-4 py-3 text-slate-900 text-sm outline-none transition-colors"
                      >
                        <option value="">-- เลือกหลักสูตร / รูปแบบที่ต้องการ --</option>
                        {PROGRAM_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="lead-field-10" className="block text-xs font-bold text-slate-700 mb-1 font-display">
                        กรอบเวลาที่วางแผนจัดอบรม
                      </label>
                      <select id="lead-field-10"
                        name="timeline"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-xl px-4 py-3 text-slate-900 text-sm outline-none transition-colors"
                      >
                        <option value="ด่วนที่สุดใน 1 เดือน">ด่วนที่สุดใน 1 เดือน</option>
                        <option value="ภายใน 2-3 เดือน">ภายใน 2-3 เดือน</option>
                        <option value="วางแผนล่วงหน้า / ขอใบเสนอราคา">วางแผนล่วงหน้า / จัดสรรงบประมาณ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lead-field-11" className="block text-xs font-bold text-slate-700 mb-1 font-display">
                      รายละเอียดโจทย์หรือเป้าหมายที่ต้องการให้เราช่วยออกแบบ
                    </label>
                    <textarea id="lead-field-11"
                      name="details" 
                      rows={3}
                      placeholder="เช่น มีคนเก่งแต่ต่างคนต่างทำ, ต้องการพัฒนาทักษะการนำคนให้หัวหน้าทีม, ปรับปรุง Communication ภายในทีม..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-purple focus:bg-white rounded-xl px-4 py-3 text-slate-900 text-sm outline-none resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-2 rounded-pill bg-brand-pink text-white font-display font-bold text-base shadow-lg shadow-brand-pink/25 hover:shadow-brand-pink/40 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {isSubmitting ? (
                      <span>กำลังส่งข้อมูล...</span>
                    ) : (
                      <span>
                        {inquiryType === "proposal" ? "ขอใบเสนอราคา & ออกแบบหลักสูตร" : inquiryType === "program" ? "ขอรายละเอียดหลักสูตรสำหรับองค์กร" : "นัดปรึกษาโจทย์องค์กรกับทีมงาน"}
                      </span>
                    )}
                  </button>
                </fetcher.Form>
              )}

            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-brand-black text-slate-400 py-16 px-6 relative z-10 text-xs sm:text-sm border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          
          <div className="flex items-center gap-4">
            <img 
              src="/chumcham.png" 
              alt="Choomcham Branding" 
              className="w-12 h-12 rounded-2xl bg-white p-1.5 object-contain shadow-md" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg text-white block">
                  บ้านชุ่มฉ่ำ
                </span>
                <span className="font-display font-bold text-xs text-brand-pink tracking-wider">
                  CHOOMCHAM HOUSE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                องค์กรตัวจริง™ · “ตัวจริงต้องมีที่ยืน”
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-display">
            <a href="#authentic-org" className="hover:text-white transition-colors">องค์กรตัวจริง™</a>
            <a href="#levels" className="hover:text-white transition-colors">5 ระดับการเติบโต</a>
            <a href="#programs" className="hover:text-white transition-colors">หลักสูตร</a>
            <a href="#zombie-check" className="hover:text-brand-pink transition-colors font-bold">🧟 Zombie Check™</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-white transition-colors font-bold text-brand-pink">ติดต่อเรา</a>
          </div>

          <div className="text-center md:text-right text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Choomcham Branding. All rights reserved.</p>
            <p className="mt-1 opacity-70">The Authentic Organization Framework · “ตัวจริงต้องมีที่ยืน”</p>
          </div>

        </div>
      </footer>

      {/* Gallery Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <img 
              src={WORKSHOP_GALLERY_IMAGES[lightboxIndex].url} 
              alt={WORKSHOP_GALLERY_IMAGES[lightboxIndex].title}
              className="w-full max-h-[70vh] object-contain bg-black/40" 
            />

            <div className="p-6 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-pink uppercase tracking-widest font-display block mb-1">
                  {WORKSHOP_GALLERY_IMAGES[lightboxIndex].category}
                </span>
                <h4 className="text-base sm:text-lg font-bold">
                  {WORKSHOP_GALLERY_IMAGES[lightboxIndex].title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : WORKSHOP_GALLERY_IMAGES.length - 1))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev < WORKSHOP_GALLERY_IMAGES.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
