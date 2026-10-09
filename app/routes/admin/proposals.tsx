import React, { useState, useEffect } from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { adminFetch } from "~/lib/admin-api.client";
import { GROWTH_PROGRAMS, getProgram } from "~/lib/programs";
import type { GrowthProgram } from "~/lib/programs";
import {
  FileText,
  Sparkles,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  Building2,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Layers,
  ChevronRight,
  ShieldCheck,
  Bot,
  RefreshCw,
  Eye,
  Edit3,
  CheckSquare,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";

export function meta() {
  return [{ title: "Proposal Engine · เครื่องมือสร้างข้อเสนอและใบเสนอราคา | Choomcham OS" }];
}

interface ProposalData {
  proposalNo: string;
  date: string;
  validDays: number;
  clientName: string;
  companyName: string;
  position: string;
  email: string;
  phone: string;
  orgLevel: string;
  programSlug: string;
  deliveryFormat: string;
  location: string;
  participantCount: number;
  investmentFee: number;
  discount: number;
  includeVat: boolean;
  withholdingTax: boolean;
  executiveSummary: string;
  customNotes: string;
}

export default function AdminProposalEngine() {
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize Proposal Data
  const [proposal, setProposal] = useState<ProposalData>({
    proposalNo: `CCH-PROP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().split("T")[0],
    validDays: 30,
    clientName: "คุณผู้บริหาร / ผู้อำนวยการฝ่ายทรัพยากรบุคคล",
    companyName: "องค์กรพันธมิตรเพื่อการเปลี่ยนแปลง",
    position: "HR Director / Chief People Officer",
    email: "contact@company.com",
    phone: "08X-XXX-XXXX",
    orgLevel: "ZOMBIE",
    programSlug: "from-zombie-to-living-organization",
    deliveryFormat: "In-House Workshop 1 วัน (6 ชั่วโมง)",
    location: "ห้องสัมมนาขององค์กร หรือโรงแรมที่ลูกค้าจัดเตรียม",
    participantCount: 25,
    investmentFee: 85000,
    discount: 0,
    includeVat: true,
    withholdingTax: true,
    executiveSummary:
      "โครงการยกระดับวัฒนธรรมและฟื้นฟูพลังชีวิตทีมงาน มุ่งเน้นการทลายกำแพงความเงียบ (Silent Silos) และปลุกพลังสร้างสรรค์ด้วยกระบวนการ 5-Stage Rebirth Model เพื่อเปลี่ยนผ่านจาก Zombie สู่ Living Organization ที่เติบโตอย่างมีชีวิตชีวา",
    customNotes: "รวมแบบประเมินสุขภาพองค์กรก่อนอบรม และชุดเครื่องมือ Rebirth Action Plan 30 วัน",
  });

  const selectedProgram: GrowthProgram | undefined =
    getProgram(proposal.programSlug) || GROWTH_PROGRAMS[0];

  // Load CRM Leads for quick auto-fill
  useEffect(() => {
    adminFetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setLeads(data.data.filter((l: any) => !l.archived));
        }
      })
      .catch((err) => console.warn("Could not load leads for proposal engine:", err));
  }, []);

  // Handle CRM Lead Selection
  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setProposal((prev) => ({
      ...prev,
      clientName: lead.name || prev.clientName,
      companyName: lead.company || prev.companyName,
      position: lead.position || prev.position,
      email: lead.email_or_line?.includes("@") ? lead.email_or_line : prev.email,
      phone: !lead.email_or_line?.includes("@") ? lead.email_or_line : prev.phone,
      orgLevel: lead.result_level || prev.orgLevel,
      programSlug:
        lead.result_level === "ZOMBIE" || lead.result_level === "FADED"
          ? "from-zombie-to-living-organization"
          : "team",
    }));
  };

  // Pricing Calculations
  const subtotal = Math.max(0, proposal.investmentFee - proposal.discount);
  const vatAmount = proposal.includeVat ? subtotal * 0.07 : 0;
  const grandTotal = subtotal + vatAmount;
  const withholdingTaxAmount = proposal.withholdingTax ? subtotal * 0.03 : 0;
  const netPayable = grandTotal - withholdingTaxAmount;

  // AI Pitch Generator using DeepSeek API
  const handleGenerateAIPitch = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await adminFetch("/api/content-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "article",
          angle: "ORGANIZATION",
          topic: `ข้อเสนอโครงการอบรม ${selectedProgram?.title || ""} สำหรับบริษัท ${proposal.companyName} เพื่อแก้ปัญหาภาวะ ${proposal.orgLevel}`,
          targetAudience: `ผู้บริหารระดับสูงและฝ่าย HR ของ ${proposal.companyName}`,
          customInstructions:
            "เขียนบทนำและ Executive Summary สำหรับข้อเสนอโครงการ Transformation สั้นๆ 3-4 ประโยคที่ทรงพลัง เน้น ROI ทางวัฒนธรรม ความคุ้มค่า และการเปลี่ยนแปลงจากภายใน",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data?.content) {
        // Extract concise summary
        const cleanContent = data.data.content
          .replace(/^#+\s.*$/gm, "")
          .trim()
          .slice(0, 450);
        setProposal((prev) => ({
          ...prev,
          executiveSummary: cleanContent || prev.executiveSummary,
        }));
      }
    } catch (err) {
      console.warn("AI Pitch generation failed:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `
# ข้อเสนอโครงการพัฒนาบุคลากรและวัฒนธรรมองค์กร (B2B Proposal)
**เลขที่ข้อเสนอ:** ${proposal.proposalNo} | **วันที่:** ${proposal.date}
**ลูกค้า:** ${proposal.companyName} (ผู้ประสานงาน: ${proposal.clientName} - ${proposal.position})

## 1. หลักสูตรและขอบเขต
- **โปรแกรม:** ${selectedProgram?.title} (${selectedProgram?.level})
- **รูปแบบ:** ${proposal.deliveryFormat}
- **สถานที่:** ${proposal.location}
- **จำนวนผู้เข้าอบรม:** ${proposal.participantCount} ท่าน

## 2. วัตถุประสงค์และผลลัพธ์
${selectedProgram?.objectives.map((o) => `- ${o}`).join("\n")}

## 3. งบประมาณและการลงทุน
- มูลค่าโครงการ: ฿${proposal.investmentFee.toLocaleString()}
- ส่วนลดพิเศษ: -฿${proposal.discount.toLocaleString()}
- รวมสุทธิ (ก่อน VAT): ฿${subtotal.toLocaleString()}
- ภาษีมูลค่าเพิ่ม 7%: ฿${vatAmount.toLocaleString()}
- **ยอดรวมสุทธิทั้งสิ้น: ฿${grandTotal.toLocaleString()}**
${proposal.withholdingTax ? `- หักภาษี ณ ที่จ่าย 3%: -฿${withholdingTaxAmount.toLocaleString()} (ยอดชำระสุทธิ: ฿${netPayable.toLocaleString()})` : ""}

---
บ้านชุ่มฉ่ำ Choomcham House
โทร: 081-555-XXXX | เว็บไซต์: https://choomcham.pages.dev
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AdminLayout
      title="Proposal Engine"
      subtitle="ระบบร่างข้อเสนอโครงการ ใบเสนอราคา และคำนวณการลงทุนสำหรับลูกค้าองค์กร (B2B)"
    >
      {/* Top Action & Mode Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "builder"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>1. ร่างข้อเสนอ & คำนวณราคา</span>
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "preview"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. พรีวิวเอกสาร & พิมพ์ PDF</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "preview" && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-900/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>
          )}
          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? "คัดลอก Markdown แล้ว!" : "คัดลอกสรุป"}</span>
          </button>
        </div>
      </div>

      {activeTab === "builder" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
          {/* Left Form: Client, Program, Pricing */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Auto-Fill From CRM */}
            {leads.length > 0 && (
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-purple-900">
                      ดึงข้อมูลจาก CRM Leads อัตโนมัติ
                    </h4>
                    <p className="text-[11px] text-purple-700">
                      เลือกลูกค้าที่ทำแบบประเมินเพื่อกรอกข้อมูลองค์กรและระดับปัญหาลงข้อเสนอทันที
                    </p>
                  </div>
                </div>
                <select
                  value={selectedLeadId}
                  onChange={(e) => handleSelectLead(e.target.value)}
                  className="bg-white border border-purple-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-purple-500 w-full sm:w-auto"
                >
                  <option value="">-- เลือกลูกค้าจาก CRM --</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.company || l.name} ({l.result_level || "Score: " + l.score})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Section 1: Client Information */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>1. ข้อมูลองค์กรและผู้ติดต่อ (Client Information)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อองค์กร / บริษัท
                  </label>
                  <input
                    type="text"
                    value={proposal.companyName}
                    onChange={(e) =>
                      setProposal({ ...proposal, companyName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อ-นามสกุล ผู้ประสานงาน
                  </label>
                  <input
                    type="text"
                    value={proposal.clientName}
                    onChange={(e) =>
                      setProposal({ ...proposal, clientName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ตำแหน่ง / ฝ่ายงาน
                  </label>
                  <input
                    type="text"
                    value={proposal.position}
                    onChange={(e) =>
                      setProposal({ ...proposal, position: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ระดับสภาวะองค์กร (Diagnostic Level)
                  </label>
                  <select
                    value={proposal.orgLevel}
                    onChange={(e) =>
                      setProposal({ ...proposal, orgLevel: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                  >
                    <option value="ZOMBIE">ZOMBIE (ภาวะหมดใจ หมดไฟสะสม)</option>
                    <option value="FADED">FADED (ภาวะเฉา ขาดความหมาย)</option>
                    <option value="TIRED">TIRED (ภาวะเหนื่อยล้าสะสม)</option>
                    <option value="AWAKENING">AWAKENING (ภาวะเริ่มตื่นรู้)</option>
                    <option value="ALIVE">ALIVE (ภาวะมีชีวิตชีวาและพลังร่วม)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    อีเมลติดต่อ
                  </label>
                  <input
                    type="email"
                    value={proposal.email}
                    onChange={(e) =>
                      setProposal({ ...proposal, email: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เบอร์โทรศัพท์ / LINE
                  </label>
                  <input
                    type="text"
                    value={proposal.phone}
                    onChange={(e) =>
                      setProposal({ ...proposal, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Program & Workshop Format */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>2. หลักสูตรและรูปแบบส่งมอบ (Program & Scope)</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เลือกหลักสูตรเรือธง / 5 ระดับการเติบโต
                  </label>
                  <select
                    value={proposal.programSlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const prog = getProgram(slug);
                      setProposal({
                        ...proposal,
                        programSlug: slug,
                        investmentFee:
                          slug === "from-zombie-to-living-organization"
                            ? 120000
                            : 85000,
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-purple-900 focus:bg-white focus:border-purple-500"
                  >
                    <option value="from-zombie-to-living-organization">
                      🌟 [Flagship] From Zombie to Living Organization (หลักสูตรเปลี่ยนผ่านองค์กรทั้งระบบ)
                    </option>
                    {GROWTH_PROGRAMS.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.level} : {p.title} ({p.hook})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      รูปแบบการจัดอบรม
                    </label>
                    <input
                      type="text"
                      value={proposal.deliveryFormat}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          deliveryFormat: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      จำนวนผู้เข้าอบรม (ท่าน)
                    </label>
                    <input
                      type="number"
                      value={proposal.participantCount}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          participantCount: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      สถานที่จัดสัมมนา
                    </label>
                    <input
                      type="text"
                      value={proposal.location}
                      onChange={(e) =>
                        setProposal({ ...proposal, location: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* AI Pitch Generator */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>บทนำข้อเสนอและผลลัพธ์เชิงธุรกิจ (Executive Summary)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAIPitch}
                      disabled={isGeneratingAI}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                    >
                      <Bot
                        className={`w-3.5 h-3.5 ${isGeneratingAI ? "animate-spin" : ""}`}
                      />
                      <span>
                        {isGeneratingAI ? "กำลังให้ AI ร่าง..." : "✨ ให้ DeepSeek AI ร่างบทนำ"}
                      </span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={proposal.executiveSummary}
                    onChange={(e) =>
                      setProposal({
                        ...proposal,
                        executiveSummary: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:bg-white focus:border-purple-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Pricing & Investment Engine */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <span>3. งบประมาณและการลงทุน (Investment & Taxes)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    มูลค่าโครงการมาตรฐาน (THB)
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={proposal.investmentFee}
                    onChange={(e) =>
                      setProposal({
                        ...proposal,
                        investmentFee: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ส่วนลดพิเศษ / Early Bird (THB)
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={proposal.discount}
                    onChange={(e) =>
                      setProposal({
                        ...proposal,
                        discount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-rose-600 focus:bg-white focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={proposal.includeVat}
                    onChange={(e) =>
                      setProposal({ ...proposal, includeVat: e.target.checked })
                    }
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>คิดภาษีมูลค่าเพิ่ม VAT 7%</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={proposal.withholdingTax}
                    onChange={(e) =>
                      setProposal({
                        ...proposal,
                        withholdingTax: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>แสดงการหักภาษี ณ ที่จ่าย 3% (Withholding Tax)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary Card & Quick Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-purple-300 font-semibold tracking-wider uppercase">
                  สรุปการลงทุน (Quotation Summary)
                </span>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30">
                  {proposal.proposalNo}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>มูลค่าหลักสูตร:</span>
                  <span className="font-semibold text-white">
                    ฿{proposal.investmentFee.toLocaleString()}
                  </span>
                </div>
                {proposal.discount > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>ส่วนลดพิเศษ:</span>
                    <span className="font-semibold">
                      -฿{proposal.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300 pt-1 border-t border-white/10">
                  <span>รวมก่อนภาษี (Subtotal):</span>
                  <span className="font-bold text-white">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
                {proposal.includeVat && (
                  <div className="flex justify-between text-slate-300">
                    <span>VAT 7%:</span>
                    <span className="font-medium text-purple-200">
                      +฿{vatAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-amber-300 pt-2 border-t border-white/20">
                  <span>ยอดรวมทั้งสิ้น:</span>
                  <span className="text-base">
                    ฿{grandTotal.toLocaleString()}
                  </span>
                </div>
                {proposal.withholdingTax && (
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>หัก ณ ที่จ่าย 3%:</span>
                    <span>-฿{withholdingTaxAmount.toLocaleString()}</span>
                  </div>
                )}
                {proposal.withholdingTax && (
                  <div className="flex justify-between text-xs font-bold text-emerald-400">
                    <span>ยอดชำระสุทธิ:</span>
                    <span>฿{netPayable.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("preview")}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-2xl text-xs shadow-lg shadow-purple-950 flex items-center justify-center gap-2 transition-transform hover:scale-101 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>ดูตัวอย่างเอกสารฉบับทางการ</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-400 space-y-1 pt-2 border-t border-white/10">
                <p>✓ รวม Rebirth Diagnostic แบบประเมินรายบุคคล</p>
                <p>✓ รวมเอกสารประกอบ Workshop & Rebirth Canvas</p>
                <p>✓ รวมรายงานสรุปผลผู้บริหาร (Executive Debrief)</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Document Official Printable Preview */
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-md space-y-8 print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 font-sans">
            {/* Header / Letterhead */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-purple-900">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-950 p-2 flex items-center justify-center shadow-md">
                  <img
                    src="/chumcham.png"
                    alt="Choomcham Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    บ้านชุ่มฉ่ำ · CHOOMCHAM HOUSE
                  </h2>
                  <p className="text-xs text-purple-700 font-semibold mt-0.5">
                    Helping People & Organizations Reborn From Within
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    สถาบันพัฒนาผู้นำ วัฒนธรรมองค์กร และการเรียนรู้เชิงประสบการณ์
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
                <p className="text-sm font-extrabold text-purple-900 uppercase">
                  ข้อเสนอโครงการพัฒนาองค์กร
                </p>
                <p className="font-mono font-bold text-slate-800">
                  {proposal.proposalNo}
                </p>
                <p>
                  วันที่:{" "}
                  {new Date(proposal.date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-[11px] text-slate-500">
                  ยืนยันราคาภายใน {proposal.validDays} วัน
                </p>
              </div>
            </div>

            {/* Client Info Banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider block mb-1">
                  เสนอต่อ (Client / Organization)
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {proposal.companyName}
                </p>
                <p className="text-slate-700 mt-0.5">
                  เรียน: {proposal.clientName} ({proposal.position})
                </p>
                <p className="text-slate-500 mt-0.5">
                  อีเมล: {proposal.email} | โทร: {proposal.phone}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider block mb-1">
                  กรอบการดำเนินงาน (Scope of Delivery)
                </span>
                <p className="text-slate-800 font-semibold">
                  {proposal.deliveryFormat}
                </p>
                <p className="text-slate-600 mt-0.5">
                  จำนวนผู้เข้าอบรม: {proposal.participantCount} ท่าน
                </p>
                <p className="text-slate-600 mt-0.5">
                  สถานที่: {proposal.location}
                </p>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                <span>บทนำและวัตถุประสงค์โครงการ (Project Objective & Approach)</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-purple-50/40 p-4 rounded-xl border border-purple-100 italic">
                "{proposal.executiveSummary}"
              </p>
            </div>

            {/* Program Structure & 5-Stage Rebirth Modules */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-purple-900 tracking-wider">
                  โครงสร้างหลักสูตร: {selectedProgram?.title} ({selectedProgram?.level})
                </h3>
                <span className="text-[10px] font-semibold text-slate-500">
                  ระยะเวลา: {selectedProgram?.duration}
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-4 w-1/4">ช่วงการเรียนรู้ / Module</th>
                      <th className="py-2.5 px-4 w-1/2">กิจกรรมเชิงกระบวนการ (Experiential Activity)</th>
                      <th className="py-2.5 px-4 w-1/4">สิ่งส่งมอบ (Output)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedProgram?.modules.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-purple-950">
                          {idx + 1}. {m.title}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          {m.activity}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {m.output}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Investment & Pricing Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-purple-900 tracking-wider">
                งบประมาณและการลงทุน (Investment Breakdown)
              </h3>

              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-4">รายการบริการ</th>
                      <th className="py-2.5 px-4 text-center">จำนวน</th>
                      <th className="py-2.5 px-4 text-right">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        หลักสูตร {selectedProgram?.title} (สำหรับ {proposal.participantCount} ท่าน)
                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                          รวม Master Facilitator, วิทยากรผู้ช่วย, ชุดแบบฝึกหัด Canvas และ Rebirth Report
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">1 โครงการ</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        ฿{proposal.investmentFee.toLocaleString()}
                      </td>
                    </tr>
                    {proposal.discount > 0 && (
                      <tr className="text-rose-600 bg-rose-50/30">
                        <td className="py-2.5 px-4 font-medium">
                          สิทธิประโยชน์ส่วนลดพิเศษ (Special Privilege Discount)
                        </td>
                        <td className="py-2.5 px-4 text-center">-</td>
                        <td className="py-2.5 px-4 text-right font-bold">
                          -฿{proposal.discount.toLocaleString()}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-slate-50/70 font-semibold">
                      <td colSpan={2} className="py-2.5 px-4 text-right text-slate-700">
                        รวมมูลค่าก่อนภาษี (Subtotal):
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                        ฿{subtotal.toLocaleString()}
                      </td>
                    </tr>
                    {proposal.includeVat && (
                      <tr className="bg-slate-50/70">
                        <td colSpan={2} className="py-2 px-4 text-right text-slate-600">
                          ภาษีมูลค่าเพิ่ม (VAT 7%):
                        </td>
                        <td className="py-2 px-4 text-right text-purple-900 font-medium">
                          ฿{vatAmount.toLocaleString()}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-purple-900 text-white font-extrabold text-sm">
                      <td colSpan={2} className="py-3.5 px-4 text-right">
                        ยอดรวมสุทธิทั้งสิ้น (Grand Total):
                      </td>
                      <td className="py-3.5 px-4 text-right text-amber-300 text-base">
                        ฿{grandTotal.toLocaleString()}
                      </td>
                    </tr>
                    {proposal.withholdingTax && (
                      <tr className="bg-slate-50 text-[11px] text-slate-600">
                        <td colSpan={2} className="py-2 px-4 text-right">
                          หักภาษี ณ ที่จ่าย 3% (Withholding Tax):
                        </td>
                        <td className="py-2 px-4 text-right font-semibold text-slate-800">
                          -฿{withholdingTaxAmount.toLocaleString()} (ยอดชำระสุทธิ: ฿{netPayable.toLocaleString()})
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Terms & Payment Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
              <div className="space-y-1">
                <span className="font-bold text-purple-950 uppercase block">
                  เงื่อนไขการชำระเงิน (Payment Terms)
                </span>
                <p>• มัดจำ 50% เมื่อยืนยันการจัดโครงการและกำหนดวันสัมมนา</p>
                <p>• ชำระส่วนที่เหลือ 50% ภายใน 15 วันหลังจากเสร็จสิ้นโครงการ</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-purple-950 uppercase block">
                  สิทธิประโยชน์พิเศษที่รวมในโครงการ
                </span>
                <p>• สิทธิ์ทำแบบประเมิน Zombie Check™ รายบุคคลฟรีทุกคน</p>
                <p>• รายงานสรุปผลสะท้อนภาพรวมและแนวทางพัฒนาต่อยอด</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
              <div className="text-center space-y-6">
                <p className="font-bold text-slate-900">
                  ในนาม บ้านชุ่มฉ่ำ (Choomcham House)
                </p>
                <div className="h-12 border-b border-dashed border-slate-300 w-48 mx-auto" />
                <div>
                  <p className="font-bold text-slate-800">
                    ครูเด่น · สรรพสิทธิ์ ธุระธรรม
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Lead Facilitator & Transformation Consultant
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <p className="font-bold text-slate-900">
                  ผู้อนุมัติ / ในนาม {proposal.companyName}
                </p>
                <div className="h-12 border-b border-dashed border-slate-300 w-48 mx-auto" />
                <div>
                  <p className="font-bold text-slate-800">
                    ({proposal.clientName})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ตำแหน่ง: {proposal.position}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
