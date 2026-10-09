import React from "react";
import { useParams, Link } from "react-router";
import type { Route } from "./+types/topic";
import { ArrowLeft, ArrowRight, Zap, CheckCircle2, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { JsonLd } from "~/components/JsonLd";

interface TopicData {
  title: string;
  badge: string;
  hook: string;
  problem: string;
  solution: string;
  remedySteps: string[];
}

const TOPICS_DICT: Record<string, TopicData> = {
  "zombie-organization": {
    badge: "Organizational Health Diagnostic",
    title: "Zombie Organization คืออะไร? สัญญาณเตือนและวิธีชุบชีวิตองค์กรก่อนสายเกินแก้",
    hook: "คนยังมาทำงานครบ งานยังเดิน แต่จิตวิญญาณและพลังในการสร้างสิ่งใหม่กำลังหายไป",
    problem: "เมื่อความเครียดสะสม การเมืองภายใน และการทำงานแบบหุ่นยนต์เข้ามาแทนที่ความสุข คนในองค์กรจะเริ่มเข้าสู่ภาวะ Zombie — เฉื่อยชา ไร้ความคิดริเริ่ม และลาออกทางจิตใจ (Quiet Quitting)",
    solution: "Choomcham House ใช้กระบวนการ Choomcham Rebirth™ ปลุกพลังคนและทีมจากระดับจิตสำนึก เพื่อคืนชีวิตและความชุ่มฉ่ำให้องค์กร",
    remedySteps: [
      "ตรวจวัดระดับสุขภาพองค์กรด้วย Zombie Organization Index™",
      "Reset ความคิดและทลายความกลัวภายในของทีมงาน",
      "Reconnect ความสัมพันธ์เพื่อสร้างพื้นที่ปลอดภัย (Psychological Safety)",
      "Recreate รูปแบบการทำงานที่มีความหมายและพลังร่วมกัน"
    ]
  },
  "team-transformation": {
    badge: "Team & Culture Transformation",
    title: "เปลี่ยนทีมที่ต่างคนต่างทำ (Silo) ให้กลายเป็น ALIVE TEAM ที่มีพลังและผูกพันกันจริง",
    hook: "ทีมไม่ได้มีปัญหาเรื่องทักษะ แต่มีปัญหาเรื่อง Connection และความไว้ใจ",
    problem: "การโยนงานข้ามแผนก ความขัดแย้งที่ไม่ได้รับการคลี่คลาย และการขาดเป้าหมายร่วม ทำให้ทีมสูญเสียพลังไปกับการป้องกันตัวเองมากกว่าการสร้างผลงาน",
    solution: "โปรแกรม ALIVE TEAM เน้นการสร้าง Deep Human Connection ให้ทุกคนเห็นอกเห็นใจ ไว้ใจ และร่วมมือกันขับเคลื่อนเป้าหมาย",
    remedySteps: [
      "สลายกำแพง Silo ด้วยการสื่อสารที่ตรงไปตรงมาและปลอดภัย",
      "สร้างความไว้ใจระดับลึกซึ้ง (Vulnerable Trust)",
      "กำหนดกติกาใจร่วมกันของทีมในการทำงานและการแก้ไขปัญหา",
      "ฝึกฝนการให้ Feedback ที่สร้างสรรค์และไม่ทำลายความรู้สึก"
    ]
  },
  "leadership-transformation": {
    badge: "Executive & Leader Rebirth",
    title: "เปลี่ยนผู้นำจากข้างใน: จาก Leader ผู้แบกทุกอย่าง สู่ผู้นำที่จุดประกายชีวิตให้ทีม",
    hook: "ก่อนจะ Transform องค์กร ผู้นำต้องได้รับการ Rebirth จากข้างในก่อน",
    problem: "ผู้นำส่วนใหญ่กำลังหมดไฟจากการแบกรับแรงกดดัน การควบคุมทุกรายละเอียด (Micromanagement) จนไม่มีเวลาสำหรับการคิดเชิงกลยุทธ์",
    solution: "โปรแกรม REBORN LEADER ช่วยให้ผู้นำตระหนักรู้ตนเอง ค้นพบสไตล์การนำที่มีสติและเหตุผล (The Inner Logic) และปลดล็อกศักยภาพคนรอบข้าง",
    remedySteps: [
      "Inner Awareness: เข้าใจอารมณ์และจุดบอดของตนเองในการนำทีม",
      "Shift Mindset จาก Controller สู่ Coach & Catalyst",
      "สร้างสภาพแวดล้อมที่ส่งเสริม Ownership ของพนักงาน",
      "เป็นแบบอย่างของความจริงใจและการเรียนรู้อย่างต่อเนื่อง"
    ]
  }
};

export function meta({ params }: Route.MetaArgs) {
  const slug = params?.slug || "zombie-organization";
  const topic = TOPICS_DICT[slug] || TOPICS_DICT["zombie-organization"];

  return [
    { title: `${topic.title} | บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE` },
    { name: "description", content: topic.hook },
    { name: "keywords", content: "Zombie Organization, Team Transformation, Leadership Rebirth, บ้านชุ่มฉ่ำ, พัฒนาองค์กร" },
    { property: "og:title", content: topic.title },
    { property: "og:description", content: topic.hook },
    { property: "og:type", content: "article" },
    { property: "og:url", content: `https://choomcham.pages.dev/topics/${slug}` },
    { property: "og:image", content: "/chumcham.png" },
  ];
}

export default function TopicPage() {
  const { slug } = useParams();
  const currentSlug = slug || "zombie-organization";
  const topic = TOPICS_DICT[currentSlug] || TOPICS_DICT["zombie-organization"];

  const topicSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": topic.title,
        "description": topic.hook,
        "image": "https://choomcham.pages.dev/chumcham.png",
        "author": {
          "@type": "Organization",
          "name": "บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE",
          "url": "https://choomcham.pages.dev"
        },
        "publisher": {
          "@type": "Organization",
          "name": "บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE",
          "logo": {
            "@type": "ImageObject",
            "url": "https://choomcham.pages.dev/chumcham.png"
          }
        },
        "mainEntityOfPage": `https://choomcham.pages.dev/topics/${currentSlug}`
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "หน้าหลัก",
            "item": "https://choomcham.pages.dev"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Topics & Insight",
            "item": `https://choomcham.pages.dev/topics/${currentSlug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F4F2F5] text-[#111111] font-sans antialiased">
      <JsonLd data={topicSchema} />

      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-purple-950 hover:text-pink-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าหลัก Choomcham House</span>
          </Link>
          <Link
            to="/#zombie-check"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>ทำแบบประเมินองค์กร</span>
          </Link>
        </div>
      </header>

      {/* Article Content Header */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>{topic.badge}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4044A5] leading-tight mb-6">
          {topic.title}
        </h1>

        <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed mb-8 border-l-4 border-pink-500 pl-4 py-1">
          {topic.hook}
        </p>

        {/* Deep Dive Section */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm space-y-8 mb-12">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-rose-500 font-extrabold">01.</span> ปัญหาที่แท้จริงที่ซ่อนอยู่
            </h2>
            <p className="text-slate-600 leading-relaxed">{topic.problem}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-purple-600 font-extrabold">02.</span> แนวทางการแก้ปัญหาจากข้างใน (Inner Transformation)
            </h2>
            <p className="text-slate-600 leading-relaxed">{topic.solution}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-emerald-600 font-extrabold">03.</span> 4 ขั้นตอนสำคัญสู่การเปลี่ยนแปลง
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topic.remedySteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-purple-950">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner to Diagnostic */}
        <div className="bg-gradient-to-br from-[#4044A5] to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden text-center">
          <div className="relative z-10 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">องค์กรของคุณกำลังอยู่ในสภาวะไหน?</h3>
            <p className="text-purple-200 text-sm mb-6 leading-relaxed">
              ใช้เวลาเพียง 2 นาที ทำแบบประเมิน Zombie Organization Index™ เพื่อรับรายงานวิเคราะห์ 7 มิติสุขภาพองค์กรทันที
            </p>
            <Link
              to="/#zombie-check"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold rounded-full shadow-lg shadow-pink-600/30 active:scale-95 transition-all text-sm"
            >
              <span>เริ่มทำแบบประเมินฟรี</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
