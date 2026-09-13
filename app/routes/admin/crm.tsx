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
  RefreshCw
} from "lucide-react";
import { fetchLeadsFromSupabase, updateLeadStatusInSupabase } from "~/lib/services";

interface CRMLead {
  id: string;
  name: string;
  company: string;
  position: string;
  emailOrLine: string;
  teamSize: string;
  score: number;
  resultLevel: "ALIVE" | "TIRED" | "FADED" | "ZOMBIE";
  status: "NEW" | "CONTACTED" | "CONSULTATION" | "PROPOSAL" | "WON";
  notes?: string;
  createdAt: string;
}

const INITIAL_FALLBACK_LEADS: CRMLead[] = [
  {
    id: "1",
    name: "คุณธนกร เลิศวิริยะ",
    company: "Apex Tech Innovations",
    position: "Chief People Officer",
    emailOrLine: "thanakorn@apex.io",
    teamSize: "100-250 คน",
    score: 14,
    resultLevel: "ZOMBIE",
    status: "NEW",
    notes: "องค์กรเผชิญ Silo หนัก และต้องการ Rebirth Culture ทั้งระบบ",
    createdAt: "10 นาทีที่แล้ว"
  },
  {
    id: "2",
    name: "คุณศศิธร รัตนพงศ์",
    company: "Siam Retail Group",
    position: "HRD Director",
    emailOrLine: "LINE: sasithorn_hr",
    teamSize: "500+ คน",
    score: 21,
    resultLevel: "FADED",
    status: "CONTACTED",
    notes: "โทรติดต่อเบื้องต้นแล้ว นัดประชุม Zoom วันพฤหัสบดีนี้",
    createdAt: "2 ชั่วโมงที่แล้ว"
  },
  {
    id: "3",
    name: "คุณวิทวัส เจริญผล",
    company: "Digital Synergy Agency",
    position: "Managing Director",
    emailOrLine: "vittavat@digisynergy.co",
    teamSize: "30-50 คน",
    score: 26,
    resultLevel: "TIRED",
    status: "CONSULTATION",
    notes: "ผ่านการ Consultation 1-on-1 สนใจโปรแกรม ALIVE TEAM",
    createdAt: "1 วันที่แล้ว"
  },
  {
    id: "4",
    name: "คุณนลินี สุวรรณเวช",
    company: "BioHealth Global",
    position: "Head of Culture & Talent",
    emailOrLine: "nalinee.s@biohealth.com",
    teamSize: "50-100 คน",
    score: 34,
    resultLevel: "ALIVE",
    status: "PROPOSAL",
    notes: "ส่งใบเสนอราคาโปรแกรม LIVING ORGANIZATION เรียบร้อยแล้ว",
    createdAt: "3 วันที่แล้ว"
  },
  {
    id: "5",
    name: "คุณปิยะวัฒน์ มานะกิจ",
    company: "Creative Studio 88",
    position: "Founder & CEO",
    emailOrLine: "piyawat@cs88.design",
    teamSize: "15-30 คน",
    score: 18,
    resultLevel: "FADED",
    status: "WON",
    notes: "เซ็นสัญญาโครงการ Reborn People เรียบร้อย เริ่มเดือนหน้า",
    createdAt: "1 สัปดาห์ที่แล้ว"
  }
];

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
  const [leads, setLeads] = useState<CRMLead[]>(INITIAL_FALLBACK_LEADS);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load real leads from Supabase on mount
  const loadLeads = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchLeadsFromSupabase();
      if (res.success && res.data && res.data.length > 0) {
        const mappedLeads: CRMLead[] = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          company: item.company,
          position: item.position,
          emailOrLine: item.email_or_line,
          teamSize: item.team_size || "ไม่ได้ระบุ",
          score: item.score,
          resultLevel: item.result_level,
          status: item.status || "NEW",
          notes: item.notes || "",
          createdAt: new Date(item.created_at).toLocaleDateString("th-TH")
        }));
        setLeads(mappedLeads);
      }
    } catch (e) {
      console.error("Failed to load Supabase leads", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: CRMLead["status"]) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
    await updateLeadStatusInSupabase(null, leadId, newStatus);
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

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout
      title="B2B CRM Pipeline Management"
      subtitle="ติดตามการแปลง Lead จาก Zombie Diagnostic สู่การนัดหมาย Consultation และโครงการ Transformation"
    >
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
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs transition-colors"
            title="รีเฟรชข้อมูลจาก Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{filteredLeads.length}</span> รายการ
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Layout */}
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
                        "bg-emerald-100 text-emerald-700"
                      }`}>
                        {lead.resultLevel} ({lead.score}/40)
                      </span>
                      <span className="text-[10px] text-slate-400">{lead.createdAt}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                      {lead.company}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">{lead.name} • {lead.position}</p>

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

      {/* Lead Detail Drawer / Modal */}
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
              <div className="my-6">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  ปรับเปลี่ยนสถานะ CRM
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PIPELINE_COLUMNS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleStatusChange(selectedLead.id, col.id as any)}
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

              {/* Lead Info Details */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6">
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
                  <span className="font-bold text-purple-700">{selectedLead.emailOrLine}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">ขนาดทีม:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.teamSize}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">ผลการประเมิน Zombie Index™:</span>
                  <span className="font-bold text-rose-600">{selectedLead.resultLevel} ({selectedLead.score}/40)</span>
                </div>
              </div>

              {/* Notes */}
              <div>
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
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
              <a
                href={`mailto:${selectedLead.emailOrLine}`}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>ส่งอีเมลติดต่อ</span>
              </a>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
