import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { 
  FileText, 
  Sparkles, 
  Copy, 
  ExternalLink, 
  Printer, 
  Download, 
  Plus, 
  Building2, 
  User, 
  Mail, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Clock, 
  ChevronRight,
  Send,
  Layers,
  ShieldCheck
} from "lucide-react";
import { fetchLeadsFromSupabase } from "~/lib/services";

export function meta() {
  return [
    { title: "Proposal & Quotation Engine | Choomcham House OS" },
  ];
}

const PROGRAM_TEMPLATES = [
  {
    id: "REBORN_PEOPLE",
    name: "REBORN PEOPLE (1-2 Days Workshop)",
    desc: "ปลุกพลังคน คืนชีวิตชีวา จุดประกายความหมายในการทำงานและก้าวข้ามความเฉื่อยชา",
    defaultPrice: 120000,
    recommendedParticipants: "20 - 40 คน",
    duration: "1 - 2 วัน (In-house / Retreat)"
  },
  {
    id: "ALIVE_TEAM",
    name: "ALIVE TEAM (2 Days Retreat)",
    desc: "สลายกำแพง Silo สร้าง Psychological Safety และวัฒนธรรมการสื่อสารที่เปิดใจ",
    defaultPrice: 185000,
    recommendedParticipants: "25 - 60 คน",
    duration: "2 วัน 1 คืน (Off-site Retreat)"
  },
  {
    id: "REBORN_LEADER",
    name: "REBORN LEADER (Executive Program)",
    desc: "ผู้นำที่ตระหนักรู้ตนเอง นำด้วย Empathy และสร้างพื้นที่ปลอดภัยให้ทีมเติบโต",
    defaultPrice: 220000,
    recommendedParticipants: "12 - 25 คน",
    duration: "2 วัน + 1-on-1 Coaching"
  },
  {
    id: "LIVING_ORGANIZATION",
    name: "LIVING ORGANIZATION (Quarterly Transformation)",
    desc: "โครงการยกระดับวัฒนธรรมองค์กรระยะยาว 3-6 เดือน ตาม 5-Stage Rebirth Model",
    defaultPrice: 380000,
    recommendedParticipants: "ทั้งองค์กร / BU",
    duration: "3 - 6 เดือน (Continuous Cycle)"
  }
];

export default function AdminProposals() {
  const [searchParams] = useSearchParams();
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");

  // Form States (with URL search params support)
  const initialCompany = searchParams.get("company") || "บริษัท ตัวอย่าง อินโนเวชั่น จำกัด";
  const initialName = searchParams.get("name") || "คุณผู้บริหาร นามสมมุติ";
  const initialPosition = searchParams.get("position") || "Chief People Officer / HRD";
  const initialTeamSize = searchParams.get("teamSize") || "20-50 คน";
  const initialProgramName = searchParams.get("program") || "";

  const matchedTemplate = initialProgramName
    ? PROGRAM_TEMPLATES.find(p => initialProgramName.toLowerCase().includes(p.id.toLowerCase()) || initialProgramName.includes(p.name)) || PROGRAM_TEMPLATES[1]
    : PROGRAM_TEMPLATES[1];

  const [company, setCompany] = useState(initialCompany);
  const [contactName, setContactName] = useState(initialName);
  const [position, setPosition] = useState(initialPosition);
  const [teamSize, setTeamSize] = useState(initialTeamSize);
  const [selectedProgram, setSelectedProgram] = useState(matchedTemplate);
  const [customPrice, setCustomPrice] = useState<number>(matchedTemplate.defaultPrice);
  const [workshopDate, setWorkshopDate] = useState("ภายใน 30 วันหลังอนุมัติ");
  const [validUntilDays, setValidUntilDays] = useState(30);
  const [customNotes, setCustomNotes] = useState("");

  const [copied, setCopied] = useState(false);

  // Load real leads to populate selector
  useEffect(() => {
    fetchLeadsFromSupabase().then(res => {
      if (res.success && res.data) {
        setLeads(res.data);
      }
    });
  }, []);

  // When a lead is selected from dropdown
  const handleLeadSelect = (leadId: string) => {
    setSelectedLeadId(leadId);
    const found = leads.find(l => l.id === leadId);
    if (found) {
      setCompany(found.company || "");
      setContactName(found.name || "");
      setPosition(found.position || "");
      setTeamSize(found.team_size || "20-50 คน");
      
      // Auto recommend program based on score/result
      if (found.result_level === "ZOMBIE" || found.score <= 17) {
        setSelectedProgram(PROGRAM_TEMPLATES[1]); // ALIVE TEAM
        setCustomPrice(PROGRAM_TEMPLATES[1].defaultPrice);
      } else if (found.result_level === "FADED") {
        setSelectedProgram(PROGRAM_TEMPLATES[0]); // REBORN PEOPLE
        setCustomPrice(PROGRAM_TEMPLATES[0].defaultPrice);
      } else {
        setSelectedProgram(PROGRAM_TEMPLATES[3]); // LIVING ORGANIZATION
        setCustomPrice(PROGRAM_TEMPLATES[3].defaultPrice);
      }
    }
  };

  // Generate dynamic URL
  const proposalUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/proposal?company=${encodeURIComponent(company)}&name=${encodeURIComponent(contactName)}&position=${encodeURIComponent(position)}&teamSize=${encodeURIComponent(teamSize)}&price=${customPrice}&program=${encodeURIComponent(selectedProgram.name)}`
    : `/proposal?company=${encodeURIComponent(company)}&name=${encodeURIComponent(contactName)}&price=${customPrice}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(proposalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Tax calculations
  const subtotal = customPrice;
  const vat = subtotal * 0.07;
  const grandTotal = subtotal + vat;
  const withholdingTax = subtotal * 0.03;
  const netPayment = grandTotal - withholdingTax;

  return (
    <AdminLayout
      title="Choomcham Proposal & Quotation Engine"
      subtitle="ระบบจัดทำและออกใบเสนอราคา พร้อม 5-Stage Transformation Blueprint ส่งให้องค์กรลูกค้าได้ทันที"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 p-5 bg-purple-50 border border-purple-200 rounded-2xl"><strong className="block mb-2">ต้องการออกแบบเนื้อหาให้ตรงโจทย์องค์กร?</strong><p className="text-sm mb-3">เขียนวัตถุประสงค์ กิจกรรม เวลา และแผนวัดผลจากคำขอ Proposal ก่อนยืนยันขอบเขตและราคา</p><Link to="/admin/courses" className="text-purple-700 font-semibold underline">เปิดเครื่องมือออกแบบหลักสูตร →</Link></div>
        
        {/* Left Form: Proposal Builder */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">1. ข้อมูลองค์กรและผู้รับข้อเสนอ</h2>
            </div>

            {/* Quick Lead Selector */}
            {leads.length > 0 && (
              <div className="mb-5 p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl">
                <label className="block text-xs font-bold text-purple-900 mb-1.5">
                  ดึงข้อมูลจาก Lead ในระบบอัตโนมัติ:
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => handleLeadSelect(e.target.value)}
                  className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-purple-600"
                >
                  <option value="">-- เลือกลูกค้าจาก CRM Leads ({leads.length} รายชื่อ) --</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.company} — {l.name} ({l.result_level || "Lead"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อบริษัท / องค์กร</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="เช่น บริษัท สยามเทค อินโนเวชั่น จำกัด"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อผู้ติดต่อ</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="คุณ..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ตำแหน่งงาน</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="HRD Director, MD, CEO"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ขนาดทีม / จำนวนผู้เข้าร่วม</label>
                <input
                  type="text"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="เช่น 30-50 คน"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Program & Pricing Selection */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-pink-600" />
              <h2 className="text-base font-bold text-slate-900">2. เลือกหลักสูตร & มูลค่าโครงการ (Investment)</h2>
            </div>

            <div className="space-y-3 mb-5">
              {PROGRAM_TEMPLATES.map((prog) => {
                const isSelected = selectedProgram.id === prog.id;
                return (
                  <div
                    key={prog.id}
                    onClick={() => {
                      setSelectedProgram(prog);
                      setCustomPrice(prog.defaultPrice);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-xs"
                        : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs sm:text-sm text-slate-900">{prog.name}</div>
                      <div className="font-extrabold text-xs text-purple-700">฿{prog.defaultPrice.toLocaleString()}</div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{prog.desc}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span>⏱️ {prog.duration}</span>
                      <span>👥 {prog.recommendedParticipants}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                กำหนดมูลค่าโครงการ (ก่อน VAT)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">฿</span>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-purple-900 focus:bg-white focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview & Action Deck */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase block">
                  Interactive Proposal Card
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{company}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                Ready to Send
              </span>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">ผู้รับเอกสาร:</span>
                <span className="font-semibold text-white">{contactName} ({position})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">หลักสูตร:</span>
                <span className="font-semibold text-purple-200 text-right max-w-[220px] truncate">{selectedProgram.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">ขนาดกลุ่มเป้าหมาย:</span>
                <span className="font-semibold text-white">{teamSize}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">มูลค่าบริการ (Subtotal):</span>
                <span className="font-bold text-white">฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">VAT 7%:</span>
                <span className="text-slate-300">฿{vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">หัก ณ ที่จ่าย 3%:</span>
                <span className="text-rose-300">-฿{withholdingTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-extrabold bg-white/5 px-3 rounded-xl">
                <span className="text-purple-300">ยอดชำระสุทธิ (Net Payment):</span>
                <span className="text-emerald-400 text-base">฿{netPayment.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2.5">
              <a
                href={proposalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all hover:scale-101"
              >
                <FileText className="w-4 h-4" />
                <span>เปิดดู / พิมพ์ Proposal ฉบับเต็ม (Print/PDF Ready)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "คัดลอกลิงก์สำเร็จ!" : "คัดลอกลิงก์ Proposal"}</span>
                </button>

                <a
                  href={`https://line.me/R/msg/text/?${encodeURIComponent(`เรียน ${contactName} (${company})\nทาง Choomcham House ขอส่งข้อเสนอโครงการ Transformation Blueprint และใบเสนอราคาครับ:\n${proposalUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  title="แชร์ลิงก์เข้า LINE"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่ง LINE</span>
                </a>
              </div>
            </div>
          </div>

          {/* 5-Stage Visual Blueprint Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Included in this Proposal: 5-Stage Rebirth Blueprint
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                <div>
                  <span className="font-bold text-purple-950">RESET:</span> <span className="text-slate-600">ล้างความล้า คืนพื้นที่ปลอดภัย</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                <div>
                  <span className="font-bold text-purple-950">RECONNECT:</span> <span className="text-slate-600">ทลาย Silo เชื่อมโยงความไว้วางใจ</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                <div>
                  <span className="font-bold text-purple-950">RECHARGE:</span> <span className="text-slate-600">จุดประกายความหมายในการทำงาน</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">4</span>
                <div>
                  <span className="font-bold text-purple-950">REIMAGINE:</span> <span className="text-slate-600">มองอนาคตและโจทย์ด้วยมุมมองใหม่</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">5</span>
                <div>
                  <span className="font-bold text-purple-950">RECREATE:</span> <span className="text-slate-600">ลงมือสร้างวิถีและผลลัพธ์ใหม่ในออฟฟิศ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
