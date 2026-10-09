import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { DimensionRadarChart } from "~/components/DimensionRadarChart";
import { 
  Users, 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  PhoneCall, 
  Download,
  Filter,
  Sparkles,
  Calendar,
  Building2,
  RefreshCw
} from "lucide-react";
import { fetchLeadsFromSupabase, subscribeToLeadsRealtime } from "~/lib/services";
import { calculateDimensionScores } from "~/lib/diagnostic";
import { exportExecutiveReportToExcel } from "~/lib/excel";

export function meta() {
  return [
    { title: "Executive Overview | Choomcham House OS" },
  ];
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchLeadsFromSupabase();
      if (res.success && res.data) {
        setLeads(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch dashboard leads:", e);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Subscribe to realtime changes
    const unsub = subscribeToLeadsRealtime((payload) => {
      loadDashboardData();
    });
    return () => unsub();
  }, []);

  // Compute Real Analytics from actual Supabase leads
  const totalLeadsCount = leads.length;
  const newInquiriesCount = leads.filter(l => l.status === "NEW" || l.status === "CONTACTED").length;
  
  const zombieCount = leads.filter(l => l.result_level === "ZOMBIE").length;
  const fadedCount = leads.filter(l => l.result_level === "FADED").length;
  const tiredCount = leads.filter(l => l.result_level === "TIRED").length;
  const aliveCount = leads.filter(l => l.result_level === "ALIVE").length;

  const urgentRatio = totalLeadsCount > 0 
    ? Math.round(((zombieCount + fadedCount) / totalLeadsCount) * 100)
    : 0;

  const wonCount = leads.filter(l => l.status === "WON" || l.status === "PROPOSAL").length;
  const conversionRate = totalLeadsCount > 0
    ? ((wonCount / totalLeadsCount) * 100).toFixed(1)
    : "0.0";

  const stats = [
    { 
      label: "Total Leads สะสม", 
      value: totalLeadsCount.toString(), 
      change: totalLeadsCount > 0 ? "ข้อมูลจริงในระบบ" : "รอข้อมูลแรก", 
      icon: Users, 
      color: "text-purple-600 bg-purple-50" 
    },
    { 
      label: "รอนัดหมาย / ติดต่อกลับ", 
      value: newInquiriesCount.toString(), 
      change: "ต้องติดต่อใน 24 ชม.", 
      icon: PhoneCall, 
      color: "text-pink-600 bg-pink-50" 
    },
    { 
      label: "สัดส่วน Zombie / Faded", 
      value: `${urgentRatio}%`, 
      change: `${zombieCount + fadedCount} องค์กรเร่งด่วน`, 
      icon: AlertTriangle, 
      color: "text-rose-600 bg-rose-50" 
    },
    { 
      label: "Conversion / Proposal", 
      value: `${conversionRate}%`, 
      change: `${wonCount} โครงการปิดสำเร็จ/เสนอราคา`, 
      icon: TrendingUp, 
      color: "text-emerald-600 bg-emerald-50" 
    },
  ];

  // Calculate 7 Dimensions Average from real lead answers
  const initialDimensions: Record<string, { current: number; max: number; percentage: number }> = {
    energy: { current: 0, max: 8, percentage: 0 },
    meaning: { current: 0, max: 8, percentage: 0 },
    connection: { current: 0, max: 8, percentage: 0 },
    voice: { current: 0, max: 8, percentage: 0 },
    psychological_safety: { current: 0, max: 8, percentage: 0 },
    ownership: { current: 0, max: 8, percentage: 0 },
    creativity: { current: 0, max: 8, percentage: 0 },
  };

  const assessedLeadsWithAnswers = leads.filter(l => Array.isArray(l.answers) && l.answers.length > 0);
  
  if (assessedLeadsWithAnswers.length > 0) {
    let totals: Record<string, number> = {
      energy: 0, meaning: 0, connection: 0, voice: 0, psychological_safety: 0, ownership: 0, creativity: 0
    };

    assessedLeadsWithAnswers.forEach(lead => {
      const dim = lead.dimensions_scores && lead.dimensions_scores.energy 
        ? lead.dimensions_scores 
        : calculateDimensionScores(lead.answers);

      Object.keys(totals).forEach(key => {
        if (dim[key]?.percentage !== undefined) {
          totals[key] += dim[key].percentage;
        }
      });
    });

    const count = assessedLeadsWithAnswers.length;
    Object.keys(totals).forEach(key => {
      const avgPercentage = Math.round(totals[key] / count);
      initialDimensions[key] = {
        current: Number(((avgPercentage / 100) * 8).toFixed(1)),
        max: 8,
        percentage: avgPercentage
      };
    });
  } else {
    // Default standard baseline if empty
    initialDimensions.energy = { current: 3.5, max: 8, percentage: 44 };
    initialDimensions.meaning = { current: 4.8, max: 8, percentage: 60 };
    initialDimensions.connection = { current: 3.2, max: 8, percentage: 40 };
    initialDimensions.voice = { current: 2.8, max: 8, percentage: 35 };
    initialDimensions.psychological_safety = { current: 3.0, max: 8, percentage: 38 };
    initialDimensions.ownership = { current: 4.2, max: 8, percentage: 53 };
    initialDimensions.creativity = { current: 3.4, max: 8, percentage: 43 };
  }

  const maturityCounts = {
    "ZOMBIE (ภาวะวิกฤต)": zombieCount,
    "FADED (พลังจางหาย)": fadedCount,
    "TIRED (เริ่มเหนื่อยล้า)": tiredCount,
    "ALIVE (มีชีวิตชีวา)": aliveCount,
  };

  const handleExportReportExcel = () => {
    exportExecutiveReportToExcel(stats, maturityCounts, initialDimensions, leads);
  };

  return (
    <AdminLayout
      title="Executive Overview & Analytics"
      subtitle="ภาพรวมสถิติการประเมินสุขภาพองค์กร B2B และสถานะการเติบโตของ Choomcham House (Real-time Database)"
    >
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />
            <span>รีเฟรชข้อมูล</span>
          </button>
          <span className="text-xs text-slate-400">อัปเดตอัตโนมัติจาก Supabase</span>
        </div>

        <button
          onClick={handleExportReportExcel}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-102"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ดาวน์โหลดรายงานสรุป Excel (.xlsx)</span>
        </button>
      </div>

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{st.label}</span>
                <div className={`p-2 rounded-xl ${st.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{st.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{st.change}</div>
            </div>
          );
        })}
      </div>

      {/* 2. Main Analytics Grid: 7 Dimensions Benchmark & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* 7 Dimensions Radar Breakdown */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">7 Dimensions Benchmark Analysis</h2>
              <p className="text-xs text-slate-500">จุดแข็งและจุดอ่อนเฉลี่ยของทุกองค์กรที่ทำแบบประเมินในระบบ</p>
            </div>
            <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium border border-purple-200">
              Zombie Index™ Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div className="flex justify-center">
              <DimensionRadarChart scores={initialDimensions} size={280} />
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                มิติที่มีคะแนนต่ำสุดที่ต้องได้รับการ Reborn:
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5">
                <span className="text-sm">🗣️</span>
                <div>
                  <div className="text-xs font-bold text-rose-900">
                    Voice & Feedback ({initialDimensions.voice.percentage}%)
                  </div>
                  <div className="text-[11px] text-rose-700">พนักงานไม่กล้าออกเสียง กลัวกระทบความสัมพันธ์</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2.5">
                <span className="text-sm">🛡️</span>
                <div>
                  <div className="text-xs font-bold text-amber-900">
                    Psychological Safety ({initialDimensions.psychological_safety.percentage}%)
                  </div>
                  <div className="text-[11px] text-amber-700">ไม่กล้าทดลองสิ่งใหม่เพราะกลัวการถูกชี้นิ้วหาคนผิด</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-2.5">
                <span className="text-sm">🤝</span>
                <div>
                  <div className="text-xs font-bold text-purple-900">
                    Connection & Trust ({initialDimensions.connection.percentage}%)
                  </div>
                  <div className="text-[11px] text-purple-700">เกิดกำแพงระหว่างแผนก (Silo) ทำงานตัดขาดจากกัน</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maturity Level Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Maturity Level Breakdown</h2>
              <span className="text-xs text-slate-400">Total {totalLeadsCount} Orgs</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-700">🧟 Zombie (ภาวะวิกฤต)</span>
                  <span className="text-slate-700">{zombieCount} องค์กร ({totalLeadsCount > 0 ? Math.round((zombieCount/totalLeadsCount)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${totalLeadsCount > 0 ? (zombieCount/totalLeadsCount)*100 : 0}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-orange-700">🍂 Faded (พลังจางหาย)</span>
                  <span className="text-slate-700">{fadedCount} องค์กร ({totalLeadsCount > 0 ? Math.round((fadedCount/totalLeadsCount)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${totalLeadsCount > 0 ? (fadedCount/totalLeadsCount)*100 : 0}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700">⚡ Tired (เริ่มเหนื่อยล้า)</span>
                  <span className="text-slate-700">{tiredCount} องค์กร ({totalLeadsCount > 0 ? Math.round((tiredCount/totalLeadsCount)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${totalLeadsCount > 0 ? (tiredCount/totalLeadsCount)*100 : 0}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700">🌿 Alive (มีชีวิตชีวา)</span>
                  <span className="text-slate-700">{aliveCount} องค์กร ({totalLeadsCount > 0 ? Math.round((aliveCount/totalLeadsCount)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${totalLeadsCount > 0 ? (aliveCount/totalLeadsCount)*100 : 0}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-purple-200">Rebirth Target Goal</div>
              <div className="text-sm font-bold mt-0.5">เปลี่ยน Zombie สู่ Living Organization</div>
            </div>
            <Link
              to="/admin/crm"
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-1"
            >
              <span>เปิด CRM ({totalLeadsCount})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Recent Leads Table from Real Database */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Diagnostic Leads</h2>
            <p className="text-xs text-slate-500">รายชื่อองค์กรล่าสุดที่ทำแบบประเมิน Zombie Index™ และฟอร์มติดต่อกลับ</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/crm"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>จัดการบน CRM Pipeline ({totalLeadsCount})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">ผู้ติดต่อ / องค์กร</th>
                <th className="py-3.5 px-6">ตำแหน่ง / ขนาดทีม</th>
                <th className="py-3.5 px-6">ผลประเมิน</th>
                <th className="py-3.5 px-6">คะแนน</th>
                <th className="py-3.5 px-6">สถานะ CRM</th>
                <th className="py-3.5 px-6 text-right">เวลาบันทึก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {leads.slice(0, 10).map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900">{lead.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{lead.company}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs font-medium text-slate-700">{lead.position}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{lead.team_size || "-"}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      lead.result_level === "ZOMBIE" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                      lead.result_level === "FADED" ? "bg-orange-100 text-orange-700 border border-orange-200" :
                      lead.result_level === "TIRED" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      lead.result_level === "ALIVE" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                      "bg-purple-100 text-purple-700 border border-purple-200"
                    }`}>
                      {lead.result_level}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800">
                    {lead.score !== undefined ? lead.score : "-"} <span className="text-xs font-normal text-slate-400">/40</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700">
                      {lead.status || "NEW"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-xs text-slate-400">
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString("th-TH") : "-"}
                  </td>
                </tr>
              ))}

              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    ยังไม่มีข้อมูลผลประเมินในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
