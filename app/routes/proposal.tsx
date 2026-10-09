import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { getProgram } from "~/lib/programs";
import { ProgramLayout } from "~/components/layout/ProgramLayout";
import { ProgramOutline } from "~/components/features/programs/ProgramOutline";
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Printer, 
  Share2, 
  Mail, 
  Phone, 
  ArrowLeft,
  Flame,
  Users,
  ShieldCheck,
  Award,
  Layers,
  FileText
} from "lucide-react";

export function meta() {
  return [
    { title: "Transformation Proposal & Quotation | บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE" },
    { name: "description", content: "เอกสารนำเสนอโครงการและใบเสนอราคาการพัฒนาบุคลากรและองค์กรโดยบ้านชุ่มฉ่ำ" },
    { name: "robots", content: "noindex, nofollow" }
  ];
}

interface ProposalItem {
  name: string;
  description: string;
  quantity: string;
  unitPrice: number;
  total: number;
}

export default function ProposalView() {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  // Dynamic query parameters or fallbacks
  const company = searchParams.get("company") || "องค์กรพันธมิตร";
  const contactName = searchParams.get("name") || "ท่านผู้บริหาร / ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)";
  const position = searchParams.get("position") || "Executive Director / HR Leader";
  const programName = searchParams.get("program") || "REBORN PEOPLE & ALIVE TEAM (2 Days Custom Workshop)";
  const teamSize = searchParams.get("teamSize") || "30 - 45 ท่าน";
  const investment = parseInt(searchParams.get("price") || "185000", 10);
  const proposalId = searchParams.get("id") || `CCH-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const subtotal = investment;
  const vat = Math.round(subtotal * 0.07);
  const grandTotal = subtotal + vat;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const growthProgram = getProgram(searchParams.get("programSlug"));
  if (growthProgram) return <ProgramLayout><ProgramOutline program={growthProgram} /></ProgramLayout>;
  if (searchParams.has("programSlug")) return <ProgramLayout><div className="program-container program-section"><h1>ไม่พบกรอบหลักสูตรนี้</h1><Link to="/programs">เลือกหลักสูตร</Link></div></ProgramLayout>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแรก Choomcham House</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "คัดลอกลิงก์แล้ว!" : "คัดลอกลิงก์แชร์"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์ / บันทึกเป็น PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Paper */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-14 relative overflow-hidden print:shadow-none print:border-none print:p-0 print:rounded-none">
        
        {/* Header Ribbon / Verification */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-200 gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/chumcham.png" 
              alt="บ้านชุ่มฉ่ำ Logo" 
              className="w-16 h-16 rounded-2xl p-1.5 bg-white border border-purple-200 shadow-xs object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-purple-900 tracking-tight">บ้านชุ่มฉ่ำ</span>
                <span className="text-xs font-bold text-pink-600 tracking-wider uppercase">CHOOMCHAM HOUSE</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Organizational Rebirth & Culture Transformation Partner
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200 mb-1">
              OFFICIAL PROPOSAL & QUOTATION
            </span>
            <div className="text-xs text-slate-500">เลขที่เอกสาร: <span className="font-mono font-bold text-slate-800">{proposalId}</span></div>
            <div className="text-xs text-slate-500">วันที่ออกเอกสาร: <span className="text-slate-800">{new Date().toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
          </div>
        </div>

        {/* Client & Executive Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              เรียน (ATTENTION TO)
            </span>
            <h3 className="text-base font-bold text-slate-900">{contactName}</h3>
            <p className="text-xs text-slate-600">{position}</p>
            <p className="text-xs font-bold text-purple-700 mt-1">{company}</p>
          </div>
          <div className="md:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              จัดทำโดย (PROPOSED BY)
            </span>
            <h3 className="text-base font-bold text-slate-900">ทีมออกแบบประสบการณ์ บ้านชุ่มฉ่ำ</h3>
            <p className="text-xs text-slate-600">Master Facilitators & Organizational Transformation Coaches</p>
            <p className="text-xs text-slate-500 mt-1">อีเมล: leaderskillmasterclass@gmail.com | LINE: @choomcham</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <span>1. วัตถุประสงค์และกรอบแนวคิดโครงการ (Core Objectives)</span>
          </h2>
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 text-sm text-slate-700 leading-relaxed space-y-2">
            <p className="font-medium text-purple-950">
              “องค์กรไม่ได้ต้องการแค่การอบรมอีกหนึ่งครั้ง... แต่ต้องการพาคนกลับมารู้สึกตัว เชื่อมใจ และเกิดใหม่จากข้างใน”
            </p>
            <p className="text-xs text-slate-600">
              โครงการนี้ถูกออกแบบเฉพาะสำหรับ <strong>{company}</strong> เพื่อสลายความเฉื่อยชา ฟื้นฟูพลังในการทำงาน (Energy Management) ทลายกำแพง Silo และสร้างพื้นที่ปลอดภัยทางจิตวิทยา (Psychological Safety) ที่ทุกคนกล้าออกความคิดเห็นและร่วมสร้างสรรค์เพื่อเป้าหมายร่วมกัน
            </p>
          </div>
        </div>

        {/* 5-Stage Roadmap */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <span>2. แผนการส่งมอบกระบวนการ 5 ขั้นตอน (5-Stage Rebirth Model)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { num: "01", stage: "RESET", title: "หยุดวงจรเดิม", desc: "ส่องกระจกสะท้อนสภาวะจริง ปลดล็อกความเฉยชา" },
              { num: "02", stage: "RECONNECT", title: "กลับมาเชื่อมกัน", desc: "ทลาย Silo สร้าง Psychological Safety" },
              { num: "03", stage: "RECHARGE", title: "เติมพลังชีวิต", desc: "จุดประกายไฟในการทำงานและเป้าหมายใหม่" },
              { num: "04", stage: "REIMAGINE", title: "มองมุมใหม่", desc: "ปลดล็อกไอเดียสร้างสรรค์และนวัตกรรม" },
              { num: "05", stage: "RECREATE", title: "ลงมือสร้างใหม่", desc: "วางกติกาใจและวิธีทำงานร่วมกันจริง" },
            ].map((step) => (
              <div key={step.num} className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md inline-block mb-2">
                  {step.num} • {step.stage}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-[11px] text-slate-500 leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quotation & Scope Table */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>3. รายละเอียดหลักสูตรและตารางการลงทุน (Investment Scope)</span>
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">รายการบริการและกิจกรรม (Description)</th>
                  <th className="py-3 px-4 text-center">กลุ่มเป้าหมาย</th>
                  <th className="py-3 px-4 text-right">มูลค่า (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-purple-900 block text-sm mb-0.5">{programName}</span>
                    <span className="text-slate-500">
                      กระบวนการ Experiential Workshop + Deep Facilitation + Interactive Dialogue
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium">{teamSize}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ฿{investment.toLocaleString("th-TH")}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold block mb-0.5">Pre-Workshop Zombie Index™ Diagnostic Assessment</span>
                    <span className="text-slate-500">ระบบประเมินสุขภาพองค์กร 7 มิติรายบุคคลก่อนเริ่มกิจกรรม</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">รวมในแพ็กเกจ</td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 font-semibold">Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold block mb-0.5">Post-Workshop Reflection & Executive Debriefing Report</span>
                    <span className="text-slate-500">รายงานสรุปข้อค้นพบ สภาวะของทีม และข้อเสนอแนะในการต่อยอดวัฒนธรรม</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">1 ชุดสำหรับผู้บริหาร</td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 font-semibold">Included</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-semibold text-xs border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="py-2.5 px-4 text-right text-slate-500">รวมมูลค่าบริการ (Subtotal):</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">฿{subtotal.toLocaleString("th-TH")}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-2.5 px-4 text-right text-slate-500">ภาษีมูลค่าเพิ่ม (VAT 7%):</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">฿{vat.toLocaleString("th-TH")}</td>
                </tr>
                <tr className="bg-purple-100/70 text-purple-950 font-bold text-sm">
                  <td colSpan={2} className="py-3 px-4 text-right">ยอดรวมสุทธิ (Grand Total):</td>
                  <td className="py-3 px-4 text-right text-purple-900 text-base">฿{grandTotal.toLocaleString("th-TH")}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Expected Outcomes */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>4. ผลลัพธ์ที่องค์กรจะได้รับ (Expected Key Deliverables)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>คนในทีมตระหนักรู้และฟื้นฟูพลังในการทำงาน (Mindset Shift & Energy Reborn)</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>สร้างความปลอดภัยทางจิตวิทยา (Psychological Safety) กล้าพูด กล้าแชร์ไอเดีย</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>ลดความขัดแย้งเชิง Silo สื่อสารด้วย Empathy และร่วมมือกันในแนวราบ</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>ได้ข้อตกลงกติกาใจในการทำงานจริง (Actionable Team Working Agreement)</span>
            </div>
          </div>
        </div>

        {/* Signature & Confirmation Section */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <p className="font-bold text-slate-800 mb-6">ผู้มีอำนาจลงนาม / ตัวแทนองค์กรผู้ว่าจ้าง:</p>
            <div className="border-b border-dashed border-slate-400 w-48 mb-2"></div>
            <p>(................................................................)</p>
            <p className="mt-1">วันที่: ...... / ...... / ..........</p>
          </div>
          <div className="sm:text-right">
            <p className="font-bold text-slate-800 mb-6">ในนาม บ้านชุ่มฉ่ำ (CHOOMCHAM HOUSE):</p>
            <div className="border-b border-dashed border-purple-400 w-48 mb-2 sm:ml-auto"></div>
            <p className="font-bold text-purple-900">ทีมผู้อำนวยการกระบวนการเรียนรู้</p>
            <p className="mt-1 text-slate-500">Choomcham House Facilitation Team</p>
          </div>
        </div>

      </div>

      {/* Print Footer Note */}
      <div className="max-w-4xl mx-auto text-center mt-6 text-xs text-slate-500 print:mt-10">
        Choomcham House — Empowering living organizations from the inside out. (https://choomcham.pages.dev)
      </div>
    </div>
  );
}
