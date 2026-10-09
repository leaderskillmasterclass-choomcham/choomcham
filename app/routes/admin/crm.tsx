import React, { useState, useEffect } from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  Filter, 
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCw,
  FileText,
  Trash2,
  ExternalLink,
  PhoneCall,
  Calendar,
  AlertCircle
} from "lucide-react";
import { 
  fetchLeadsFromSupabase, 
  updateLeadStatusInSupabase, 
  deleteLeadFromSupabase,
  subscribeToLeadsRealtime 
} from "~/lib/services";
import { exportLeadsToExcel } from "~/lib/excel";

export interface CRMLead {
  id: string;
  name: string;
  company: string;
  position: string;
  emailOrLine: string;
  teamSize: string;
  score: number;
  resultLevel: "ALIVE" | "TIRED" | "FADED" | "ZOMBIE" | string;
  status: "NEW" | "CONTACTED" | "CONSULTATION" | "PROPOSAL" | "WON" | "LOST" | string;
  notes?: string;
  createdAt: string;
  rawCreatedAt?: string;
  dimensions_scores?: any;
}

const PIPELINE_COLUMNS = [
  { id: "NEW", title: "New Inquiries", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "CONTACTED", title: "Contacted / Qualified", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "CONSULTATION", title: "Consultation Booked", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "PROPOSAL", title: "Proposal Sent", badge: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: "WON", title: "Won / Active Project", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export function meta() {
  return [
    { title: "B2B CRM Pipeline | Choomcham House OS" },
  ];
}

export default function AdminCRM() {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [leadTypeFilter, setLeadTypeFilter] = useState<"ALL" | "QUIZ" | "CONSULT" | "PROPOSAL">("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);

  // Helper to map DB row to CRMLead
  const mapDbLead = (item: any): CRMLead => {
    let dateFormatted = "-";
    try {
      if (item.created_at) {
        dateFormatted = new Date(item.created_at).toLocaleString("th-TH", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    } catch {
      dateFormatted = item.created_at || "-";
    }

    return {
      id: item.id,
      name: item.name || "-",
      company: item.company || "-",
      position: item.position || "-",
      emailOrLine: item.email_or_line || "-",
      teamSize: item.team_size || (item.dimensions_scores?.program_interest ? `สนใจ: ${item.dimensions_scores.program_interest}` : "ไม่ได้ระบุ"),
      score: item.score !== undefined ? item.score : 0,
      resultLevel: item.result_level || "ZOMBIE",
      status: item.status || "NEW",
      notes: item.notes || "",
      createdAt: dateFormatted,
      rawCreatedAt: item.created_at,
      dimensions_scores: item.dimensions_scores
    };
  };

  // Load real leads from Supabase on mount
  const loadLeads = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchLeadsFromSupabase();
      if (res.success && res.data) {
        const mappedLeads: CRMLead[] = res.data.map(mapDbLead);
        setLeads(mappedLeads);
      }
    } catch (e) {
      console.error("Failed to load Supabase leads", e);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();

    // Setup real-time listener for incoming quiz submissions and contact form leads
    const unsubscribe = subscribeToLeadsRealtime((payload) => {
      if (payload.eventType === "INSERT") {
        const newLead = mapDbLead(payload.new);
        setLeads(prev => [newLead, ...prev.filter(l => l.id !== newLead.id)]);
        setLiveNotification(`⚡ มี Lead ใหม่เข้ามา: ${newLead.company} (${newLead.name})`);
        setTimeout(() => setLiveNotification(null), 6000);
      } else if (payload.eventType === "UPDATE") {
        const updated = mapDbLead(payload.new);
        setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
        if (selectedLead?.id === updated.id) {
          setSelectedLead(updated);
        }
      } else if (payload.eventType === "DELETE") {
        setLeads(prev => prev.filter(l => l.id !== payload.old.id));
        if (selectedLead?.id === payload.old.id) {
          setSelectedLead(null);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
    await updateLeadStatusInSupabase(null, leadId, newStatus);
  };

  const handleDeleteLead = async (leadId: string, name: string) => {
    if (confirm(`คุณต้องการลบข้อมูล Lead ของ "${name}" ใช่หรือไม่?`)) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(null);
      }
      await deleteLeadFromSupabase(null, leadId);
    }
  };

  const handleExportExcel = () => {
    exportLeadsToExcel(leads, "choomcham_leads_crm");
  };

  const handleExportCSV = () => {
    const headers = "ID,Name,Company,Position,Contact,Score,ResultLevel,Status,CreatedAt\n";
    const rows = leads.map(l => 
      `"${l.id}","${l.name}","${l.company}","${l.position}","${l.emailOrLine}",${l.score},"${l.resultLevel}","${l.status}","${l.createdAt}"`
    ).join("\n");

    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `choomcham_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => {
    const matchSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.emailOrLine.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (leadTypeFilter === "QUIZ") {
      return l.score > 0 || l.dimensions_scores?.form_type === "quiz" || ["ALIVE", "TIRED", "FADED", "ZOMBIE"].includes(l.resultLevel);
    }
    if (leadTypeFilter === "CONSULT") {
      return l.resultLevel === "CONSULT_BRIEF" || l.resultLevel === "CONSULTATION" || l.resultLevel === "PROGRAM_INQUIRY" || l.dimensions_scores?.form_type === "contact";
    }
    if (leadTypeFilter === "PROPOSAL") {
      return l.resultLevel === "PROPOSAL_REQUEST" || l.resultLevel === "PROPOSAL" || l.status === "PROPOSAL" || !!l.dimensions_scores?.program_interest;
    }
    return true;
  });

  // Helper to extract phone number or clean line id
  const getCleanContact = (contactStr: string) => {
    const phoneMatch = contactStr.match(/\b\d{9,10}\b/);
    const isEmail = contactStr.includes("@");
    return {
      isPhone: !!phoneMatch,
      phone: phoneMatch ? phoneMatch[0] : "",
      isEmail,
      isLine: contactStr.toLowerCase().includes("line") || (!isEmail && !phoneMatch)
    };
  };

  return (
    <AdminLayout
      title="B2B CRM Pipeline Management"
      subtitle="ติดตามและจัดการข้อมูลผู้ทำแบบประเมินและผู้ติดต่อเพื่อรับบริการ Reborn องค์กร (Real-time Supabase Data)"
    >
      {/* Real-time Notification Banner */}
      {liveNotification && (
        <div className="mb-4 p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <span className="animate-ping w-2 h-2 rounded-full bg-yellow-300"></span>
            <span>{liveNotification}</span>
          </div>
          <button 
            onClick={() => setLiveNotification(null)}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setLeadTypeFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            leadTypeFilter === "ALL"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          ทั้งหมด ({leads.length})
        </button>
        <button
          onClick={() => setLeadTypeFilter("QUIZ")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            leadTypeFilter === "QUIZ"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          🧟 Quiz Diagnostic ({leads.filter(l => l.score > 0).length})
        </button>
        <button
          onClick={() => setLeadTypeFilter("CONSULT")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            leadTypeFilter === "CONSULT"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          🎯 นัดปรึกษาองค์กร
        </button>
        <button
          onClick={() => setLeadTypeFilter("PROPOSAL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            leadTypeFilter === "PROPOSAL"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          📄 ขอใบเสนอราคา
        </button>
      </div>

      {/* Top Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อผู้ติดต่อ หรือ บริษัท..."
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-hidden focus:border-purple-500 shadow-2xs"
            />
          </div>

          <button
            onClick={loadLeads}
            disabled={isRefreshing}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            title="รีเฟรชข้อมูลจาก Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />
            <span className="hidden sm:inline text-xs font-semibold">รีเฟรช</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{filteredLeads.length}</span> รายการ
          </div>

          {/* Excel Export Button */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-102"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
          >
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">กำลังโหลดข้อมูล Real-time จาก Supabase Database...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">ยังไม่มีข้อมูล Lead ในระบบ</h3>
          <p className="text-xs text-slate-500 mb-6">
            เมื่อมีผู้เข้าทำแบบประเมิน Zombie Index™ หรือกรอกฟอร์มนัดพูดคุยจากหน้าเว็บไซต์ ข้อมูลจะปรากฏที่นี่แบบ Real-time ทันที
          </p>
          <a
            href="/#zombie-check"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <span>ทดลองทำแบบประเมินหน้าเว็บ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        /* Kanban Board Layout */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((col) => {
            const colLeads = filteredLeads.filter(l => l.status === col.id);
            return (
              <div key={col.id} className="bg-slate-100/80 rounded-2xl p-3 flex flex-col min-w-[260px] border border-slate-200/70">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-slate-700 tracking-tight">{col.title}</span>
                  <span className="text-[11px] font-semibold bg-white text-slate-600 px-2 py-0.5 rounded-full shadow-2xs border border-slate-200">
                    {colLeads.length}
                  </span>
                </div>

                {/* Lead Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          lead.resultLevel === "ZOMBIE" ? "bg-rose-100 text-rose-700" :
                          lead.resultLevel === "FADED" ? "bg-orange-100 text-orange-700" :
                          lead.resultLevel === "TIRED" ? "bg-amber-100 text-amber-700" :
                          lead.resultLevel === "ALIVE" ? "bg-emerald-100 text-emerald-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {lead.resultLevel} {lead.score > 0 ? `(${lead.score}/40)` : ""}
                        </span>
                        <span className="text-[10px] text-slate-400">{lead.createdAt}</span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                        {lead.company}
                      </h3>
                      <p className="text-xs text-slate-500 mb-2">{lead.name} • {lead.position}</p>

                      <div className="text-[11px] text-purple-700 font-medium bg-purple-50/60 px-2 py-1 rounded-md border border-purple-100/80 truncate mb-2">
                        📞 {lead.emailOrLine}
                      </div>

                      {lead.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                          {lead.notes}
                        </p>
                      )}
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                      ไม่มีรายการ
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lead Detail Drawer / Modal with Direct Contact Actions */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">
                    Lead Detail Overview
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedLead.company}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Status Selector */}
              <div className="my-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  ปรับเปลี่ยนสถานะ CRM
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PIPELINE_COLUMNS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleStatusChange(selectedLead.id, col.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        selectedLead.status === col.id
                          ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {col.title.split("/")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIRECT CONTACT CHANNELS (ACTIONABLE CONTACT BACK) */}
              <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                  ⚡ ช่องทางติดต่อกลับลูกค้า (Quick Contact Actions):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* Phone Call */}
                  <a
                    href={`tel:${selectedLead.emailOrLine.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center justify-center gap-2 p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>โทรติดต่อทันที</span>
                  </a>

                  {/* LINE OA / Line Add */}
                  <a
                    href={selectedLead.emailOrLine.includes("@") ? `https://line.me/R/ti/p/~${selectedLead.emailOrLine.replace("LINE:", "").trim()}` : `https://line.me/R/ti/p/~${selectedLead.emailOrLine.replace("LINE:", "").trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                    <span>เปิด LINE แชท</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${selectedLead.emailOrLine}?subject=ข้อเสนอโครงการ Reborn Organization สำหรับ ${encodeURIComponent(selectedLead.company)} จาก บ้านชุ่มฉ่ำ Choomcham House&body=เรียน ${encodeURIComponent(selectedLead.name)} (${encodeURIComponent(selectedLead.position)})\n\nทางทีมบ้านชุ่มฉ่ำ Choomcham House ได้รับข้อมูลความต้องการของ ${encodeURIComponent(selectedLead.company)} เรียบร้อยแล้วครับ\n\nยินดีนัดหมายเพื่อพูดคุยวิเคราะห์โจทย์วัฒนธรรมองค์กรและจัดทำแบบร่าง Transformation Blueprint ครับ`}
                    className="flex items-center justify-center gap-2 p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-colors col-span-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span>ส่งอีเมลตอบกลับลูกค้า (Pre-filled Email)</span>
                  </a>
                </div>
              </div>

              {/* Lead Info Details */}
              <div className="space-y-3.5 bg-white p-4 rounded-2xl border border-slate-200 mb-5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">ชื่อผู้ติดต่อ:</span>
                  <span className="font-bold text-slate-900">{selectedLead.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">ตำแหน่งงาน:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.position}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">ช่องทางติดต่อ:</span>
                  <span className="font-bold text-purple-700 select-all">{selectedLead.emailOrLine}</span>
                </div>
                <div className="flex justify-between items-start text-xs">
                  <span className="text-slate-500 font-medium">หลักสูตร / ความต้องการ:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[200px]">{selectedLead.dimensions_scores?.program_interest || selectedLead.teamSize}</span>
                </div>
                {selectedLead.dimensions_scores?.timeline && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">กรอบเวลาจัดอบรม:</span>
                    <span className="font-semibold text-amber-700">{selectedLead.dimensions_scores.timeline}</span>
                  </div>
                )}
                {selectedLead.dimensions_scores?.details && (
                  <div className="flex flex-col gap-1 text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">รายละเอียดโจทย์เพิ่มเติม:</span>
                    <span className="text-slate-700 bg-slate-50 p-2 rounded-lg leading-relaxed">{selectedLead.dimensions_scores.details}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">วันที่บันทึก:</span>
                  <span className="text-slate-600">{selectedLead.createdAt}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">ผลการประเมิน Zombie Index™:</span>
                  <span className="font-bold text-rose-600">{selectedLead.resultLevel} ({selectedLead.score}/40)</span>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  บันทึกโน้ตของทีมงาน
                </label>
                <textarea
                  defaultValue={selectedLead.notes}
                  onBlur={(e) => updateLeadStatusInSupabase(null, selectedLead.id, selectedLead.status, e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-purple-500"
                  placeholder="บันทึกรายละเอียดการพูดคุย หรือโจทย์เฉพาะขององค์กร..."
                />
              </div>

              {/* Proposal & Transformation Blueprint Generator */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/80 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-purple-950">Choomcham Proposal & Quotation Engine</span>
                </div>
                <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                  สร้างและออกใบเสนอราคาพร้อม 5-Stage Transformation Blueprint ส่งให้องค์กร {selectedLead.company} ได้ทันที
                </p>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const targetProg = selectedLead.dimensions_scores?.program_interest || selectedLead.teamSize || "REBORN PEOPLE & ALIVE TEAM";
                    const proposalUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/proposal?company=${encodeURIComponent(selectedLead.company)}&name=${encodeURIComponent(selectedLead.name)}&position=${encodeURIComponent(selectedLead.position)}&teamSize=${encodeURIComponent(selectedLead.teamSize)}&price=185000&program=${encodeURIComponent(targetProg)}`;
                    return (
                      <>
                        <a
                          href={proposalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[130px] bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>เปิดดู / พิมพ์ Proposal</span>
                        </a>
                        <a
                          href={`/admin/proposals?company=${encodeURIComponent(selectedLead.company)}&name=${encodeURIComponent(selectedLead.name)}&position=${encodeURIComponent(selectedLead.position)}&teamSize=${encodeURIComponent(selectedLead.teamSize)}&program=${encodeURIComponent(targetProg)}`}
                          className="px-3 py-2 bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-800 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1"
                        >
                          <span>ปรับแต่งใน Engine ➔</span>
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(proposalUrl);
                            alert(`คัดลอกลิงก์ Proposal สำหรับ ${selectedLead.company} เรียบร้อยแล้ว!\nหลักสูตร: ${targetProg}\nสามารถส่งให้ลูกค้าเปิดดูหรือพิมพ์ได้ทันทีครับ`);
                          }}
                          className="px-3 py-2 bg-white hover:bg-slate-50 border border-purple-300 text-purple-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          คัดลอกลิงก์
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteLead(selectedLead.id, selectedLead.name)}
                className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs flex items-center gap-1 transition-colors border border-rose-200"
                title="ลบ Lead นี้ออกจากระบบ"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">ลบ Lead</span>
              </button>

              <button
                onClick={() => setSelectedLead(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
